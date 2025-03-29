// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { AbstractProxy } from './AbstractProxy.sol';
import { ProxyStorage } from './ProxyStorage.sol';

contract Proxy is AbstractProxy{

    event Upgraded(address indexed _implementation);
    event ChangedAdmin(address indexed _previousAdmin, address indexed _newAdmin);

    error InvalidImplementation(address _implementation);
    error InvalidAdmin(address admin);
    error NotAdmin(address sender);

    constructor() {
        ProxyStorage.load().admin = msg.sender;
    }

    modifier onlyAdmin() {
        address msgSender = msg.sender;

        if (msgSender != _admin()) {
            revert NotAdmin(msgSender);
        }
        
        _;
    }

    function upgradeAndCall(address _newImplementation, bytes calldata _data) onlyAdmin external payable returns (bool success) {
        success = _setImplementation(_newImplementation);

        if (_data.length > 0) {
            (success, ) = _newImplementation.delegatecall(_data);
            require(success, 'Proxy: UpgradeAndCall Fail');
        } else {
            require(msg.value == 0, 'Proxy: value must be 0');
        }
    }

    function setImplementation(address _newImplementation) onlyAdmin external virtual returns (bool) {
        return _setImplementation(_newImplementation);
    }

    function setAdmin(address _newAdmin) onlyAdmin external virtual returns (bool) {
        if (_newAdmin == address(0)) {
            revert InvalidAdmin(address(0));
        }

        emit ChangedAdmin(_admin(), _newAdmin);
        ProxyStorage.load().admin = _newAdmin;  
        return true;
    }

    function getImplementation() external view virtual returns (address) {
        return _implementation();
    }

    function getAdmin() external view virtual returns (address) {
        return _admin();
    }

    function _setImplementation(address _newImplementation) internal virtual returns (bool) {
        if (_newImplementation.code.length == 0) {
            revert InvalidImplementation(_newImplementation);
        }
        
        emit Upgraded(_newImplementation);
        ProxyStorage.load().implementation = _newImplementation;
        return true;
    }

    function _implementation() internal view override virtual returns (address) {
        return ProxyStorage.load().implementation;
    }

    function _admin() internal view virtual returns (address) {
        return ProxyStorage.load().admin;
    }

}