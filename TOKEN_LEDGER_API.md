# Token Ledger API Integration Guide

## Overview

The Token Ledger API provides a simulated blockchain-like token system integrated with smart contracts. It enables minting, transferring, burning, and balance tracking without direct blockchain dependencies, making it ideal for development, testing, and educational purposes.

## Features

- **Mint Tokens**: Create new tokens and distribute them to addresses
- **Transfer Tokens**: Transfer tokens between addresses with full ledger tracking
- **Burn Tokens**: Remove tokens from circulation
- **Balance Checking**: Query current token balances
- **Transaction History**: Track all token operations
- **Holder Statistics**: View detailed holder information
- **Global Statistics**: Monitor overall token metrics
- **Simulated Smart Contract**: TokenLedger.sol for contract-level operations

## Architecture

### Components

1. **Smart Contract** (`contracts/TokenLedger.sol`)
   - Solidity contract for token operations
   - Simulates blockchain without dependencies
   - Functions: mint, burn, transfer, transferFrom, approve

2. **Data Models**
   - `TokenLedger`: Records all transactions
   - `TokenHolder`: Tracks individual holder balances and statistics

3. **Controller** (`controllers/tokenController.js`)
   - Handles API business logic
   - Manages token operations
   - Query and statistics generation

4. **Routes** (`routes/tokenRoute.js`)
   - RESTful API endpoints
   - Request validation
   - Response formatting

## API Endpoints

### Balance & Holder Information

#### Get Balance
```http
GET /api/token/balance/:address
```
Returns the current token balance for an address.

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "balance": "1000000000000000000",
    "balanceInWei": "1000000000000000000",
    "transactionCount": 5
  }
}
```

#### Get Holder Details
```http
GET /api/token/holder/:address
```
Returns complete holder information including statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "balance": "1000000000000000000",
    "totalMinted": "2000000000000000000",
    "totalBurned": "500000000000000000",
    "totalTransferred": "1500000000000000000",
    "totalReceived": "1000000000000000000",
    "transactionCount": 10,
    "transferCount": 5,
    "receiveCount": 3,
    "accountStatus": "ACTIVE",
    "lastTransactionAt": "2024-07-03T10:30:00.000Z"
  }
}
```

### Token Operations

#### Mint Tokens
```http
POST /api/token/mint
Content-Type: application/json

{
  "toAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "amount": "1000000000000000000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tokens minted successfully",
  "data": {
    "operationId": "OP-550e8400-e29b-41d4-a716-446655440000",
    "transactionHash": "0xabcdef...",
    "toAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "amount": "1000000000000000000",
    "newBalance": "1000000000000000000",
    "transactionCount": 1,
    "timestamp": "2024-07-03T10:30:00.000Z"
  }
}
```

#### Transfer Tokens
```http
POST /api/token/transfer
Content-Type: application/json

{
  "fromAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "toAddress": "0x1111111111111111111111111111111111111111",
  "amount": "500000000000000000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tokens transferred successfully",
  "data": {
    "operationId": "OP-550e8400-e29b-41d4-a716-446655440001",
    "transactionHash": "0xabcdef...",
    "fromAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "toAddress": "0x1111111111111111111111111111111111111111",
    "amount": "500000000000000000",
    "fromNewBalance": "500000000000000000",
    "toNewBalance": "500000000000000000",
    "timestamp": "2024-07-03T10:30:00.000Z"
  }
}
```

#### Burn Tokens
```http
POST /api/token/burn
Content-Type: application/json

{
  "address": "0xabcdef1234567890abcdef1234567890abcdef12",
  "amount": "100000000000000000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tokens burned successfully",
  "data": {
    "operationId": "OP-550e8400-e29b-41d4-a716-446655440002",
    "transactionHash": "0xabcdef...",
    "address": "0xabcdef1234567890abcdef1234567890abcdef12",
    "amount": "100000000000000000",
    "newBalance": "400000000000000000",
    "totalBurned": "100000000000000000",
    "timestamp": "2024-07-03T10:30:00.000Z"
  }
}
```

### Query & Statistics

#### Get Transaction History
```http
GET /api/token/transactions/history?address=0xabcd...&type=TRANSFER&limit=50&page=1
```

