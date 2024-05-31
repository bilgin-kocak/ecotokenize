const hre = require("hardhat");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

async function main() {
  // Deploying the ProtocolFeeSettings contract
  const TestGameNFT = await hre.ethers.getContractFactory("TestGameNFT");
  const testGameNFT = await TestGameNFT.deploy();

  await testGameNFT.deployed();

  console.log("TestGameNFT deployed to:", testGameNFT.address);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
