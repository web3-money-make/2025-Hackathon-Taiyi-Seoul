// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

abstract contract AbstractProxy {

    fallback() external payable {
        _fallback();
    }

    receive() external payable {}

    function _delegate(address _implementationAddr) internal virtual {
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), _implementationAddr, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function _fallback() internal virtual {
        _delegate(_implementation());
    }

    function _implementation() internal view virtual returns (address);

}