import { expect } from "chai";
import { ethers } from "hardhat";

describe("Reentrace", function () {
  it("Happy path", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("Reentrance");
    const contract = await Contract.deploy();
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level10Solution");
    const solution = await Solution.connect(me).deploy(contract.address);
    await solution.deployed();

    await contract
      .connect(other)
      .donate(other.address, { value: ethers.utils.parseEther("0.001") });

    expect(await ethers.provider.getBalance(contract.address)).to.equal(
      ethers.utils.parseEther("0.001")
    );

    await solution
      .connect(me)
      .attack({ value: ethers.utils.parseEther("0.1") });

    setTimeout(async () => {
      expect(await ethers.provider.getBalance(contract.address)).to.equal(
        ethers.utils.parseEther("0")
      );
      expect(await ethers.provider.getBalance(solution.address)).to.equal(
        ethers.utils.parseEther("0.0011")
      );

      await solution.connect(me).withdraw();

      expect(await ethers.provider.getBalance(solution.address)).to.equal(
        ethers.utils.parseEther("0")
      );
    }, 4000);
  });
});
