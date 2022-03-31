// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract BlockcodersHRC721 is ERC721PresetMinterPauserAutoId {
  constructor() ERC721PresetMinterPauserAutoId("Blockcoders NFT", "Blockcoders", "https://gateway.pinata.cloud/ipfs/QmYDabPt2kJBKP1WZazoRd28xwWaCjThJyf2bStRTcoMvx") {
    for (uint i = 0; i < 10; i++) {
      _safeMint(msg.sender, i);
    }
  }
}
