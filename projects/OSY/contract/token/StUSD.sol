// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StERC20Upgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

contract StUSD is StERC20Upgradeable, Ownable2StepUpgradeable {

    address public lsdCore;

    modifier onlyLsdCore() {
        require(msg.sender == lsdCore, "only LSD-core contract");
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);
    }

    function initialize() external initializer {
        _transferOwnership(msg.sender);
        __ERC20_init("Optimized Yield USD", "osyUSD");
    }

    function setLsdCore(address _lsdCore) external onlyOwner {
        lsdCore = _lsdCore;
    }
    /**
        * @dev Mint new stUSD tokens. Increases share amount of user, totalShares and totalPooledUSD
        * @param account The account to mint tokens to
        * @param amount The amount of tokens to mint
        *
        * Requirements:
        * - onlyLsdCore
        *
    */
    function mint(address account, uint256 amount) external onlyLsdCore {
        _mint(account, amount);
    }

    /**
        * @dev Increase totalPooledUSD. Used to apply interest to totalPooledUSD
        * @param amount The amount of USD to increase totalPooledUSD by
        *
        * Requirements:
        * - onlyLsdCore
        *
    */
    function applyInterest(uint256 amount) external onlyLsdCore {
        _increaseTotalPooledUSD(amount);
    }

    /**
 * @dev See {IERC20-burn}.
     */
    function burnFrom(address account, uint256 amount) external onlyLsdCore {
        _burn(account, amount);
    }

}
