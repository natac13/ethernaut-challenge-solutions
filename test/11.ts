import { expect } from "chai";
import { ethers } from "hardhat";

describe("Elevator", function () {
  it("Happy path normal building", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Elevator");
    const contract = await Contract.deploy();
    await contract.deployed();

    const NormalBuilding = await ethers.getContractFactory("NormalBuilding");
    const normalBuilding = await NormalBuilding.connect(me).deploy(
      contract.address
    );
    await normalBuilding.deployed();

    expect(await contract.top()).to.equal(false);
    expect(await contract.floor()).to.equal(0);

    const topFloor = await normalBuilding.numOfFloors();
    await normalBuilding.useElevator(topFloor);
    expect(await contract.top()).to.equal(false);
    expect(await contract.floor()).to.equal(0);

    await normalBuilding.useElevator(9);
    expect(await contract.top()).to.equal(false);
    expect(await contract.floor()).to.equal(9);

    await normalBuilding.useElevator(topFloor);
    expect(await contract.top()).to.equal(false);
    expect(await contract.floor()).to.equal(9);
  });

  it("Happy path bad building", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Elevator");
    const contract = await Contract.deploy();
    await contract.deployed();

    const NormalBuilding = await ethers.getContractFactory("BadBuilding");
    const badBuilding = await NormalBuilding.connect(me).deploy(
      contract.address
    );
    await badBuilding.deployed();

    expect(await contract.top()).to.equal(false);
    expect(await contract.floor()).to.equal(0);

    const topFloor = await badBuilding.numOfFloors();
    await badBuilding.useElevator(topFloor);
    expect(await contract.top()).to.equal(true);
    expect(await contract.floor()).to.equal(10);
  });
});
