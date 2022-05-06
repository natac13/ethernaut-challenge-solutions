import { expect } from "chai";
import { ethers } from "hardhat";

describe("NaughtCoin", function () {
  it("Happy path", async function () {
    const [owner, me, other] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("NaughtCoin");
    const contract = await Contract.deploy(me.address);
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level15Solution");
    const solution = await Solution.connect(me).deploy(contract.address);
    await solution.deployed();

    expect(
      ethers.utils.formatEther(await contract.balanceOf(me.address))
    ).to.equal("1000000.0");

    await contract
      .connect(me)
      .approve(solution.address, ethers.utils.parseEther("1000000"));

    await solution.attack();
    // await contract
    //   .connect(other)
    //   .transferFrom(
    //     me.address,
    //     other.address,
    //     ethers.utils.parseEther("1000000")
    //   );

    expect(
      ethers.utils.formatEther(await contract.balanceOf(me.address))
    ).to.equal("0.0");
  });
});
