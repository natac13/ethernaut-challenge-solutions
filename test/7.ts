import { expect } from "chai";
import { ethers } from "hardhat";

describe("Delegation", function () {
  it("work", async function () {
    const [owner, me] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Force");
    const contract = await Contract.deploy();
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level7Solution");
    const solution = await Solution.connect(me).deploy();
    await solution.deployed();

    expect(await ethers.provider.getBalance(contract.address)).to.equal(0);

    const value = ethers.utils.parseUnits("500", "wei");
    await solution.forceSend(contract.address, { value });

    expect(await ethers.provider.getBalance(contract.address)).to.equal(value);
  });
});
