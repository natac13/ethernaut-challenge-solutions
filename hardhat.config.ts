import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  // solidity: "0.8.10",
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {},
      },
      { version: "0.6.0", settings: {} },
    ],
    overrides: {
      "contracts/5/Token.sol": {
        version: "0.6.0",
        settings: {},
      },
    },
  },
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts:
        typeof RINKEBY_PRIVATE_KEY === "string" ? [RINKEBY_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COIN_MARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
