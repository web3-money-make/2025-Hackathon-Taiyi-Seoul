// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

abstract contract Initializable {

    event Initialized();

    error AlreadyInitialized();

    bytes32 private constant SLOT_PROXY_INITIALIZABLE_STORAGE = keccak256(abi.encodePacked('smart.executor.slot.proxy.initializable.storage'));

    modifier initializable() {
        bytes32 slot = SLOT_PROXY_INITIALIZABLE_STORAGE;

        bool initialized;

        assembly {
            initialized := sload(slot)
        }

        if (initialized) {
            revert AlreadyInitialized();
        }

        assembly {
            sstore(slot, true)
        }

        emit Initialized();
        _;
    }

}