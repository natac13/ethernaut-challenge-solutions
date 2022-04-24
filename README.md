# Ethernaut Challenges

## Setup

- Metamask
- Rineby Testnet
- Test Ether is needed and can be obtained at [this facuet](https://faucets.chain.link/rinkeby)

## Level 0 Hello Ethernaut

A contract's ABI exposes all of the public methods. Looking at the contract's ABI will give insight into what functions on the contract can be called.

### Lvl 0 - Solution

Launch the instance from the ethernaut website and copy and paste the new contract's address in the `CONTRACT_ADDRESS` variable

Generate a new instance on the ethernaut website

The level is to introduce you to interacting with a contract while viewing the contract's ABI.
I have created a solution which shows the methods which are called in order to yield the solution to complete the level.

Run
```sh
hh run scripts/0.ts --network rinkeby
# OR;
npx hardhat run scripts/0.ts --network rinkeby
```

Refresh the ethernaut page and you are done! 🎉

### Take Away

A contract's ABI gives insight into what public function can be called on a contract.


## Level 1 Fallback

[A contract's `receive()` function](https://docs.soliditylang.org/en/v0.8.13/contracts.html#receive-ether-function)

Need to claim ownership of the Fallback contract.
This can be done with interacting with the contract directly OR;
By creating a separate contract which will handle the taking ownership and withdrawaling the funds.

### Lvl 1 - Solution

First we need to contribute to the Fallback contract some amount less than 0.001 ether. As this is a requirement of the `receive()` function. Then we need to send some amount of ether to the Fallback function which will set the `msg.sender` to the new owner of the Fallback contract. At which point we can withdraw the funds and run! 🏃

Run

```sh
hh run scripts/1.ts --network rinkeby
```

### Take Away

A contract can receive ether with a special function `receive`.

> If no such function exists, but a payable fallback function exists, the fallback function will be called on a plain Ether transfer. If neither a receive Ether nor a payable fallback function is present, the contract cannot receive Ether through regular transactions and throws an exception.

> Contracts that receive Ether directly (without a function call, i.e. using send or transfer) but do not define a receive Ether function or a payable fallback function throw an exception, sending back the Ether (this was different before Solidity v0.4.0). So if you want your contract to receive Ether, you have to implement a receive Ether function (using payable fallback functions for receiving Ether is not recommended, since it would not fail on interface confusions).

> A contract without a receive Ether function can receive Ether as a recipient of a coinbase transaction (aka miner block reward) or as a destination of a selfdestruct.

A contract cannot react to such Ether transfers and thus also cannot reject them. This is a design choice of the EVM and Solidity cannot work around it.

It also means that address(this).balance can be higher than the sum of some manual accounting implemented in a contract (i.e. having a counter updated in the receive Ether function).