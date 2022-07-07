pragma solidity 0.5.17;

import "./BlockcodersHRC1155.sol";

contract GameItems is BlockcodersHRC1155 {
  uint256 public constant GOLD = 0;
  uint256 public constant SILVER = 1;
  uint256 public constant THORS_HAMMER = 2;
  uint256 public constant SWORD = 3;
  uint256 public constant SHIELD = 4;
  string private _uriPrefix;

  constructor() public BlockcodersHRC1155("GameItems", "GI", "https://gateway.pinata.cloud/ipfs/{id}.json") {
    _mint(msg.sender, GOLD, 10**18, "");
    _mint(msg.sender, SILVER, 10**27, "");
    _mint(msg.sender, THORS_HAMMER, 1, "");
    _mint(msg.sender, SWORD, 10**9, "");
    _mint(msg.sender, SHIELD, 10**9, "");
  }
}