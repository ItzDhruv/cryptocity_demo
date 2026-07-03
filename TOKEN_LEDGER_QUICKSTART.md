# Token Ledger Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or cloud instance)
- Git

### Installation Steps

1. **Navigate to server directory**
```bash
cd server
```

2. **Install required packages**
```bash
npm install uuid mongoose axios
```

3. **Configure environment variables** (if needed)
```bash
# Add to .env or server/config/config.env
MONGO_URI=mongodb://localhost:27017/cryptocity
NODE_ENV=development
PORT=5000
```

4. **Start the server**
```bash
npm start
# or
node server/server.js
```

5. **Verify API is running**
```bash
curl http://localhost:5000/api/token/stats
```

## 📋 API Quick Reference

### Create a Token Holder (Mint)
```bash
curl -X POST http://localhost:5000/api/token/mint \
  -H "Content-Type: application/json" \
  -d '{
    "toAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "amount": "1000000000000000000"
  }'
```

### Check Balance
```bash
curl http://localhost:5000/api/token/balance/0xabcdef1234567890abcdef1234567890abcdef12
```

### Transfer Tokens
```bash
curl -X POST http://localhost:5000/api/token/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
    "toAddress": "0x1111111111111111111111111111111111111111",
    "amount": "500000000000000000"
  }'
```

### Burn Tokens
```bash
curl -X POST http://localhost:5000/api/token/burn \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xabcdef1234567890abcdef1234567890abcdef12",
    "amount": "100000000000000000"
  }'
```

### Get Statistics
```bash
curl http://localhost:5000/api/token/stats
```

### Get Top Holders
```bash
curl http://localhost:5000/api/token/holders/top?limit=10
```

## 🔧 Component Overview

### Files Created

```
server/
├── models/
│   ├── TokenLedger.js          # Transaction ledger model
│   └── TokenHolder.js           # Account balance model
├── controllers/
│   └── tokenController.js       # API business logic
├── routes/
│   └── tokenRoute.js            # API endpoints
└── tests/
    └── tokenIntegration.test.js # Integration tests

contracts/
└── TokenLedger.sol              # Smart contract

docs/
└── TOKEN_LEDGER_API.md          # Full API documentation
```

### How It Works

1. **Request** → RESTful API endpoint
2. **Route** → Directs to tokenRoute.js
3. **Controller** → Processes business logic
4. **Models** → Update MongoDB collections
5. **Response** → JSON with transaction details

### Data Flow

```
├─ Mint Request
│  ├─ Validate input
│  ├─ Update TokenHolder balance
│  ├─ Record in TokenLedger
│  └─ Return transaction details

├─ Transfer Request
│  ├─ Validate both addresses
│  ├─ Check sender balance
│  ├─ Deduct from sender
│  ├─ Add to recipient
│  ├─ Record both in TokenLedger
│  └─ Return transfer details

└─ Query Requests
   ├─ Search TokenLedger/TokenHolder
   ├─ Aggregate statistics
   └─ Return formatted data
```

## 💾 Database Models

### TokenHolder Collection
Stores current balances and statistics for each address.

```javascript
{
  address: String,           // Unique address
  balance: String,           // Current balance
  totalMinted: String,       // Total minted
  totalBurned: String,       // Total burned
  totalTransferred: String,  // Total sent
  totalReceived: String,     // Total received
  transactionCount: Number,  // Total transactions
  accountStatus: String,     // ACTIVE/FROZEN/INACTIVE
  lastTransactionAt: Date    // Last transaction timestamp
}
```

### TokenLedger Collection
Complete history of all transactions.

```javascript
{
  operationId: String,       // Unique operation ID
  operationType: String,     // MINT/TRANSFER/BURN/APPROVE
  fromAddress: String,       // Sender address
  toAddress: String,         // Recipient address
  amount: String,            // Amount transferred
  status: String,            // SUCCESS/FAILED/PENDING
  transactionHash: String,   // Simulated transaction hash
  createdAt: Date            // Timestamp
}
```

## 📊 Example Workflow

```javascript
// Step 1: Mint 1000 tokens to address A
POST /api/token/mint
{
  "toAddress": "0xAAA...",
  "amount": "1000000000000000000"
}
// Result: Address A has 1000 tokens

// Step 2: Transfer 300 tokens to address B
POST /api/token/transfer
{
  "fromAddress": "0xAAA...",
  "toAddress": "0xBBB...",
  "amount": "300000000000000000"
}
// Result: A has 700, B has 300

// Step 3: Burn 100 tokens from A
POST /api/token/burn
{
  "address": "0xAAA...",
  "amount": "100000000000000000"
}
// Result: A has 600, total supply reduced

// Step 4: Check balances
GET /api/token/balance/0xAAA...  // Returns 600
GET /api/token/balance/0xBBB...  // Returns 300
```

## 🧪 Running Tests

```bash
# Run the integration test
node server/tests/tokenIntegration.test.js

# Or import in your test file
const { runCompleteWorkflow } = require('./tokenIntegration.test.js');
await runCompleteWorkflow();
```

## 🔗 Integration Points

### With Existing User System
```javascript
// Link token holder to user
const holder = new TokenHolder({
  address: userWalletAddress,
  userId: mongoUserId,  // Reference to User model
  balance: "0"
});
```

### With Smart Contracts
```solidity
// TokenLedger.sol provides on-chain verification
contract TokenLedger {
  mapping(address => uint256) public balanceOf;
  
  function getBalance(address account) public view returns (uint256) {
    return balanceOf[account];
  }
}
```

## 🚨 Troubleshooting

### Issue: MongoDB Connection Error
```bash
# Ensure MongoDB is running
mongod --version  # Check if installed
mongod            # Start MongoDB
```

### Issue: Module not found (uuid)
```bash
npm install uuid
```

### Issue: API returns 404
```bash
# Check if tokenRoute.js is imported in app.js
# Verify routes are registered:
app.use('/api/token', tokenRouter);
```

### Issue: Balance showing 0
```bash
# Mint some tokens first
curl -X POST http://localhost:5000/api/token/mint \
  -H "Content-Type: application/json" \
  -d '{"toAddress": "0x1234...", "amount": "1000000000000000000"}'
```

## 📝 Next Steps

1. ✅ Start the server
2. ✅ Run the integration test
3. ✅ Explore API endpoints with curl/Postman
4. ✅ Integrate into frontend components
5. ✅ Connect with existing user system
6. ✅ Deploy to test environment

## 📚 Additional Resources

- [Full API Documentation](./TOKEN_LEDGER_API.md)
- [Smart Contract Code](./contracts/TokenLedger.sol)
- [Controller Implementation](./server/controllers/tokenController.js)
- [Integration Tests](./server/tests/tokenIntegration.test.js)

---

**Need Help?** Check the full documentation or review the example integration tests.
