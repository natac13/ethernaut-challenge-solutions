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

#### Contract Solution

I created a contract that would complete the task, however does not pass ethernaut verification as the final owner address in then the Solution contract and not the address which lanuched the instance.

https://rinkeby.etherscan.io/address/0xcfbfdf7e2b9fec2ef263eefc257b49abfe7b4949#code

Run

```sh
hh run scripts/1.ts --network rinkeby
```

### Take Away

A contract can receive ether with a special function `receive`.

> If no such function exists, but a payable fallback function exists, the fallback function will be called on a plain Ether transfer. If neither a receive Ether nor a payable fallback function is present, the contract cannot receive Ether through regular transactions and throws an exception.

> Contracts that receive Ether directly (without a function call, i.e. using send or transfer) but do not define a receive Ether function or a payable fallback function throw an exception, sending back the Ether (this was different before Solidity v0.4.0). So if you want your contract to receive Ether, you have to implement a receive Ether function (using payable fallback functions for receiving Ether is not recommended, since it would not fail on interface confusions).

> A contract without a receive Ether function can receive Ether as a recipient of a coinbase transaction (aka miner block reward) or as a destination of a selfdestruct.

> A contract cannot react to such Ether transfers and thus also cannot reject them. This is a design choice of the EVM and Solidity cannot work around it.

> It also means that address(this).balance can be higher than the sum of some manual accounting implemented in a contract (i.e. having a counter updated in the receive Ether function).


## Level 2 Fallout / Fal1out

This is a little tricky to see. However the constructor is not named the same as the contract and is therefore not actually a constuctor which is called upon creation, but a normal public function which can be called by anyone


### Solution

No contract needed for this solution. 
There is a test which will run the actions required to take control of the contract. As well as a script to do so against the instance you create.

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/2.ts --network rinkeby
```


### Take Away

Seems like such a silly mistake but one that can have huge consequences! That is why a constructor function is now named with the keyword `constructor`


## Level 3 Coin Flip

We will need a smart contract of our own to first. This will have to have a function which mirrors the coin flip calculation and when a desired results shows up, call the coin flip contract's actual funtion.

Each flip must be done in a different blockhash as per the `if` check. Therefore, I do not think this can be done is one transaction

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/3.ts --network rinkeby
```

[My Solution](https://rinkeby.etherscan.io/address/0x7a76fd12dc7d6fb5880fecbcfe37020ab0b86414#code)


### Take Away 

Generating random numbers in solidity is not really possible, unless you use an oracle like [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number)

## Level 4 Telephone

This level will require the use of a smart contract once again. This time the `msg.sender` needs to be different than the `tx.origin` for the `changeOwner` function to complete the transfer

### Solution 

We need to create a contract which will call the `changeOwner` function and pass in the `msg.sender` as this will me / your address and the `tx.origin` will be equal to the solution contract's address.


Run and then submit the instance on the ethernaut website
```sh
hh run scripts/4.ts --network rinkeby
```

[My Solution](https://rinkeby.etherscan.io/address/0x039d348543f5b839b5d020adbfd6f06a47cf24c2#code)


### Take Away

`msg.sender` and `tx.origin` can be different when the caller is a smart contract.

> While this example may be simple, confusing tx.origin with msg.sender can lead to phishing-style attacks, such as [this](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/)

This technique was used to mint more than the expected number of Adidas NFTs when it launched.
A smart contract was created which made child smart contract which minted the max and transfer to the parent before self destructing.

## Level 5 Token

Prior to version 0.8.0 of solidity you would have to use SafeMath.sol from Open Zeppelin to guard against overflow and underflow.

### Solution

Because this contract is compiled with 0.6.0 and does not use SafeMath.sol we can simply request to transfer more than our actual amount of tokens, pass the `require` check and be left with a wack ton of tokens!! 💰

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/5.ts --network rinkeby
```