**Parameters:**
- `address` (optional): Filter by address
- `type` (optional): Filter by operation type (MINT, TRANSFER, BURN)
- `limit` (optional): Results per page (default: 50)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "operationId": "OP-550e8400-e29b-41d4-a716-446655440000",
      "operationType": "TRANSFER",
      "fromAddress": "0xabcdef...",
      "toAddress": "0x111111...",
      "amount": "500000000000000000",
      "status": "SUCCESS",
      "transactionHash": "0xabcdef...",
      "createdAt": "2024-07-03T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "pages": 2
  }
}
```

#### Get Token Statistics
```http
GET /api/token/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalHolders": 25,
    "activeTransactions": 150,
    "mintTransactions": 30,
    "burnTransactions": 10,
    "totalSupply": "100000000000000000000",
    "totalBurned": "5000000000000000000",
    "netSupply": "95000000000000000000"
  }
}
```

#### Get Top Holders
```http
GET /api/token/holders/top?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "address": "0xabcdef...",
      "balance": "50000000000000000000",
      "balanceInWei": "50000000000000000000",
      "transactionCount": 25,
      "lastTransactionAt": "2024-07-03T10:30:00.000Z"
    }
  ]
}
```

## Configuration

### Environment Setup

1. **Install Dependencies**
```bash
cd server
npm install uuid mongoose axios
```

2. **Database Configuration**
Ensure MongoDB is running and configured in your `server/config/database.js`:
```javascript
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cryptocity";
```

3. **Start the Server**
```bash
npm start
# or
node server/server.js
```

The API will be available at: `http://localhost:5000/api/token`

## Integration Examples

### React Frontend Integration

```javascript
import axios from "axios";

// Mint tokens
async function mintTokens(toAddress, amount) {
  try {
    const response = await axios.post("/api/token/mint", {
      toAddress,
      amount,
    });
    console.log("Minted:", response.data);
  } catch (error) {
    console.error("Mint failed:", error.response.data);
  }
}

// Get balance
async function getBalance(address) {
  try {
    const response = await axios.get(`/api/token/balance/${address}`);
    return response.data.data.balance;
  } catch (error) {
    console.error("Get balance failed:", error.response.data);
  }
}

// Transfer tokens
async function transferTokens(fromAddress, toAddress, amount) {
  try {
    const response = await axios.post("/api/token/transfer", {
      fromAddress,
      toAddress,
      amount,
    });
    console.log("Transferred:", response.data);
  } catch (error) {
    console.error("Transfer failed:", error.response.data);
  }
}
```

### Smart Contract Integration

The `TokenLedger.sol` contract provides the on-chain interface:

```solidity
// Deploy and interact with TokenLedger
TokenLedger token = new TokenLedger();

// Mint tokens
token.mint(toAddress, 1000000000000000000);

// Transfer tokens
token.transfer(recipientAddress, 500000000000000000);

// Check balance
uint256 balance = token.getBalance(holderAddress);

// Burn tokens
token.burn(100000000000000000);
```

## Testing

Run the integration tests:

```bash
node server/tests/tokenIntegration.test.js
```

This will execute a complete workflow demonstrating all token operations.

## Error Handling

The API provides detailed error messages:

```json
{
  "success": false,
  "message": "Insufficient balance for transfer",
  "error": "Insufficient balance"
}
```

Common errors:
- **400**: Invalid input or insufficient balance
- **404**: Address not found (returns default zero balance)
- **500**: Server error in processing

## Data Storage

All token operations are recorded in MongoDB:

1. **TokenLedger Collection**: Complete transaction history
2. **TokenHolder Collection**: Current holder balances and statistics

This enables full auditability and transaction history tracking.

## Security Considerations

⚠️ **Note**: This is a simulated system without real blockchain security. For production use:

1. Implement proper authentication
2. Add rate limiting
3. Use environment variables for sensitive data
4. Implement transaction signature verification
5. Add comprehensive input validation
6. Use HTTPS for all API calls

## Future Enhancements

- [ ] Ethereum mainnet/testnet integration via Web3.js
- [ ] ERC-20 token standard compliance
- [ ] Multi-signature support
- [ ] Token staking mechanisms
- [ ] Governance token features
- [ ] Advanced DeFi integration

## Support & Documentation

- **Smart Contract**: [contracts/TokenLedger.sol](../contracts/TokenLedger.sol)
- **Controller**: [controllers/tokenController.js](../controllers/tokenController.js)
- **Test File**: [tests/tokenIntegration.test.js](../tests/tokenIntegration.test.js)
