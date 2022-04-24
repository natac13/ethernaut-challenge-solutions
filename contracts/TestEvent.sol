// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract TestEvent {
    event TokensMinted(uint256 amount);

    function mint(uint256 amount) public {
        emit TokensMinted(amount);
    }
}
