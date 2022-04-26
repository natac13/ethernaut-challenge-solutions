import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vault", function () {
  it("Happy path", async function () {
    const [owner, me] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Vault");
    const password = ethers.utils.formatBytes32String("testing123");
    const contract = await Contract.deploy(password);
    await contract.deployed();

    expect(await contract.locked()).to.equal(true);

    const locked = await ethers.provider.getStorageAt(contract.address, 0);
    const foundPass = await ethers.provider.getStorageAt(contract.address, 1);

    const l = (await ethers.utils.stripZeros(locked)).toString();
    const p = await ethers.utils.parseBytes32String(foundPass);

    expect(Boolean(l)).to.equal(true);
    expect(p).to.equal("testing123");

    await contract.unlock(ethers.utils.formatBytes32String(p));

    expect(await contract.locked()).to.equal(false);

    const lockedAfter = await ethers.provider.getStorageAt(contract.address, 0);
    const lAfter = (await ethers.utils.stripZeros(lockedAfter)).toString();
    expect(Boolean(lAfter)).to.equal(false);
  });
});
