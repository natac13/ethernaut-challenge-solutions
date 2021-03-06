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

## Level 6 Delegation

This will help show the implications of using delegatecall

### Solution

When `delegatecall` is used, the callling contract's variables, ETH and context are used by the called contract instead of it's own state / context.

Therefore since there is a `delegatecall` in the target contract's `fallback` function we can encode the `pwd()` function call in the `data` which will then set the `owner` of `Delegation` to `msg.sender`. 

If `call` was used the `Delegate` contract's owner would be updated instead

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/6.ts --network rinkeby
```


## Level 7 Force

This is a completely empty contract that we need to somehow send ETH to. See level 1 for tips!

### Solution

A contract can only receive ETH with the `receive` or `fallback` function. UNLESS it is set as the miner rewars address or a `selfdestrut` address. These types of transfer are not stoppable by any contract. This was a EVM design choice.


Run and then submit the instance on the ethernaut website
```sh
hh run scripts/7.ts --network rinkeby
```


## Level 8 Vault

Trying to show that there is nothing that is really private in solidity. Private only refers to the scope which the function / variable can be used in. Private being just the given contract.

### Solution

Therefore we simply need to read the password which is stored at location `1` and unlock the contract.

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/8.ts --network rinkeby
```

## Level 9 King

A way to show that as a developer we need to be aware that the address which is on the receiving end of a 'transfer' can be a contract and therefore act differently than a simply wallet address

### Solution

Claim ownership of the contract using another smart contract which throws and error in it's receive function

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/9.ts --network rinkeby
```


### Take Away 

Always know that the receiving address can be a smart contract!
Usually better to transfer *after* setting state variables. (most of the time)


## Level 10 Reentrance

This is what happened to the now famous DAO exploit which then caused the Ethereum split.

Looking at the target contract's `withdraw` function, we can see that the `msg.sender`'s balance is only updated *after* the transfer. 

### Solution

Therefore we can use a smart contract that will call back into the target contract's `withdraw` function until the entire contract is empty.

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/9.ts --network rinkeby
```

[Solution Contract](https://rinkeby.etherscan.io/address/0xf676cb1a5276a82419feb9df16972492d11098a1)
![Image of internal transactions](/images/reentrance-attack-view.png)

### Take Away

Update state variables before any transfers. Or revert the ReentrancyGuard contract from Open Zeppelin / one like it to prevent the reentrance of a function until it has run to completion


## Level 11 Elevator

Need to reach to top floor;

## Solution

Looking at the way the `goTo` function in the `Elevator` contract is setup, we simply need to have a function names `isLastFloor` which will return `false` the first time then `true` the second


Run and then submit the instance on the ethernaut website
```sh
hh run scripts/11.ts --network rinkeby
```

[BadBuilding Contract](https://rinkeby.etherscan.io/address/0x1ea3fc975f4720e166c5504fe5ca6f3b945ad765#code)


## Level 12 Privacy

Another attempt at hiding a secret key in the contract to stress the point home that there is nothing secret on the blockchain. 

I have even shown in the testing and the run script how to read the other variables that are packed together.

uint8 / uint256 * 66

where 66 is the length of the padded hex value of those variables.

### Solution


Run and then submit the instance on the ethernaut website
```sh
hh run scripts/12.ts --network rinkeby
```

## Level 13 GatekeeperOne

Need to break throught 3 gates with different requiements.
1. same as Telephone challenge, need to use a smart contract so `tx.origin` != `msg.sender`
2. `gasleft()` to be moduloed by 8191. 
3. Various data requirements by comparing the `bytes8` data after different casting.

### Solution
1. Smart contract
2. brute force by using a for loop to find the right amount of gas to send. 
3. see comments in solution contract see how the `bytes8` data was figured out


[Solution contract](https://rinkeby.etherscan.io/address/0x45cfca3c118e9fc526d269f864b07ca53a79d732)

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/13.ts --network rinkeby
```


## Level 15 NaughtCoin

Goal is to lose all the coins long before the lock period is over

### Solution

As the NaughtCoin uses the ERC20 contract, we can approve another address to call `transferFrom` and move the tokens from our wallet.

I have made a contract to make the `transferFrom` call

[Solution Contract](https://rinkeby.etherscan.io/address/0x6e7f85bfb4fbbf4d50485fce91cfffb5cdfd521c)

Run and then submit the instance on the ethernaut website
```sh
hh run scripts/15.ts --network rinkeby
```