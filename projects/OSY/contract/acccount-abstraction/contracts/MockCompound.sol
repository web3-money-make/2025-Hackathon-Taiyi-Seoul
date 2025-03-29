// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Compound's Comet Main Interface (without Ext)
 * @notice An efficient monolithic money market protocol
 * @author Compound
 */
contract CometMain {
    // 각 사용자의 공급량과 공급 시점을 저장하는 구조체
    struct UserInfo {
        uint256 balance;
        uint256 lastUpdateTime;
    }
    
    // 사용자별 정보를 저장하는 매핑
    mapping(address => UserInfo) public userInfo;
    
    // 이자율: 초당 10 wei
    uint256 constant INTEREST_RATE_PER_SECOND = 10000;

    function supply(address asset, uint amount) external {
        // 자산을 전송받음
        require(IERC20(asset).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // 현재 잔액에 이자를 더해서 업데이트
        updateBalance(msg.sender);
        
        // 새로운 공급량을 추가
        userInfo[msg.sender].balance += amount;
    }

    function withdraw(address asset, uint amount) external {
        // 현재 잔액에 이자를 더해서 업데이트
        updateBalance(msg.sender);
        
        // 출금 가능 여부 확인
        require(userInfo[msg.sender].balance >= amount, "Insufficient balance");
        
        // 잔액 차감
        userInfo[msg.sender].balance -= amount;
        
        // 자산 전송
        require(IERC20(asset).transfer(msg.sender, amount), "Transfer failed");
    }

    function updateBalance(address account) internal {
        UserInfo storage user = userInfo[account];
        if (user.lastUpdateTime > 0) {
            uint256 timeElapsed = block.timestamp - user.lastUpdateTime;
            user.balance += timeElapsed * INTEREST_RATE_PER_SECOND;
        }
        user.lastUpdateTime = block.timestamp;
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function balanceOf(address account) external view returns (uint256) {
        UserInfo memory user = userInfo[account];
        if (user.lastUpdateTime == 0) return 0;
        
        // 현재 시점까지의 이자를 계산하여 반환
        uint256 timeElapsed = block.timestamp - user.lastUpdateTime;
        return user.balance + (timeElapsed * INTEREST_RATE_PER_SECOND);
    }
}