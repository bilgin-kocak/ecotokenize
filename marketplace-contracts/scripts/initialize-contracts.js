const hre = require("hardhat");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
// const addresses = require(`../addresses/${hre.network.config.chainId}.json`);
const addresses = require(`../addresses/462.json`);
const moduleManagerAbi = require("../abi/ModuleManager.json");
const protocolFeeSettingsAbi = require("../abi/ProtocolFeeSettings.json");

let httpProvider = new ethers.providers.JsonRpcProvider(hre.network.config.url);

// Signer
const signer = new ethers.Wallet(hre.network.config.accounts[0], httpProvider);

async function main() {
  const PROTOCOL_FEE_RECIPIENT = process.env.PROTOCOL_FEE_RECIPIENT;
  console.log("Using protocol fee recipient address:", PROTOCOL_FEE_RECIPIENT);

  const FEE_SETTINGS_OWNER = process.env.FEE_SETTINGS_OWNER;
  console.log("Using fee settings owner:", FEE_SETTINGS_OWNER);

  const moduleManager = new ethers.Contract(
    addresses.ModuleManager,
    moduleManagerAbi,
    signer
  );

  const protocolFeeSettings = new ethers.Contract(
    addresses.ProtocolFeeSettings,
    protocolFeeSettingsAbi,
    signer
  );

  console.log("Protocol fee settings is initializing...");
  await protocolFeeSettings.init(
    addresses.ModuleManager,
    "0x0000000000000000000000000000000000000000",
    { gasLimit: 500000 }
  );

  console.log("Setting the owner of protocol fee settings...");
  await protocolFeeSettings.setOwner(FEE_SETTINGS_OWNER, { gasLimit: 500000 });

  // Registering modules
  await moduleManager.registerModule(addresses.FixedSalesV1, {
    gasLimit: 100000,
  });
  await moduleManager.registerModule(addresses.OffersV1, { gasLimit: 100000 });
  await moduleManager.registerModule(addresses.ReserveAuctionCoreErc20, {
    gasLimit: 100000,
  });
  console.log("Module are registered!");

  // Setting reserve auction fee parameters
  // await protocolFeeSettings.setFeeParams(
  //   addresses.ReserveAuctionCoreErc20,
  //   PROTOCOL_FEE_RECIPIENT,
  //   0
  // );
  // console.log("Reserve auction fee parameters are set!");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
