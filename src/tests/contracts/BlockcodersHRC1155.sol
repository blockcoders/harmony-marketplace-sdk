pragma solidity 0.5.17;

import "./ERC1155.sol";
import "./ERC1155Metadata.sol";
import "./ERC1155MintBurn.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract BlockcodersHRC1155 is ERC1155, ERC1155MintBurn, ERC1155Metadata, MinterRole {
    string private _name;
    string private _symbol;

    constructor(
        string memory name,
        string memory symbol,
        string memory uri
    ) public ERC1155() {
        _name = name;
        _symbol = symbol;
        _setBaseMetadataURI(uri);
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

    function mint(
        address _to,
        uint256 _id,
        uint256 _quantity,
        bytes memory _data
    ) public onlyMinter {
        _mint(_to, _id, _quantity, _data);
    }
}
