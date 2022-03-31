// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockcodersHRC1155 is ERC1155PresetMinterPauser, Ownable {
  uint256 public constant GOLD = 0;
  uint256 public constant SILVER = 1;
  uint256 public constant THORS_HAMMER = 2;
  uint256 public constant SWORD = 3;
  uint256 public constant SHIELD = 4;
  string private _uriPrefix;

  constructor() ERC1155PresetMinterPauser("https://gateway.pinata.cloud/ipfs/{id}.json") {
    _mint(msg.sender, GOLD, 10**18, "");
    _mint(msg.sender, SILVER, 10**27, "");
    _mint(msg.sender, THORS_HAMMER, 1, "");
    _mint(msg.sender, SWORD, 10**9, "");
    _mint(msg.sender, SHIELD, 10**9, "");
    _uriPrefix = "https://gateway.pinata.cloud/ipfs/";
  }

  function tokenURIPrefix() public view virtual returns (string memory) {
    return _uriPrefix;
  }

  function contractURI() public view virtual returns (string memory) {
    return _uriPrefix;
  }
}
