const hre = require("hardhat");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

async function main() {
  const wallet = new hre.ethers.Wallet(
    process.env.PRIVATE_KEY,
    hre.ethers.provider
  );

  console.log("wallet", wallet.address);

  const ProtocolFeeSettings = await hre.ethers.getContractFactory(
    "ProtocolFeeSettings"
  );
  const protocolFeeSettings = new hre.ethers.Contract(
    "0xd7f64B027d59D746b532E5916F607E6099642AbE",
    ProtocolFeeSettings.interface,
    hre.ethers.provider
  );

  await protocolFeeSettings
    .connect(wallet)
    .init(
      "0x4ce3AaA345A2E4dE887B3ACA472D7aFFAe2D3AF2",
      "0x0000000000000000000000000000000000000000",
      { gasLimit: 1000000 }
    );

  console.log("protocol fee settings initiliazed");

  const FixedSalesV1 = await hre.ethers.getContractFactory("FixedSalesV1");
  //   console.log("FixedSalesV1", FixedSalesV1);

  const fixedSalesV1 = new hre.ethers.Contract(
    "0x3ee41873Bb737D204C746d155ABf9A2Ea2636B8B",
    FixedSalesV1.interface,
    hre.ethers.provider
  );

  console.log("fixedSalesV1", fixedSalesV1.address);

  const ModuleManager = await hre.ethers.getContractFactory("ModuleManager");

  const moduleManager = new hre.ethers.Contract(
    "0x4ce3AaA345A2E4dE887B3ACA472D7aFFAe2D3AF2",
    ModuleManager.interface,
    hre.ethers.provider
  );

  await moduleManager
    .connect(wallet)
    .registerModule(fixedSalesV1.address, { gasLimit: 1000000 });

  await moduleManager
    .connect(wallet)
    .setApprovalForModule(fixedSalesV1.address, true, { gasLimit: 1000000 });

  console.log("done");

  const TestERC721 = await hre.ethers.getContractFactory("TestERC721");
  const testERC721 = new hre.ethers.Contract(
    "0x47ffb86847110fa0c0d84c0affa56e512cd81dc2",
    TestERC721.interface,
    hre.ethers.provider
  );

  await testERC721
    .connect(wallet)
    .setApprovalForAll("0x717B39602E8CabB14552E5C6D12f3e09C5993754", true, {
      gasLimit: 1000000,
    });

  console.log("done");

  await fixedSalesV1
    .connect(wallet)
    .createFixedSale(
      "0x47ffb86847110fa0c0d84c0affa56e512cd81dc2",
      1,
      hre.ethers.utils.parseEther("0.1"),
      "0x0000000000000000000000000000000000000000",
      wallet.address,
      0,
      { gasLimit: 1000000 }
    );

  console.log("tamamlandı");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
