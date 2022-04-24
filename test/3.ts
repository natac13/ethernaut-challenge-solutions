import { expect } from "chai";
import { ethers } from "hardhat";
import { CoinFlip, Level3Solution } from "../typechain";

describe("CoinFlip", function () {
  it("work", async function () {
    const [owner, me] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("CoinFlip");
    const contract = (await Contract.deploy()) as CoinFlip;
    await contract.deployed();

    const Solution = await ethers.getContractFactory("Level3Solution");
    const solution = (await Solution.connect(me).deploy(
      contract.address
    )) as Level3Solution;
    await solution.deployed();

    expect(await contract.consecutiveWins()).to.equal(0);

    for (let run = 0; run < 10; run += 1) {
      await solution.connect(me).calculateGuessAndWin();
      expect(await contract.consecutiveWins()).to.equal(run + 1);
    }

    expect(await contract.consecutiveWins()).to.equal(10);
  });
});
