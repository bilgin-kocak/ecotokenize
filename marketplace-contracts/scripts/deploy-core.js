const hre = require("hardhat");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

async function main() {
  const REGISTRAR_ADDRESS = process.env.REGISTRAR;
  console.log("Using registrar address:", REGISTRAR_ADDRESS);

  const FEE_SETTINGS_OWNER = process.env.FEE_SETTINGS_OWNER;
  console.log("Using fee settings owner:", FEE_SETTINGS_OWNER);

  // Deploying the ProtocolFeeSettings contract
  const ProtocolFeeSettings = await hre.ethers.getContractFactory(
    "ProtocolFeeSettings"
  );
  const protocolFeeSettings = await ProtocolFeeSettings.deploy();

  await protocolFeeSettings.deployed();

  const feeSettingsAddress = protocolFeeSettings.address;
  console.log("ProtocolFeeSettings deployed to:", feeSettingsAddress);

  /******* START EDUM token create *******/
  // Deploying the EDUM contract
  // const EDUMEDU = await hre.ethers.getContractFactory("EDUMEDU");
  // const edumedu = await EDUMEDU.deploy(

  // );

  // await edumedu.deployed();
  // console.log("EDUMEDU deployed to: ", edumedu.address);

  /******* END EDUM token create *******/

  // Deploying the ModuleManager contract
  const ModuleManager = await hre.ethers.getContractFactory("ModuleManager");
  const moduleManager = await ModuleManager.deploy(
    REGISTRAR_ADDRESS,
    feeSettingsAddress
  );

  await moduleManager.deployed();

  console.log("ModuleManager deployed to:", moduleManager.address);

  console.log("Protocol Core is deployed!");

  // Saving the addresses to a file
  addresses = {
    ProtocolFeeSettings: feeSettingsAddress,
    ModuleManager: moduleManager.address,
    // EDUMEDU: edumedu.address,
  };
  var jsonAddress = JSON.stringify(addresses, null, 2);
  fs.writeFileSync(
    `./addresses/${hre.network.config.chainId}.json`,
    // "./addresses/43112.json",
    jsonAddress,
    "utf8"
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
