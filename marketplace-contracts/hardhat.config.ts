import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-abi-exporter";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-gas-reporter";
import "hardhat-spdx-license-identifier";
import "@openzeppelin/hardhat-upgrades";
//import "hardhat-typechain";
import "hardhat-watcher";
import "solidity-coverage";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import { HardhatUserConfig } from "hardhat/types";

let accounts: string[] = [];
if (process.env.PRIVATE_KEY) {
  accounts = [process.env.PRIVATE_KEY];
}
const config: HardhatUserConfig = {
  abiExporter: {
    path: "./abi",
    clear: false,
    flat: true,
    // only: [],
    // except: []
  },
  mocha: {
    timeout: 20000,
  },

  networks: {
    localhost: {
      accounts: accounts,
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      gasPrice: 470000000000,
      chainId: 43112,
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      accounts: accounts,
      chainId: 137,
      live: true,
      saveDeployments: true,
      gasPrice: 470000000000,
    },
    mumbai: {
      url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      accounts: accounts,
      chainId: 80001,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
      gasPrice: 47000000,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: accounts,
      chainId: 43113,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
      gasPrice: 470000000000,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: accounts,
      chainId: 43114,
      live: true,
      saveDeployments: true,
      gasPrice: 470000000000,
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org",
      accounts: accounts,
      chainId: 56,
      live: true,
      saveDeployments: true,
    },
    "bsc-testnet": {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545",
      accounts: accounts,
      chainId: 97,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      gasMultiplier: 2,
    },
    "areon-testnet": {
      url: "https://testnet-rpc.areon.network",
      accounts: accounts,
      chainId: 462,
    },
  },
  paths: {
    artifacts: "artifacts",
    cache: "cache",
    deploy: "deploy",
    deployments: "deployments",
    imports: "imports",
    sources: "contracts",
    tests: "test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 250,
          },
        },
      },
    ],
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
};

export default config;
