// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;


interface IModuleManager {
     function registerModule(address _module) external;
     function setRegistrar(address _registrar) external;
}


contract TestRegistrar {
    IModuleManager internal ZMM;

    function init(address ZMMAddress) public {
        ZMM = IModuleManager(ZMMAddress);
    }

    function registerModule(address _module) public {
        ZMM.registerModule(_module);
    }

    function setRegistrar(address _registrar) public {
        ZMM.setRegistrar(_registrar);
    }
}
