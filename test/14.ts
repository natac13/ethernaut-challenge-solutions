import { expect } from "chai";
import { ethers } from "hardhat";

describe("GatekeeperTwo", function () {
  it("Happy path", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("GatekeeperTwo");
    const contract = await Contract.deploy();
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level14Solution");
    const solution = await Solution.connect(me).deploy(contract.address);
    await solution.deployed();

    // const bytesKeyOne = `0x0000000000001234`;

    // console.log(await solution.partOne(bytesKeyOne));
    // expect(await solution.partOne(bytesKeyOne)).to.equal(owner.address);

    // await expect(solution.partTwo(bytesKeyOne)).to.be.revertedWith(
    //   "GatekeeperOne: invalid gateThree part two"
    // );

    // const bytesKeyTwo = `0x1111111100001234`;
    // expect(await solution.partTwo(bytesKeyTwo)).to.equal(owner.address);

    // await expect(solution.partThree(bytesKeyTwo)).to.be.revertedWith(
    //   "GatekeeperOne: invalid gateThree part three"
    // );

    // expect(await solution.partThree(bytesKeyThree)).to.equal(owner.address);
    expect(await contract.entrant()).to.equal(me.address);
  });
});
