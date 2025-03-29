// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

library ProxyStorage {

    bytes32 private constant SLOT_PROXY_STORAGE = keccak256(abi.encodePacked('smart.executor.slot.proxy.storage'));

    struct Data {
        address admin;
        address implementation;
    }

    function load() internal pure returns (Data storage data) {
        bytes32 slot = SLOT_PROXY_STORAGE;

        assembly {
            data.slot := slot
        }
    }

}