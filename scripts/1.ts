import { ethers } from "hardhat";
import { ETHERNAUT_ABI, ETHERNAUT_ADDRESS } from "./constants";

const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_password",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "passkey",
        type: "string",
      },
    ],
    name: "authenticate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xaa613b29",
  },
  {
    inputs: [],
    name: "getCleared",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x3c848d78",
  },
  {
    inputs: [],
    name: "info",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x370158ea",
  },
  {
    inputs: [],
    name: "info1",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0xd4c3cf44",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "param",
        type: "string",
      },
    ],
    name: "info2",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x2133b6a9",
  },
  {
    inputs: [],
    name: "info42",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0x2cbd79a5",
  },
  {
    inputs: [],
    name: "infoNum",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xc253aebe",
  },
  {
    inputs: [],
    name: "method7123949",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
    constant: true,
    signature: "0xf0bc7081",
  },
  {
    inputs: [],
    name: "password",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0x224b610b",
  },
  {
    inputs: [],
    name: "theMethodName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
    signature: "0xf157a1e3",
  },
];

const CONTRACT_ADDRESS = "0x427F81500245a7F70Df89b2e9ec30a1Af582B5B7";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ethernaut = await ethers.getContractAt(
    ETHERNAUT_ABI,
    ETHERNAUT_ADDRESS
  );
  const contract = await ethers.getContractAt(abi, CONTRACT_ADDRESS);

  await contract.deployed();

  const info = await contract.info();
  console.log(info);
  console.log(await contract.info1());
  console.log(await contract.info2("hello"));
  console.log(await contract.infoNum());
  console.log(await contract[`info${await contract.infoNum()}`]());
  console.log(await contract.theMethodName());
  console.log(await contract.method7123949());
  console.log(await contract.password());
  console.log(await contract.authenticate(await contract.password()));

  const tx = await ethernaut.submitLevelInstance(CONTRACT_ADDRESS);
  const rc = await tx.wait();
  console.log(rc);

  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
