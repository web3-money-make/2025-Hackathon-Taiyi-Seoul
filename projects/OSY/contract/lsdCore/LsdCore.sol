// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import {StUSD} from "../token/StUSD.sol";
import {WstUSD} from "../token/WstUSD.sol";

contract LsdCore is Initializable, Ownable {
    address public stUSD;
    address public wstUSD;
    address public OmniVault;

    event StUSDChanged(address indexed from, address indexed to);
    event WstUSDChanged(address indexed from, address indexed to);
    event OmniVaultChanged(address indexed from, address indexed to);
    event InterestApplied(uint256 totalSupply);

    modifier onlyOmniVault() {
        require(msg.sender == OmniVault, "only OmniVault contract");
        _;
    }

    // 체인 아이디에 따라 testnet 주소로 설정 (추후 확장가능하게 변경, 현재는 constant 사용))
    constructor() Ownable(msg.sender) {
        initialize();
    }

    function initialize() public initializer {
        _transferOwnership(msg.sender);
    }
    function mint(address to, uint256 amount) external onlyOmniVault {
        StUSD(stUSD).mint(to, amount);
    }
    function burn(uint256 amount) external {
        StUSD(stUSD).burnFrom(msg.sender, amount);
    }

    function applyInterest(uint256 totalSupply) external {
        uint256 totalStUSD = StUSD(stUSD).totalSupply();
        require(
            totalSupply > totalStUSD,
            "LsdCore: no interest to distribute"
        );
        StUSD(stUSD).applyInterest(totalSupply - totalStUSD);
        emit InterestApplied(totalSupply);
    }


    function setStUSD(address _stUSD) external onlyOwner {
        emit StUSDChanged(stUSD, _stUSD);
        stUSD = _stUSD;
    }

    function setWstUSD(address _wstUSD) external onlyOwner {
        emit WstUSDChanged(wstUSD, _wstUSD);
        wstUSD = _wstUSD;
    }

    function setOmniVault(address _OmniVault) external onlyOwner {
        emit OmniVaultChanged(OmniVault, _OmniVault);
        OmniVault = _OmniVault;
    }
}
