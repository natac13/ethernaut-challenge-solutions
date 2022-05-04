// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
Learning about arrays and how to remove an item from an array.

With Solidity deleting an item from an array leaves a gap

We can fill the gap in 2 way: remove item and to shift to the left the items after the gap, or move last to gap and pop off the last item


The move last to gap and pop is considerably less gas cost!
 */

contract Arrays {
    uint256[] public stored = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
    ];

    function removeShift(uint256 _index) public {
        require(_index < stored.length, "index out of bound");

        for (uint256 i = _index; i < stored.length - 1; i++) {
            stored[i] = stored[i + 1];
        }
        stored.pop();
    }

    function removeLastFill(uint256 _index) public {
        // Move the last element into the place to delete
        stored[_index] = stored[stored.length - 1];
        // Remove the last element
        stored.pop();
    }
}
