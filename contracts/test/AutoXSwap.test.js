const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoXSwap", function () {
  let autoXSwap, autoXToken, shiftToken;
  let owner, user1, user2;
  let ownerAddress, user1Address, user2Address;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();

    // Deploy AutoXToken
    const AutoXToken = await ethers.getContractFactory("AutoXToken");
    autoXToken = await AutoXToken.deploy();
    await autoXToken.waitForDeployment();

    // Deploy ShiftToken
    const ShiftToken = await ethers.getContractFactory("ShiftToken");
    shiftToken = await ShiftToken.deploy();
    await shiftToken.waitForDeployment();

    // Deploy AutoXSwap
    const AutoXSwap = await ethers.getContractFactory("AutoXSwap");
    autoXSwap = await AutoXSwap.deploy(ownerAddress);
    await autoXSwap.waitForDeployment();

    // Configure supported tokens
    await autoXSwap.setSupportedToken(await autoXToken.getAddress(), true);
    await autoXSwap.setSupportedToken(await shiftToken.getAddress(), true);

    // Add AutoXSwap as minter
    await autoXToken.addMinter(await autoXSwap.getAddress());
    await shiftToken.addMinter(await autoXSwap.getAddress());

    // Mint tokens to users
    const mintAmount = ethers.parseEther("1000");
    await autoXToken.mint(user1Address, mintAmount);
    await shiftToken.mint(user1Address, mintAmount);
    await autoXToken.mint(user2Address, mintAmount);
    await shiftToken.mint(user2Address, mintAmount);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await autoXSwap.owner()).to.equal(ownerAddress);
    });

    it("Should set supported tokens correctly", async function () {
      expect(await autoXSwap.supportedTokens(await autoXToken.getAddress())).to.be.true;
      expect(await autoXSwap.supportedTokens(await shiftToken.getAddress())).to.be.true;
    });
  });

  describe("Quote Generation", function () {
    it("Should generate a quote for supported tokens", async function () {
      const amountIn = ethers.parseEther("100");
      const quoteId = await autoXSwap.generateQuote(
        await autoXToken.getAddress(),
        await shiftToken.getAddress(),
        amountIn
      );
      
      expect(quoteId).to.be.a("string");
      expect(quoteId.length).to.be.greaterThan(0);
    });

    it("Should revert for unsupported tokens", async function () {
      const amountIn = ethers.parseEther("100");
      const unsupportedToken = user1Address; // Random address
      
      await expect(
        autoXSwap.generateQuote(
          unsupportedToken,
          await shiftToken.getAddress(),
          amountIn
        )
      ).to.be.revertedWith("AutoXSwap: fromToken not supported");
    });
  });

  describe("Token Swaps", function () {
    it("Should execute a successful swap", async function () {
      const amountIn = ethers.parseEther("100");
      const minAmountOut = ethers.parseEther("140"); // Expect ~150 with 1.5x rate
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      // Approve tokens
      await autoXToken.connect(user1).approve(await autoXSwap.getAddress(), amountIn);

      // Execute swap
      const swapParams = {
        fromToken: await autoXToken.getAddress(),
        toToken: await shiftToken.getAddress(),
        amountIn: amountIn,
        minAmountOut: minAmountOut,
        recipient: user1Address,
        deadline: deadline,
        slippageTolerance: 100 // 1%
      };

      const tx = await autoXSwap.connect(user1).executeSwap(swapParams);
      const receipt = await tx.wait();

      // Check events
      const swapEvent = receipt.logs.find(log => {
        try {
          const parsed = autoXSwap.interface.parseLog(log);
          return parsed.name === "SwapExecuted";
        } catch {
          return false;
        }
      });

      expect(swapEvent).to.not.be.undefined;
    });

    it("Should revert swap with insufficient allowance", async function () {
      const amountIn = ethers.parseEther("100");
      const minAmountOut = ethers.parseEther("140");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const swapParams = {
        fromToken: await autoXToken.getAddress(),
        toToken: await shiftToken.getAddress(),
        amountIn: amountIn,
        minAmountOut: minAmountOut,
        recipient: user1Address,
        deadline: deadline,
        slippageTolerance: 100
      };

      await expect(
        autoXSwap.connect(user1).executeSwap(swapParams)
      ).to.be.reverted;
    });

    it("Should revert swap with expired deadline", async function () {
      const amountIn = ethers.parseEther("100");
      const minAmountOut = ethers.parseEther("140");
      const deadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      await autoXToken.connect(user1).approve(await autoXSwap.getAddress(), amountIn);

      const swapParams = {
        fromToken: await autoXToken.getAddress(),
        toToken: await shiftToken.getAddress(),
        amountIn: amountIn,
        minAmountOut: minAmountOut,
        recipient: user1Address,
        deadline: deadline,
        slippageTolerance: 100
      };

      await expect(
        autoXSwap.connect(user1).executeSwap(swapParams)
      ).to.be.revertedWith("AutoXSwap: deadline passed");
    });
  });

  describe("Access Control", function () {
    it("Should allow only owner to set supported tokens", async function () {
      await expect(
        autoXSwap.connect(user1).setSupportedToken(await autoXToken.getAddress(), false)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow only owner to pause", async function () {
      await expect(
        autoXSwap.connect(user1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Statistics", function () {
    it("Should track user statistics correctly", async function () {
      const amountIn = ethers.parseEther("100");
      const minAmountOut = ethers.parseEther("140");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await autoXToken.connect(user1).approve(await autoXSwap.getAddress(), amountIn);

      const swapParams = {
        fromToken: await autoXToken.getAddress(),
        toToken: await shiftToken.getAddress(),
        amountIn: amountIn,
        minAmountOut: minAmountOut,
        recipient: user1Address,
        deadline: deadline,
        slippageTolerance: 100
      };

      await autoXSwap.connect(user1).executeSwap(swapParams);

      const [swaps, volume] = await autoXSwap.getUserStats(user1Address);
      expect(swaps).to.equal(1);
      expect(volume).to.equal(amountIn);
    });
  });
});
