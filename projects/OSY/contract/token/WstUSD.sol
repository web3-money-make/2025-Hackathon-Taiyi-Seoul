// SPDX-FileCopyrightText: 2021 Lido <info@lido.fi>

// SPDX-License-Identifier: GPL-3.0

/* See contracts/COMPILERS.md */
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./StUSD.sol";

/**
 * @title StUSD token wrapper with static balances.
 * @dev It's an ERC20 token that represents the account's share of the total
 * supply of stUSD tokens. WstUSD token's balance only changes on transfers,
 * unlike StUSD that is also changed when oracles report staking rewards and
 * penalties. It's a "power user" token for DeFi protocols which don't
 * support rebasable tokens.
 *
 * The contract is also a trustless wrapper that accepts stUSD tokens and mints
 * wstUSD in return. Then the user unwraps, the contract burns user's wstUSD
 * and sends user locked stUSD in return.
 *
 * The contract provides the staking shortcut: user can send USD with regular
 * transfer and get wstUSD in return. The contract will send USD to Lido submit
 * method, staking it and wrapping the received stUSD.
 *
 */
contract WstUSD is ERC20Permit {
    StUSD public stUSD;
    using SafeERC20 for StUSD;

    /**
     * @param _stUSD address of the StUSD token to wrap
     */
    constructor(StUSD _stUSD)
    ERC20Permit("Wrapped liquid staked USD")
    ERC20("Wrapped liquid staked USD", "wstUSD")
    {
        stUSD = _stUSD;
    }

    /**
     * @notice Exchanges stUSD to wstUSD
     * @param _stUSDAmount amount of stUSD to wrap in exchange for wstUSD
     * @dev Requirements:
     *  - `_stUSDAmount` must be non-zero
     *  - msg.sender must approve at least `_stUSDAmount` stUSD to this
     *    contract.
     *  - msg.sender must have at least `_stUSDAmount` of stUSD.
     * User should first approve _stUSDAmount to the WstUSD contract
     * @return Amount of wstUSD user receives after wrap
     */
    function wrap(uint256 _stUSDAmount) external returns (uint256) {
        require(_stUSDAmount > 0, "wstUSD: can't wrap zero stUSD");
        uint256 wstUSDAmount = stUSD.getSharesByPooledUSD(_stUSDAmount);
        _mint(msg.sender, wstUSDAmount);
        stUSD.safeTransferFrom(msg.sender, address(this), _stUSDAmount);
        return wstUSDAmount;
    }

    /**
     * @notice Exchanges wstUSD to stUSD
     * @param _wstUSDAmount amount of wstUSD to uwrap in exchange for stUSD
     * @dev Requirements:
     *  - `_wstUSDAmount` must be non-zero
     *  - msg.sender must have at least `_wstUSDAmount` wstUSD.
     * @return Amount of stUSD user receives after unwrap
     */
    function unwrap(uint256 _wstUSDAmount) external returns (uint256) {
        require(_wstUSDAmount > 0, "wstUSD: zero amount unwrap not allowed");
        uint256 stUSDAmount = stUSD.getPooledUSDByShares(_wstUSDAmount);
        _burn(msg.sender, _wstUSDAmount);
        stUSD.safeTransfer(msg.sender, stUSDAmount);
        return stUSDAmount;
    }

    /**
     * @notice Get amount of wstUSD for a given amount of stUSD
     * @param _stUSDAmount amount of stUSD
     * @return Amount of wstUSD for a given stUSD amount
     */
    function getWstUSDByStUSD(uint256 _stUSDAmount) external view returns (uint256) {
        return stUSD.getSharesByPooledUSD(_stUSDAmount);
    }

    /**
     * @notice Get amount of stUSD for a given amount of wstUSD
     * @param _wstUSDAmount amount of wstUSD
     * @return Amount of stUSD for a given wstUSD amount
     */
    function getStUSDByWstUSD(uint256 _wstUSDAmount) external view returns (uint256) {
        return stUSD.getPooledUSDByShares(_wstUSDAmount);
    }

    /**
     * @notice Get amount of stUSD for a one wstUSD
     * @return Amount of stUSD for 1 wstUSD
     */
    function stUSDPerToken() external view returns (uint256) {
        return stUSD.getPooledUSDByShares(1 ether);
    }

    /**
     * @notice Get amount of wstUSD for a one stUSD
     * @return Amount of wstUSD for a 1 stUSD
     */
    function tokensPerStUSD() external view returns (uint256) {
        return stUSD.getSharesByPooledUSD(1 ether);
    }
}