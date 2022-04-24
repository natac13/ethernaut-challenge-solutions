import { expect } from "chai";
import { ethers } from "hardhat";
import { TestEvent } from "../typechain";

describe("TestEvent", function () {
  it("happy path", async function () {
    const _amount = 3;
    const Contract = await ethers.getContractFactory("TestEvent");
    const contract = (await Contract.deploy()) as TestEvent;
    await contract.deployed();

    const tx = await contract.mint(_amount); // 100ms
    const rc = await tx.wait(); // 0ms, as tx is already confirmed
    const event = rc?.events?.find((event) => event.event === "TokensMinted");
    const args = event?.args;

    const amount = args?.[0].toNumber();

    expect(amount).to.equal(_amount);
  });
});
