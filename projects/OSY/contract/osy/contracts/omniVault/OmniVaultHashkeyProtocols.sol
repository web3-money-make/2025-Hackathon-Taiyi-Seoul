// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IERC20.sol";
import "../interfaces/IPool.sol";
import "../interfaces/CometMainInterface.sol";
import "../interfaces/ILsdCore.sol";
import "../interfaces/ILock.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract OmniVaultHashkeyProtocols is Initializable, Ownable {

    // storage slot
    bytes32 private constant PROTOCOL_STORAGE_SLOT = keccak256(abi.encodePacked("PROTOCOLS.STORAGE"));

    // protocol type (확장가능)
    enum ProtocolType {
        AAVE,
        COMPOUND,
        BRIDGES
    }

    struct ProtocolStorage {
        IERC20 osyUSDC;
        IERC20 USDC;
        ILsdCore lsdCore;
        mapping(ProtocolType protocolType => address protocolAddr) protocols;
        mapping(address protocolAddr => address tokenAddr) bearingTokens;
        mapping(uint32 chainId => uint256 totalSupply) totalSupplyOfVaults;
    }

    struct Path {
        uint32 actionChainId;
        ProtocolType protocolId;
        uint256 amount;
        address recipient;
    }

    event Bridge(uint256 amount, Path[] path);

    modifier onlyProtocol(ProtocolType _protocolType) {
        if (_getProtocolStorage().protocols[_protocolType] == address(0)) {
            revert("Protocol not set");
        }
        _;
    }

    receive() external payable {}

    constructor() Ownable(msg.sender) {
        initialize();
    }

    function initialize() public initializer {
        _transferOwnership(msg.sender);

        if (block.chainid == 11155111) {

            _setUSDC(address(0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8));
            _setProtocol(ProtocolType.AAVE, address(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951));
            _setProtocol(ProtocolType.BRIDGES, address(0x9F3f548B4d6a257f23E370B1a97b9BBec283738D));

            _setBearingToken(ProtocolType.AAVE, address(0x16dA4541aD1807f4443d92D26044C1147406EB80));

        } else if (block.chainid == 133) {

            _setUSDC(address(0x1d5C9205B5019c877540e615243CF1E8BA43eeeD));
            _setProtocol(ProtocolType.COMPOUND, address(0x993215339F0cc3f76e196502dfd4E81b141F9390));
            _setProtocol(ProtocolType.BRIDGES, address(0x9F3f548B4d6a257f23E370B1a97b9BBec283738D));

        } else {
            revert("Unsupported chain");
        }
    }

    function _deposit(ProtocolType _protocolType, uint256 _amount) internal onlyProtocol(_protocolType) {
        if (_protocolType == ProtocolType.AAVE) {
            _depositToAave(_amount);
        } else if (_protocolType == ProtocolType.COMPOUND) {
            _depositToCompound(_amount);
        }
    }

    function _depositToAave(uint256 _amount) internal {
        IPool(_getProtocolStorage().protocols[ProtocolType.AAVE]).supply(address(_getProtocolStorage().USDC), _amount, address(this), 0);
    }

    function _depositToCompound(uint256 _amount) internal {
        CometMainInterface(_getProtocolStorage().protocols[ProtocolType.COMPOUND]).supply(address(_getProtocolStorage().USDC), _amount);
    }

    function _withdraw(ProtocolType _protocolType, uint256 _amount) internal onlyProtocol(_protocolType) {
        if (_protocolType == ProtocolType.AAVE) {
            _withdrawFromAave(_amount);
        } else if (_protocolType == ProtocolType.COMPOUND) {
            _withdrawFromCompound(_amount);
        }
    }

    function _withdrawFromAave(uint256 _amount) internal {
        IPool(_getProtocolStorage().protocols[ProtocolType.AAVE]).withdraw(address(_getProtocolStorage().USDC), _amount, address(this));
    }

    function _withdrawFromCompound(uint256 _amount) internal {
        CometMainInterface(_getProtocolStorage().protocols[ProtocolType.COMPOUND]).withdraw(address(_getProtocolStorage().USDC), _amount);
    }

    function _bridge(uint256 _amount, Path[] memory _path) internal {
        ILock(_getProtocolStorage().protocols[ProtocolType.BRIDGES]).deposit(_amount);
        emit Bridge(_amount, _path);
    }

    function _setUSDC(address _USDC) internal {
        _getProtocolStorage().USDC = IERC20(_USDC);
    }

    function _setLsdCore(address _lsdCore) internal {
        _getProtocolStorage().lsdCore = ILsdCore(_lsdCore);
    }

    function _setOSYUSDC(address _OSYUSDC) internal {
        _getProtocolStorage().osyUSDC = IERC20(_OSYUSDC);
    }

    function _setProtocol(ProtocolType protocolType, address protocolAddr) internal {
        _getProtocolStorage().protocols[protocolType] = protocolAddr;
        _getProtocolStorage().USDC.approve(protocolAddr, type(uint256).max);
    }

    function _setBearingToken(ProtocolType protocolType, address tokenAddr) internal {
        _getProtocolStorage().bearingTokens[_getProtocolStorage().protocols[protocolType]] = tokenAddr;
    }

    function _updateTotalSupply(uint32 _chainId, uint256 _newTotalSupply) internal {
        if (_chainId == 11155111) {
            _getProtocolStorage().totalSupplyOfVaults[_chainId] = _newTotalSupply;
        } else if (_chainId == 133) {
            _getProtocolStorage().totalSupplyOfVaults[_chainId] = _totalSupply();
        } else {
            revert("Unsupported chain");
        }
    }

    function _totalSupply() internal view returns (uint256) {
        if (block.chainid == 11155111) {
            return IERC20(_getProtocolStorage().bearingTokens[_getProtocolStorage().protocols[ProtocolType.AAVE]]).balanceOf(address(this));
        } else if (block.chainid == 133) {
            return IERC20(_getProtocolStorage().protocols[ProtocolType.COMPOUND]).balanceOf(address(this));
        } else {
            revert("Unsupported chain");
        }
    }

    function _protocolTotalSupply() internal view returns (uint256 totalSupply) {
         totalSupply = _getProtocolStorage().totalSupplyOfVaults[11155111];
         totalSupply += _getProtocolStorage().totalSupplyOfVaults[133];
    }

    function _getProtocolStorage() internal pure returns (ProtocolStorage storage ps) {
        bytes32 slot = PROTOCOL_STORAGE_SLOT;
        assembly {
            ps.slot := slot
        }
    }

}
