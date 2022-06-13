// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract BridgedHRC20Token is ERC20PresetMinterPauser {
    address public ethTokenAddr;

    constructor(
        address _ethTokenAddr,
        string memory name,
        string memory symbol
    ) ERC20PresetMinterPauser(name, symbol) {
        ethTokenAddr = _ethTokenAddr;
    }
}