// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;


contract ModuleNamingSupportV1 {
    /// @notice The module name
    string public name;

    /// @notice Sets the name of a module
    /// @param _name The module name to set
    constructor(string memory _name) {
        name = _name;
    }
}
