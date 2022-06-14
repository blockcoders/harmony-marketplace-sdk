// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract BridgedHRC20Token is ERC20PresetMinterPauser {
    address public ethTokenAddr;
    uint8 private _decimals;

    constructor(
        address _ethTokenAddr,
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20PresetMinterPauser(name, symbol) {
        ethTokenAddr = _ethTokenAddr;
        _decimals = decimals_;
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    function addMinter(address miner) public virtual {
        _setupRole(MINTER_ROLE, miner);
    }
}