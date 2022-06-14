// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract BridgedHRC721Token is ERC721PresetMinterPauserAutoId {
    address public ethTokenAddr;
    uint256 public counter;
    
    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    
    constructor(
        address _ethTokenAddr,
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721PresetMinterPauserAutoId(name, symbol, baseURI) {}

    modifier onlyMinter () {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");
        _;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public {
        require(_msgSender() == ownerOf(tokenId), "only owner can set tokenURI");
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = tokenURI;
    }

    function increment() public onlyMinter {
        counter += 1;
    }

    function decrement() public onlyMinter {
        counter -= 1;
    }

    function checkSupply(uint256 value) public view returns (bool) {
        return counter == value;
    }

    function addMinter(address miner) public virtual {
        _setupRole(MINTER_ROLE, miner);
    }
}