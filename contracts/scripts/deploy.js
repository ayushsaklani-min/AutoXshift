const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AutoXShift contracts to Polygon Amoy...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy AutoXToken
  console.log("\n📦 Deploying AutoXToken...");
  const AutoXToken = await ethers.getContractFactory("AutoXToken");
  const autoXToken = await AutoXToken.deploy();
  await autoXToken.waitForDeployment();
  const autoXTokenAddress = await autoXToken.getAddress();
  console.log("AutoXToken deployed to:", autoXTokenAddress);

  // Deploy ShiftToken
  console.log("\n📦 Deploying ShiftToken...");
  const ShiftToken = await ethers.getContractFactory("ShiftToken");
  const shiftToken = await ShiftToken.deploy();
  await shiftToken.waitForDeployment();
  const shiftTokenAddress = await shiftToken.getAddress();
  console.log("ShiftToken deployed to:", shiftTokenAddress);

  // Deploy AutoXSwap
  console.log("\n📦 Deploying AutoXSwap...");
  const AutoXSwap = await ethers.getContractFactory("AutoXSwap");
  const autoXSwap = await AutoXSwap.deploy(deployer.address); // Deployer as fee recipient
  await autoXSwap.waitForDeployment();
  const autoXSwapAddress = await autoXSwap.getAddress();
  console.log("AutoXSwap deployed to:", autoXSwapAddress);

  // Configure AutoXSwap
  console.log("\n⚙️ Configuring AutoXSwap...");
  await autoXSwap.setSupportedToken(autoXTokenAddress, true);
  await autoXSwap.setSupportedToken(shiftTokenAddress, true);
  console.log("Added supported tokens to AutoXSwap");

  // Add AutoXSwap as minter for both tokens
  console.log("\n🔑 Setting up minters...");
  await autoXToken.addMinter(autoXSwapAddress);
  await shiftToken.addMinter(autoXSwapAddress);
  console.log("Added AutoXSwap as minter for both tokens");

  // Add deployer as minter for initial token distribution
  await autoXToken.addMinter(deployer.address);
  await shiftToken.addMinter(deployer.address);
  console.log("Added deployer as minter for initial distribution");

  // Mint some test tokens to deployer
  console.log("\n💰 Minting test tokens...");
  const mintAmount = ethers.parseEther("10000"); // 10,000 tokens each
  await autoXToken.mint(deployer.address, mintAmount);
  await shiftToken.mint(deployer.address, mintAmount);
  console.log("Minted 10,000 AUTOX and 10,000 SHIFT tokens to deployer");

  // Save deployment info
  const deploymentInfo = {
    network: "polygon-amoy",
    chainId: 80002,
    deployer: deployer.address,
    contracts: {
      AutoXToken: {
        address: autoXTokenAddress,
        name: "AutoX Token",
        symbol: "AUTOX"
      },
      ShiftToken: {
        address: shiftTokenAddress,
        name: "Shift Token", 
        symbol: "SHIFT"
      },
      AutoXSwap: {
        address: autoXSwapAddress,
        name: "AutoXSwap",
        description: "AI-Powered Cross-Chain Payment Router"
      }
    },
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');
  const deploymentPath = path.join(__dirname, '..', 'deployments', 'amoy.json');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.dirname(deploymentPath);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);

  console.log("\n✅ Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("AutoXToken:", autoXTokenAddress);
  console.log("ShiftToken:", shiftTokenAddress);
  console.log("AutoXSwap:", autoXSwapAddress);
  
  console.log("\n🔗 PolygonScan Links:");
  console.log(`AutoXToken: https://amoy.polygonscan.com/address/${autoXTokenAddress}`);
  console.log(`ShiftToken: https://amoy.polygonscan.com/address/${shiftTokenAddress}`);
  console.log(`AutoXSwap: https://amoy.polygonscan.com/address/${autoXSwapAddress}`);

  console.log("\n🎉 Ready for frontend integration!");
  console.log("Add these addresses to your .env.local file:");
  console.log(`NEXT_PUBLIC_AUTOX_TOKEN_ADDRESS=${autoXTokenAddress}`);
  console.log(`NEXT_PUBLIC_SHIFT_TOKEN_ADDRESS=${shiftTokenAddress}`);
  console.log(`NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS=${autoXSwapAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
