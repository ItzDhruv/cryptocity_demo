/**
 * Token Ledger API Integration Tests and Examples
 * 
 * This file demonstrates how to integrate and use the Token Ledger API
 * with smart contracts for minting, transferring, and checking balances.
 */

const axios = require("axios");

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000/api";
const TOKEN_API = `${API_BASE_URL}/token`;

/**
 * Example 1: Get Token Balance
 * Fetch the current balance for a specific address
 */
async function exampleGetBalance() {
  try {
    console.log("\n=== Example 1: Get Token Balance ===");
    const address = "0x1234567890abcdef1234567890abcdef12345678";

    const response = await axios.get(`${TOKEN_API}/balance/${address}`);
    console.log("Balance Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting balance:", error.message);
  }
}

/**
 * Example 2: Mint Tokens
 * Mint new tokens to an address (simulated on-chain operation)
 */
async function exampleMintTokens() {
  try {
    console.log("\n=== Example 2: Mint Tokens ===");
    const toAddress = "0xabcdef1234567890abcdef1234567890abcdef12";
    const amount = "1000000000000000000"; // 1 token with 18 decimals

    const response = await axios.post(`${TOKEN_API}/mint`, {
      toAddress,
      amount,
    });

    console.log("Mint Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error minting tokens:", error.message);
  }
}

/**
 * Example 3: Transfer Tokens
 * Transfer tokens from one address to another
 */
async function exampleTransferTokens() {
  try {
    console.log("\n=== Example 3: Transfer Tokens ===");
    const fromAddress = "0xabcdef1234567890abcdef1234567890abcdef12";
    const toAddress = "0x1111111111111111111111111111111111111111";
    const amount = "500000000000000000"; // 0.5 tokens

    const response = await axios.post(`${TOKEN_API}/transfer`, {
      fromAddress,
      toAddress,
      amount,
    });

    console.log("Transfer Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error transferring tokens:", error.message);
  }
}

/**
 * Example 4: Burn Tokens
 * Burn tokens from an address (remove from circulation)
 */
async function exampleBurnTokens() {
  try {
    console.log("\n=== Example 4: Burn Tokens ===");
    const address = "0xabcdef1234567890abcdef1234567890abcdef12";
    const amount = "100000000000000000"; // 0.1 tokens

    const response = await axios.post(`${TOKEN_API}/burn`, {
      address,
      amount,
    });

    console.log("Burn Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error burning tokens:", error.message);
  }
}

/**
 * Example 5: Get Holder Details
 * Retrieve detailed information about a token holder
 */
async function exampleGetHolderDetails() {
  try {
    console.log("\n=== Example 5: Get Holder Details ===");
    const address = "0xabcdef1234567890abcdef1234567890abcdef12";

    const response = await axios.get(`${TOKEN_API}/holder/${address}`);
    console.log("Holder Details Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting holder details:", error.message);
  }
}

/**
 * Example 6: Get Transaction History
 * Retrieve transaction history for an address or all transactions
 */
async function exampleGetTransactionHistory() {
  try {
    console.log("\n=== Example 6: Get Transaction History ===");
    const address = "0xabcdef1234567890abcdef1234567890abcdef12";
    const type = "TRANSFER";
    const limit = 10;
    const page = 1;

    const response = await axios.get(`${TOKEN_API}/transactions/history`, {
      params: { address, type, limit, page },
    });

    console.log("Transaction History Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting transaction history:", error.message);
  }
}

/**
 * Example 7: Get Token Statistics
 * Retrieve overall token statistics
 */
async function exampleGetTokenStats() {
  try {
    console.log("\n=== Example 7: Get Token Statistics ===");

    const response = await axios.get(`${TOKEN_API}/stats`);
    console.log("Token Statistics Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting token statistics:", error.message);
  }
}

/**
 * Example 8: Get Top Token Holders
 * Retrieve the top token holders
 */
async function exampleGetTopHolders() {
  try {
    console.log("\n=== Example 8: Get Top Token Holders ===");
    const limit = 10;

    const response = await axios.get(`${TOKEN_API}/holders/top`, {
      params: { limit },
    });

    console.log("Top Holders Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting top holders:", error.message);
  }
}

/**
 * Complete Integration Workflow
 * Demonstrates a full workflow of token operations
 */
async function runCompleteWorkflow() {
  try {
    console.log("\n\n========================================");
    console.log("Token Ledger API - Complete Workflow");
    console.log("========================================\n");

    // Step 1: Mint tokens to address A
    console.log("Step 1: Minting 1000 tokens to Address A...");
    const mintResult = await exampleMintTokens();
    const addressA = mintResult?.data?.toAddress;

    // Step 2: Get balance of address A
    console.log("\nStep 2: Checking balance of Address A...");
    await exampleGetBalance();

    // Step 3: Transfer tokens from A to B
    console.log("\nStep 3: Transferring 500 tokens from Address A to Address B...");
    await exampleTransferTokens();

    // Step 4: Get token statistics
    console.log("\nStep 4: Retrieving token statistics...");
    await exampleGetTokenStats();

    // Step 5: Get top holders
    console.log("\nStep 5: Retrieving top token holders...");
    await exampleGetTopHolders();

    // Step 6: Burn some tokens
    console.log("\nStep 6: Burning 100 tokens...");
    await exampleBurnTokens();

    // Step 7: Get final statistics
    console.log("\nStep 7: Retrieving final token statistics...");
    await exampleGetTokenStats();

    console.log("\n========================================");
    console.log("Workflow Completed Successfully!");
    console.log("========================================\n");
  } catch (error) {
    console.error("Workflow error:", error.message);
  }
}

// Export functions for use in other modules
module.exports = {
  exampleGetBalance,
  exampleMintTokens,
  exampleTransferTokens,
  exampleBurnTokens,
  exampleGetHolderDetails,
  exampleGetTransactionHistory,
  exampleGetTokenStats,
  exampleGetTopHolders,
  runCompleteWorkflow,
};

// Run workflow if executed directly
if (require.main === module) {
  runCompleteWorkflow().catch(console.error);
}
