import { expect } from "chai";
import { ethers } from "hardhat";

describe("Perservation", function () {
  it("Happy path", async function () {
    const [owner, me, other] = await ethers.getSigners();

    const Library1 = await ethers.getContractFactory("LibraryContract");
    const library1 = await Library1.deploy();
    await library1.deployed();

    const Library2 = await ethers.getContractFactory("LibraryContract");
    const library2 = await Library2.deploy();
    await library2.deployed();

    const Contract = await ethers.getContractFactory("Preservation");
    const contract = await Contract.deploy(library1.address, library2.address);
    await contract.deployed();

    const AttackLibrary = await ethers.getContractFactory(
      "AttackLibraryContract"
    );
    const attackLibrary = await AttackLibrary.deploy();
    await attackLibrary.deployed();

    const Solution = await ethers.getContractFactory("Level16Solution");
    const solution = await Solution.connect(me).deploy(contract.address);
    await solution.deployed();

    expect(await contract.owner()).to.equal(owner.address);

    await solution.connect(me).attack();

    expect(await contract.owner()).to.equal(me.address);

    // const Solution = await ethers.getContractFactory("Level14Solution");
    // const solution = await Solution.connect(me).deploy(contract.address);
    // await solution.deployed();

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
  });
});
