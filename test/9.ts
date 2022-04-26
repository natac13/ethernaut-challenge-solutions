import { expect } from "chai";
import { ethers } from "hardhat";

describe("King", function () {
  it("Happy path", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("King");
    const contract = await Contract.deploy({
      value: ethers.utils.parseUnits("1", "gwei"),
    });
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level9Solution");
    const solution = await Solution.connect(me).deploy(contract.address);
    await solution.deployed();

    expect(await contract._king()).to.equal(owner.address);
    expect(await contract.owner()).to.equal(owner.address);
    expect(await contract.prize()).to.equal(
      ethers.utils.parseUnits("1", "gwei")
    );

    await me.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseUnits("2", "gwei"),
    });
    expect(await contract._king()).to.equal(me.address);
    expect(await contract.prize()).to.equal(
      ethers.utils.parseUnits("2", "gwei")
    );

    await other.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseUnits("3", "gwei"),
    });
    expect(await contract._king()).to.equal(other.address);
    expect(await contract.prize()).to.equal(
      ethers.utils.parseUnits("3", "gwei")
    );

    await solution.connect(me).takeControlForever({
      value: ethers.utils.parseUnits("3.1", "gwei"),
    });
    expect(await contract._king()).to.equal(solution.address);
    expect(await contract.prize()).to.equal(
      ethers.utils.parseUnits("3", "gwei")
    );

    await expect(
      other.sendTransaction({
        to: contract.address,
        value: ethers.utils.parseUnits("5", "gwei"),
      })
    ).to.be.revertedWith("I am the King!");

    expect(await contract._king()).to.equal(solution.address);
  });
});
