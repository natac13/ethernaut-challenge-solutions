import { expect } from "chai";
import { ethers } from "hardhat";

describe("Telephone", function () {
  it("work", async function () {
    const [owner, me] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Telephone");
    const contract = await Contract.deploy();
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level4Solution");
    const solution = await Solution.connect(me).deploy(contract.address);
    await solution.deployed();

    expect(await contract.owner()).to.equal(owner.address);

    await solution.connect(me).takeControl();

    expect(await contract.owner()).to.equal(me.address);
  });
});
