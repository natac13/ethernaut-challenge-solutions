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

  it("Contract Version", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Delegate = await ethers.getContractFactory("TestDelegateCall");
    const delegate = await Delegate.deploy();
    await delegate.deployed();

    const Contract = await ethers.getContractFactory("DelegateCall");
    const contract = await Contract.deploy();
    await contract.deployed();

    expect(await delegate.sender()).to.equal(ethers.constants.AddressZero);
    expect(await delegate.num()).to.equal(0);
    expect(await delegate.value()).to.equal(0);
    expect(await contract.sender()).to.equal(ethers.constants.AddressZero);
    expect(await contract.num()).to.equal(0);
    expect(await contract.value()).to.equal(0);

    await contract
      .connect(me)
      .setVars(delegate.address, ethers.BigNumber.from("1313"), {
        value: ethers.utils.parseUnits("1", "gwei"),
      });

    expect(await contract.sender()).to.equal(me.address);
    expect(await contract.num()).to.equal(ethers.BigNumber.from("1313"));
    expect(await contract.value()).to.equal(
      ethers.utils.parseUnits("1", "gwei")
    );
    expect(await delegate.sender()).to.equal(ethers.constants.AddressZero);
    expect(await delegate.num()).to.equal(0);
    expect(await delegate.value()).to.equal(0);
  });
});
