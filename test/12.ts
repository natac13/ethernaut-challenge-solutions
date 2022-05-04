import { expect } from "chai";
import { ethers } from "hardhat";

describe("Privacy", function () {
  it("Happy path", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Privacy");
    const bytesData = [
      ethers.utils.formatBytes32String("Testing123"),
      ethers.utils.formatBytes32String("Testing123"),
      ethers.utils.formatBytes32String("Testing"),
    ];
    // @ts-ignore
    const contract = await Contract.deploy(bytesData);
    await contract.deployed();

    // const locked = await ethers.provider.getStorageAt(contract.address, 0);
    // const id = await ethers.provider.getStorageAt(contract.address, 1);
    const group = await ethers.provider.getStorageAt(contract.address, 2);
    // const bytesArray0 = await ethers.provider.getStorageAt(contract.address, 3);
    // const bytesArray1 = await ethers.provider.getStorageAt(contract.address, 4);
    const bytesArray2 = await ethers.provider.getStorageAt(contract.address, 5);

    // console.log(Boolean(locked));
    // console.log(await ethers.BigNumber.from(id));
    const hexGroup = await ethers.utils.hexValue(group);
    const flat = group.slice(64, 66);
    const denomination = group.slice(62, 64);
    const last = group.slice(58, 62);
    console.log(ethers.utils.hexValue(`0x${flat}`));
    console.log(ethers.BigNumber.from(`0x${flat}`));
    console.log(ethers.BigNumber.from(`0x${denomination}`));
    console.log(ethers.BigNumber.from(`0x${last}`));
    console.log(ethers.utils.hexStripZeros(group));
    console.log("flat: ", flat);
    console.log("denomination: ", denomination);
    console.log("last: ", last);
    console.log("group:", group);
    console.log("hexGroup:", hexGroup);
    // console.log(await ethers.utils.parseBytes32String(bytesArray0));
    // console.log(await ethers.utils.parseBytes32String(bytesArray1));
    // console.log(await ethers.utils.parseBytes32String(bytesArray2));

    // total size of a bytes32 thing is 66 which inclucdes 0x as a prefix
    // const valueNeeded = bytesArray2.slice(0, 34);

    // expect(await contract.locked()).to.equal(true);

    // await contract.unlock(valueNeeded);

    // expect(await contract.locked()).to.equal(false);

    // const NormalBuilding = await ethers.getContractFactory("NormalBuilding");
    // const normalBuilding = await NormalBuilding.connect(me).deploy(
    //   contract.address
    // );
    // await normalBuilding.deployed();
  });
});
