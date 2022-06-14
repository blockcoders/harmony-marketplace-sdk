// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgedHRC1155Token is ERC1155PresetMinterPauser, Ownable {
    address public srcTokenAddr;
    uint256 public counter;
    // Contract name
    string private _name;
    // Contract symbol
    string private _symbol;

    mapping(uint256 => uint256) public tokenSupply;

    constructor(
        address _srcTokenAddr,
        string memory name_,
        string memory symbol_,
        string memory baseMetadataURI
    ) ERC1155PresetMinterPauser(baseMetadataURI) {
        srcTokenAddr = _srcTokenAddr;
        _name = name_;
        _symbol = symbol_;
    }
    
    modifier onlyMinter () {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have minter role to mint");
        _;
    }
    
    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function increment(uint256 amount) public onlyMinter {
        counter += amount;
    }

    function batchIncrement(uint256[] memory amounts) public onlyMinter {
        for (uint256 index = 0; index < amounts.length; index++) {
            counter += amounts[index];
        }
    }

    function decrement(uint256 amount) public onlyMinter {
        counter -= amount;
    }

    function batchDecrement(uint256[] memory amounts) public onlyMinter {
        for (uint256 index = 0; index < amounts.length; index++) {
            counter -= amounts[index];
        }
    }

    function checkSupply(uint256 value) public view returns (bool) {
        return counter == value;
    }
    
    function addMinter(address miner) public virtual {
        _setupRole(MINTER_ROLE, miner);
    }
}
