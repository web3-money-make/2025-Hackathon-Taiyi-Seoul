// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./OmniVaultHashkeyProtocols.sol";

contract OmniVaultHashkey is OmniVaultHashkeyProtocols {

    event Log(bool success, bytes data);
    event TotalSupplyUpdated(uint32 chainId, uint256 totalSupply, uint256 reqId);
    event CrosschainDeposit(Path[] paths);
    event CrosschainWithdraw(Path[] paths);

    function setOsyUSD(address _osyUSDC) external onlyOwner {
        _setOSYUSDC(_osyUSDC);
    }

    function setLsdCore(address _lsdCore) external onlyOwner {
        _setLsdCore(_lsdCore);
    }

    function setProtocol(ProtocolType _protocolType, address _protocol) external onlyOwner {
        _setProtocol(_protocolType, _protocol);
    }

    function setUSDC(address _USDC) external onlyOwner {
        _setUSDC(_USDC);
    }

    // manager (owner)
    function withdrawAndBridgeAndDeposit(Path[] memory actions) external onlyOwner {
        require(actions.length == 2, "Invalid action length");
        require(actions[0].actionChainId == block.chainid, "Invalid action chainId");

        _withdraw(actions[0].protocolId, actions[0].amount);

        Path[] memory path = new Path[](1);
        path[0] = actions[1];
        _bridge(actions[1].amount, path);
        emit CrosschainDeposit(path);
    }

    // user
    function deposit(Path[] memory actions) external {
        require(actions.length == 1, "Invalid action length");
        require(actions[0].actionChainId == 11155111 || actions[0].actionChainId == 133, "Invalid action chainId");

        IERC20(_getProtocolStorage().USDC).transferFrom(msg.sender, address(this), actions[0].amount);

        if (block.chainid == 133 && actions[0].recipient != address(0)) {
            _getProtocolStorage().lsdCore.mint(actions[0].recipient, actions[0].amount);
        }

        if (actions[0].actionChainId == block.chainid) {
            _deposit(actions[0].protocolId, actions[0].amount);
        } else {
            _bridge(actions[0].amount, actions);
            emit CrosschainDeposit(actions);
        }
    }

    // user
    function withdraw(Path[] memory actions) external {
        require(actions.length == 1, "Invalid action length");
        require(block.chainid == 133, "Invalid action chainId");
        require(actions[0].actionChainId == 11155111 || actions[0].actionChainId == 133, "Invalid action chainId");

        IERC20(_getProtocolStorage().osyUSDC).transferFrom(msg.sender, address(this), actions[0].amount);
        _getProtocolStorage().lsdCore.burn(actions[0].amount);

        if (actions[0].actionChainId == block.chainid) {
            _withdraw(actions[0].protocolId, actions[0].amount);
            IERC20(_getProtocolStorage().USDC).transfer(actions[0].recipient, actions[0].amount);
        } else {
            _bridge(actions[0].amount, actions);
            emit CrosschainWithdraw(actions);
        }
    }

    // bridge call
    function crossChainDeposit(Path[] memory actions) external onlyOwner{
        require(actions.length == 1, "Invalid action length");
        require(actions[0].actionChainId == block.chainid, "Invalid action chainId");

        ILock(_getProtocolStorage().protocols[ProtocolType.BRIDGES]).withdraw(actions[0].amount);
        _deposit(actions[0].protocolId, actions[0].amount);

        if (block.chainid == 133 && actions[0].recipient != address(0)) {
            _getProtocolStorage().lsdCore.mint(actions[0].recipient, actions[0].amount);
        }
    }

    // bridge call
    function crossChainWithdraw(Path[] memory actions) external onlyOwner{
        require(actions.length == 1, "Invalid action length");
        require(actions[0].actionChainId == block.chainid, "Invalid action chainId");

        ILock(_getProtocolStorage().protocols[ProtocolType.BRIDGES]).withdraw(actions[0].amount);
        IERC20(_getProtocolStorage().USDC).transfer(actions[0].recipient, actions[0].amount);
    }

    function updateTotalSupply(uint32 _chainId, uint256 _newTotalSupply, uint256 _reqId) external {
        require(msg.sender == address(this) || msg.sender == owner(), "Only Vault can call this function or owner");
        require(block.chainid == 133, "Invalid action chainId");
        _updateTotalSupply(_chainId, _newTotalSupply);
        emit TotalSupplyUpdated(_chainId, _newTotalSupply, _reqId);
    }

    function applyInterest() external {
        require(block.chainid == 133, "Invalid action chainId");
        _updateTotalSupply(133, _totalSupply());
        uint256 totalAmount = _protocolTotalSupply();
        _getProtocolStorage().lsdCore.applyInterest(totalAmount);
    }

    function totalSupply(uint32 _chainId) external view returns (uint256) {
        return _getProtocolStorage().totalSupplyOfVaults[_chainId];
    }

    function currentChainSupply() external view returns (uint256) {
        return _totalSupply();
    }

    function protocolTotalSupply() external view returns (uint256) {
        return _protocolTotalSupply();
    }
}
