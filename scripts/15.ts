import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0x95537014122Eeca50c72520c15ED02a11e05FadD";
const SOLUTION_ADDRESS = "0x6e7F85bFb4fbbF4d50485fcE91Cfffb5CdfD521c";

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

  const Contract = await ethers.getContractFactory("NaughtCoin");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  // with contract - does not pass level though as the new owner address is different
  const Solution = await ethers.getContractFactory("Level15Solution");
  const solution = await Solution.attach(SOLUTION_ADDRESS);
  await solution.deployed();

  // console.log(
  //   "Balance start: ",
  //   ethers.utils.formatEther(await contract.balanceOf(me.address))
  // );

  // await contract
  //   .connect(me)
  //   .approve(solution.address, ethers.utils.parseEther("1000000"));

  // console.log("After approval");

  // await solution.attack({ gasLimit: 500000 });

  // console.log("After attack");

  // console.log(
  //   "Balance end: ",
  //   ethers.utils.formatEther(await contract.balanceOf(me.address))
  // );

  console.log(
    "Balance me: ",
    ethers.utils.formatEther(await contract.balanceOf(me.address))
  );

  console.log(
    "Balance solution contract: ",
    ethers.utils.formatEther(await contract.balanceOf(solution.address))
  );

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
