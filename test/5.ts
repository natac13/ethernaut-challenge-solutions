import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token", function () {
  it("work", async function () {
    const total = ethers.utils.parseUnits("10000", "ether");
    const transferAmount = ethers.utils.parseUnits("20");
    const badamount = ethers.utils.parseUnits("21");
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Token");
    const contract = await Contract.deploy(total);
    await contract.deployed();

    expect(await contract.totalSupply()).to.equal(total);

    expect(await contract.balanceOf(owner.address)).to.equal(total);

    await contract.connect(owner).transfer(me.address, transferAmount);

    expect(await contract.balanceOf(owner.address)).to.equal(
      total.sub(transferAmount)
    );

    expect(await contract.balanceOf(me.address)).to.equal(transferAmount);

    await contract.connect(me).transfer(other.address, badamount);

    expect((await contract.balanceOf(me.address)).gt(10000)).to.be.true;
  });
});
