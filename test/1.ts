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

    const Solution = await ethers.getContractFactory("Level1Solution");
    const solution = await Solution.deploy(contract.address, {
      value: ethers.utils.parseEther("0.001"),
    });
    await solution.deployed();

    expect(await contract.owner()).to.equal(solution.address);

    expect(
      await (await ethers.provider.getBalance(contract.address)).toNumber()
    ).to.be.greaterThanOrEqual(0);

    expect(
      (await ethers.provider.getBalance(solution.address)).toNumber()
    ).to.be.greaterThanOrEqual(0.0002);

    const tx = await solution.connect(owner).withdraw();
    const rc = await tx.wait();
    const event = rc?.events?.find((e) => e?.event === "ReceivedAmount");
    const amount = event?.args?.[0]?.toNumber();
    console.log(
      "Amount Received: ",
      `${ethers.utils.formatEther(amount)} ether`
    );

    expect(
      await (await ethers.provider.getBalance(solution.address)).toNumber()
    ).to.be.greaterThanOrEqual(0);
  });
});
