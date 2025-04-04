// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../interfaces/UserOperation.sol";

contract TestUtil {
    using UserOperationLib for UserOperation;

    function packUserOp(UserOperation calldata op) external pure returns (bytes memory){
        return op.pack();
    }

}
