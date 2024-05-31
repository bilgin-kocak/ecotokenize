const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Obtaining the Addresses
  if (!fs.existsSync(`./addresses/${hre.network.config.chainId}.json`)) {
    // if (!fs.existsSync(`./addresses/43112.json`)) {
    console.log(
      "No address file found, please deploy the core contracts first"
    );
    process.exit(1);
  }
  let addresses = JSON.parse(
    fs.readFileSync(`./addresses/${hre.network.config.chainId}.json`)
    // fs.readFileSync(`./addresses/43112.json`)
  );
  if (!addresses.ProtocolFeeSettings || !addresses.ModuleManager) {
    console.log(
      "No ZPFS or ZMM addresses found, please deploy the core contracts first"
    );
    process.exit(1);
  }

  const BaseTransferHelper = await hre.ethers.getContractFactory(
    "BaseTransferHelper"
  );
  const baseTransferHelper = await BaseTransferHelper.deploy(
    addresses.ModuleManager
  );
  await baseTransferHelper.deployed();
  console.log("BaseTransferHelper deployed to:", baseTransferHelper.address);

  const ERC20TransferHelper = await hre.ethers.getContractFactory(
    "ERC20TransferHelper"
  );
  const erc20TransferHelper = await ERC20TransferHelper.deploy(
    addresses.ModuleManager
  );
  await erc20TransferHelper.deployed();
  console.log("ERC20TransferHelper deployed to:", erc20TransferHelper.address);

  const ERC721TransferHelper = await hre.ethers.getContractFactory(
    "ERC721TransferHelper"
  );
  const erc721TransferHelper = await ERC721TransferHelper.deploy(
    addresses.ModuleManager
  );
  await erc721TransferHelper.deployed();
  console.log(
    "ERC721TransferHelper deployed to:",
    erc721TransferHelper.address
  );

  const ERC1155TransferHelper = await hre.ethers.getContractFactory(
    "ERC721TransferHelper"
  );
  const erc1155TransferHelper = await ERC1155TransferHelper.deploy(
    addresses.ModuleManager
  );
  await erc1155TransferHelper.deployed();
  console.log(
    "ERC1155TransferHelper deployed to:",
    erc1155TransferHelper.address
  );

  // Deploy RoyaltyRegistry
  const RoyaltyRegistry = await hre.ethers.getContractFactory(
    "OurRoyaltyRegistry"
  );
  const royaltyRegistry = await RoyaltyRegistry.deploy();
  await royaltyRegistry.deployed();
  await royaltyRegistry.initialize();
  console.log("RoyaltyRegistry deployed to:", royaltyRegistry.address);

  // Deploy RoyaltyOverride which is used to set royalty percentages
  const RoyaltyOverride = await hre.ethers.getContractFactory(
    "EIP2981RoyaltyOverride"
  );
  const royaltyOverride = await RoyaltyOverride.deploy();
  await royaltyOverride.deployed();
  console.log("RoyaltyOverride deployed to:", royaltyOverride.address);

  // Deploy royalty engines
  const RoyaltyEngine = await hre.ethers.getContractFactory("OurRoyaltyEngine");
  const royaltyEngine = await RoyaltyEngine.deploy();
  await royaltyEngine.deployed();
  await royaltyEngine.initialize(royaltyRegistry.address);
  console.log("RoyaltyEngine deployed to:", royaltyEngine.address);

  //  DEPLOYING ASK MODULES

  const FixedSalesV1 = await hre.ethers.getContractFactory("FixedSalesV1");
  const fixedSalesV1 = await FixedSalesV1.deploy(
    erc20TransferHelper.address,
    erc721TransferHelper.address,
    royaltyEngine.address,
    addresses.ProtocolFeeSettings,
    process.env.ERC20_ADDRESS
  );

  await fixedSalesV1.deployed();

  console.log("FixedSalesV1 deployed to:", fixedSalesV1.address);

  const OffersV1 = await hre.ethers.getContractFactory("OffersV1");
  const offersV1 = await OffersV1.deploy(
    erc20TransferHelper.address,
    erc721TransferHelper.address,
    royaltyEngine.address,
    addresses.ProtocolFeeSettings,
    process.env.ERC20_ADDRESS
  );

  await offersV1.deployed();

  //  DEPLOYING OFFER MODULE

  console.log("OffersV1 deployed to:", offersV1.address);
  console.log("Module Offer is deployed!");

  //  DEPLOYING RESERVE AUCTION MODULES

  // Deploy Reserve Auction Core Module
  const ReserveAuctionCoreErc20 = await hre.ethers.getContractFactory(
    "ReserveAuctionCoreErc20"
  );
  const reserveAuctionCoreErc20 = await ReserveAuctionCoreErc20.deploy(
    erc20TransferHelper.address,
    erc721TransferHelper.address,
    royaltyEngine.address,
    addresses.ProtocolFeeSettings,
    process.env.ERC20_ADDRESS
  );
  await reserveAuctionCoreErc20.deployed();
  console.log(
    "ReserveAuctionCoreErc20 deployed to:",
    reserveAuctionCoreErc20.address
  );

  // Saving the addresses to a file
  addresses = {
    ...addresses,
    BaseTransferHelper: baseTransferHelper.address,
    ERC20TransferHelper: erc20TransferHelper.address,
    ERC721TransferHelper: erc721TransferHelper.address,
    ERC1155TransferHelper: erc1155TransferHelper.address,
    RoyaltyRegistry: royaltyRegistry.address,
    RoyaltyEngine: royaltyEngine.address,
    RoyaltyOverride: royaltyOverride.address,
    FixedSalesV1: fixedSalesV1.address,
    OffersV1: offersV1.address,
    ReserveAuctionCoreErc20: reserveAuctionCoreErc20.address,
  };
  var jsonAddress = JSON.stringify(addresses, null, 2);
  fs.writeFileSync(
    `./addresses/${hre.network.config.chainId}.json`,
    // `./addresses/43112.json`,
    jsonAddress,
    "utf8"
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
