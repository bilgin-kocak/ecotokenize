// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import { RoyaltyEngineV1 } from "@manifoldxyz/royalty-registry-solidity/contracts/RoyaltyEngineV1.sol";
import { RoyaltyRegistry } from "@manifoldxyz/royalty-registry-solidity/contracts/RoyaltyRegistry.sol";
import { IManifold } from "@manifoldxyz/royalty-registry-solidity/contracts/specs/IManifold.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract OurRoyaltyEngine is RoyaltyEngineV1 {
    constructor() RoyaltyEngineV1() {}
}
/**
    * @dev Registry to lookup royalty configurations
    */


contract OurRoyaltyRegistry is RoyaltyRegistry {
    constructor() RoyaltyRegistry() {}
}

/**
 * Base template for royalty
 */
contract Royalty is Ownable {
    mapping(uint256 => address payable[]) internal _receivers;
    mapping(uint256 => uint256[]) internal _bps;

    function setRoyalties(uint256 tokenId, address payable[] calldata receivers, uint256[] calldata bps) public {
        require(receivers.length == bps.length);
        _receivers[tokenId] = receivers;
        _bps[tokenId] = bps;
    }
}

/**
 * Implements Manifold interface
 */
contract Manifold is IManifold, Royalty, ERC165 {

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IManifold).interfaceId || super.supportsInterface(interfaceId);
    }

    function getRoyalties(uint256 tokenId) public override view returns (address payable[] memory, uint256[] memory) {
        return (_receivers[tokenId], _bps[tokenId]);
    }

}