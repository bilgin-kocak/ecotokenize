// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import {ModuleManager} from "../ModuleManager.sol";

contract Zorb is ERC721Holder, ERC1155Holder {
    ModuleManager internal ZMM;

    constructor(address _ZMM) {
        ZMM = ModuleManager(_ZMM);
    }

    /// ------------ Module Approvals ------------

    function setApprovalForModule(address _module, bool _approved) public {
        ZMM.setApprovalForModule(_module, _approved);
    }

    function setBatchApprovalForModules(address[] memory _modules, bool _approved) public {
        ZMM.setBatchApprovalForModules(_modules, _approved);
    }

    /// ------------ ETH Receivable ------------

    event Received(address sender, uint256 amount, uint256 balance);

    receive() external payable {
        emit Received(msg.sender, msg.value, address(this).balance);
    }
}
