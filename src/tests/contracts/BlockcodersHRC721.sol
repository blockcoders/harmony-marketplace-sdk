// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract BlockcodersHRC721 is ERC721PresetMinterPauserAutoId {
  // Optional mapping for token URIs
  mapping(uint256 => string) private _tokenURIs;
  
  constructor() ERC721PresetMinterPauserAutoId("Blockcoders NFT", "Blockcoders", "https://gateway.pinata.cloud/ipfs/QmYDabPt2kJBKP1WZazoRd28xwWaCjThJyf2bStRTcoMvx") {
    for (uint i = 0; i < 100; i++) {
      _safeMint(_msgSender(), i);
    }
  }
  
  function setTokenURI(uint256 tokenId, string memory tokenURI) public {
    require(_msgSender() == ownerOf(tokenId), "only owner can set tokenURI");
    require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");

    _tokenURIs[tokenId] = tokenURI;
  }
}
