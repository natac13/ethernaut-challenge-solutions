import { expect } from "chai";
import { ethers } from "hardhat";
import { Arrays } from "../typechain";

describe("Arrays", function () {
  let owner, me, other, contract: Arrays;
  beforeEach(async () => {
    [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Arrays");
    contract = await Contract.deploy();
    await contract.deployed();
  });
  it("Happy path", async function () {
    expect(await contract.stored(0)).to.equal(1);
    expect(await contract.stored(1)).to.equal(2);
    expect(await contract.stored(2)).to.equal(3);
    expect(await contract.stored(3)).to.equal(4);
    expect(await contract.stored(4)).to.equal(5);
  });

  it("Should shift", async () => {
    await contract.removeShift(1);

    expect(await contract.stored(0)).to.equal(1);
    expect(await contract.stored(1)).to.equal(3);
    expect(await contract.stored(2)).to.equal(4);
    expect(await contract.stored(3)).to.equal(5);
  });

  it("Should move last to gap", async () => {
    await contract.removeLastFill(1);

    expect(await contract.stored(0)).to.equal(1);
    expect(await contract.stored(1)).to.equal(16);
    expect(await contract.stored(2)).to.equal(3);
    expect(await contract.stored(3)).to.equal(4);
  });
});
