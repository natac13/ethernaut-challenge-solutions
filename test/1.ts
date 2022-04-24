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

    // expect()
  });
});
