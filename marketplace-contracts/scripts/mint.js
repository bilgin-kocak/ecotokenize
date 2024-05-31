const hre = require("hardhat");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

async function main() {
  const wallet = new hre.ethers.Wallet(
    process.env.PRIVATE_KEY,
    hre.ethers.provider
  );
  // Deploying the ProtocolFeeSettings contract
  const TestGameNFT = await hre.ethers.getContractFactory("TestGameNFT");
  const testGameNFT = new hre.ethers.Contract(
    "0x3ee41873Bb737D204C746d155ABf9A2Ea2636B8B",
    TestGameNFT.interface,
    wallet
  );

  for (let i = 1; i < 26; i++) {
    await testGameNFT.safeMint(
      "0x48D185bc646534597E25199dd4d73692ebD98BAc",
      i.toString(),
      {
        gasLimit: 1000000,
      }
    );
    console.log("minted", i);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
