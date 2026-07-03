// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @title TokenLedger
 * @dev A simple token ledger contract for minting, transferring, and balance tracking
 * This is a simulated contract designed for testing and integration without high gas costs
 */
contract TokenLedger {
    string public name = "LedgerToken";
    string public symbol = "LDG";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    // Balance mapping
    mapping(address => uint256) public balanceOf;
    
    // Allowance mapping for approvals
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Transaction history
    mapping(address => uint256) public transactionCount;
    
    // Owner of the contract
    address public owner;

    // Events for tracking transactions
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);

    constructor() {
        owner = msg.sender;
        totalSupply = 0;
    }

    /**
     * @dev Mint new tokens - only owner can call
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public returns (bool success) {
        require(msg.sender == owner, "Only owner can mint tokens");
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Mint amount must be greater than 0");

        balanceOf[to] += amount;
        totalSupply += amount;
        
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
        return true;
    }

    /**
     * @dev Burn tokens from sender's account
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) public returns (bool success) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");
        require(amount > 0, "Burn amount must be greater than 0");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
        return true;
    }

    /**
     * @dev Transfer tokens to an address
     * @param to Recipient address
     * @param value Amount of tokens to transfer
     */
    function transfer(address to, uint256 value) public returns (bool success) {
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        require(value > 0, "Transfer amount must be greater than 0");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        transactionCount[msg.sender]++;
        
        emit Transfer(msg.sender, to, value);
        return true;
    }

    /**
     * @dev Transfer tokens on behalf of another address
     * @param from Source address
     * @param to Recipient address
     * @param value Amount of tokens to transfer
     */
    function transferFrom(address from, address to, uint256 value) public returns (bool success) {
        require(from != address(0), "Cannot transfer from zero address");
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        require(value > 0, "Transfer amount must be greater than 0");

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        transactionCount[from]++;
        
        emit Transfer(from, to, value);
        return true;
    }

    /**
     * @dev Approve tokens for spending by another address
     * @param spender Address authorized to spend
     * @param value Amount of tokens to approve
     */
    function approve(address spender, uint256 value) public returns (bool success) {
        require(spender != address(0), "Cannot approve zero address");
        
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    /**
     * @dev Get balance of an address
     * @param account Address to check balance for
     */
    function getBalance(address account) public view returns (uint256) {
        require(account != address(0), "Cannot get balance of zero address");
        return balanceOf[account];
    }

    /**
     * @dev Get transaction count for an address
     * @param account Address to check transaction count
     */
    function getTransactionCount(address account) public view returns (uint256) {
        return transactionCount[account];
    }

    /**
     * @dev Transfer ownership to a new owner
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) public returns (bool success) {
        require(msg.sender == owner, "Only current owner can transfer ownership");
        require(newOwner != address(0), "Cannot transfer to zero address");
        
        owner = newOwner;
        return true;
    }
}
