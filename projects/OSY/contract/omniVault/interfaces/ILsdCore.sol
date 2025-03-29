// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILsdCore {
    event InterestApplied(uint256 totalSupply);
    function mint(address to, uint256 amount) external;
    function burn(uint256 amount) external;
    function applyInterest(uint256 totalSupply) external;
}
