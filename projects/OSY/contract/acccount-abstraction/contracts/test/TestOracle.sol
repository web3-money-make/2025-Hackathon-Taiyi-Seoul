// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "../samples/IOracle.sol";

contract TestOracle is IOracle {
    function getTokenValueOfEth(uint256 ethOutput) external pure override returns (uint256 tokenInput) {
        return ethOutput * 2;
    }
}
