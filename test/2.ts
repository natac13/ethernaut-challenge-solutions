import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fallout", function () {
  it("work", async function () {
    const Contract = await ethers.getContractFactory("Fallout");
    const contract = await Contract.deploy();
    await contract.deployed();

    const [owner, me] = await ethers.getSigners();

    expect(await contract.owner()).to.equal(
      ethers.constants.AddressZero,
      "Not the zero address"
    );

    await contract
      .connect(me)
      .Fal1out({ value: ethers.utils.parseUnits("500", "wei") });

    expect(await contract.owner()).to.equal(me.address);

    expect(await ethers.provider.getBalance(contract.address)).to.equal(
      ethers.utils.parseUnits("500", "wei")
    );

    await contract.connect(me).collectAllocations();

    expect(await ethers.provider.getBalance(contract.address)).to.equal(
      ethers.utils.parseUnits("0", "wei")
    );
  });
});
