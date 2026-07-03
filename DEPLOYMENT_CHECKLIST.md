# Token Ledger Deployment Checklist

## ✅ Pre-Deployment

### Environment Setup
- [ ] Node.js v14+ installed
- [ ] MongoDB running and accessible
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env` file)
- [ ] git initialized for version control

### Code Review
- [ ] Smart contract reviewed (TokenLedger.sol)
- [ ] Models validated (TokenLedger.js, TokenHolder.js)
- [ ] Controller logic reviewed (tokenController.js)
- [ ] Routes configured correctly (tokenRoute.js)
- [ ] app.js updated with token routes

### Testing
- [ ] All tests pass: `node server/tests/tokenIntegration.test.js`
- [ ] MongoDB indices created automatically
- [ ] Error handling verified
- [ ] Edge cases tested (insufficient balance, invalid addresses)

## 🚀 Installation Steps

### Step 1: Install Dependencies
```bash
cd server
npm install uuid mongoose axios
```
- [ ] uuid installed (for operation IDs)
- [ ] mongoose installed (for MongoDB)
- [ ] axios installed (for HTTP requests in tests)

### Step 2: Configure Environment
```bash
# Copy example configuration
cp server/.env.example.token server/.env

# Update with your values
nano server/.env
```
Configuration settings to update:
- [ ] MONGO_URI (point to your MongoDB instance)
- [ ] NODE_ENV (set to development/production)
- [ ] PORT (default 5000)

### Step 3: Verify Database Connection
```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/cryptocity"
show dbs
```
- [ ] MongoDB responds
- [ ] Database created: `cryptocity`

### Step 4: Start Server
```bash
npm start
# or
node server/server.js
```
- [ ] Server starts without errors
- [ ] Listening on configured port
- [ ] No connection errors in console

## 🧪 Testing After Deployment

### Test 1: Health Check
```bash
curl http://localhost:5000/api/token/stats
```
Expected:
- [ ] Status 200
- [ ] Returns statistics object
- [ ] No error messages

### Test 2: Mint Tokens
```bash
curl -X POST http://localhost:5000/api/token/mint \
  -H "Content-Type: application/json" \
  -d '{
    "toAddress": "0xTest1234567890123456789012345678901234",
    "amount": "1000000000000000000"
  }'
```
Expected:
- [ ] Status 201
- [ ] Transaction hash generated
- [ ] Balance updated in response

### Test 3: Check Balance
```bash
curl http://localhost:5000/api/token/balance/0xTest1234567890123456789012345678901234
```
Expected:
- [ ] Status 200
- [ ] Balance matches minted amount
- [ ] Transaction count = 1

### Test 4: Transfer Tokens
```bash
curl -X POST http://localhost:5000/api/token/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromAddress": "0xTest1234567890123456789012345678901234",
    "toAddress": "0xTest5555555555555555555555555555555555",
    "amount": "500000000000000000"
  }'
```
Expected:
- [ ] Status 200
- [ ] Both balances updated
- [ ] Transaction recorded

### Test 5: Run Full Integration Test
```bash
node server/tests/tokenIntegration.test.js
```
Expected:
- [ ] All examples complete successfully
- [ ] Workflow finishes without errors
- [ ] Statistics update throughout

## 📊 Database Verification

### Verify Collections Created
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/cryptocity"

# List collections
show collections

# Should see:
# - tokenholders
# - tokenledgers
```
- [ ] TokenHolder collection exists
- [ ] TokenLedger collection exists
- [ ] Indices created automatically

### Verify Data
```bash
# Check token holders
db.tokenholders.find().limit(5)

# Check transactions
db.tokenledgers.find().sort({createdAt: -1}).limit(5)
```
- [ ] Holder documents contain balance data
- [ ] Ledger documents contain transaction data

## 🔗 Integration with Existing System

### Frontend Integration Checklist
- [ ] API base URL configured in frontend (.env)
- [ ] Axios/fetch calls point to correct endpoints
- [ ] CORS configured if frontend on different domain
- [ ] Error handling implemented in components

### User System Integration
- [ ] Token holders linked to user accounts (userId field)
- [ ] User authentication integrated if needed
- [ ] Address management in user profile

### Existing API Routes
- [ ] Token routes don't conflict with existing routes
- [ ] /api/token path available and not used
- [ ] All original routes still functional

## 📈 Performance Checks

### Database Performance
- [ ] TokenHolder queries complete in < 100ms
- [ ] TokenLedger queries complete in < 200ms
- [ ] Statistics aggregation completes in < 500ms
- [ ] Top holders query completes in < 100ms

### API Response Times
```bash
# Time a simple request
time curl http://localhost:5000/api/token/stats
```
- [ ] Balance queries return within 100ms
- [ ] Transfer operations complete within 500ms
- [ ] Transaction history paginated properly

### Database Size
```bash
# Check database size
db.stats()
```
- [ ] Monitor database growth
- [ ] Archive old transactions if needed
- [ ] Set up backup strategy

## 🔒 Security Verification

### Input Validation
- [ ] Invalid addresses rejected
- [ ] Negative amounts rejected
- [ ] Missing required fields handled
- [ ] String inputs sanitized

### Error Handling
- [ ] Errors don't expose sensitive info
- [ ] Transaction logging prevents duplicates
- [ ] Failed operations logged properly

### Access Control (if implemented)
- [ ] Authentication required for sensitive operations
- [ ] Authorization checks in place
- [ ] Rate limiting configured

## 📝 Documentation Verification

- [ ] TOKEN_LEDGER_API.md complete and accurate
- [ ] TOKEN_LEDGER_QUICKSTART.md covers all basics
- [ ] TOKEN_INTEGRATION_SUMMARY.md up to date
- [ ] Code comments clear and helpful
- [ ] README updated with token info

## 🚨 Troubleshooting Guide

### Issue: MongoDB Connection Failed
- [ ] Check MongoDB is running: `mongod --version`
- [ ] Verify MONGO_URI in .env
- [ ] Check firewall/network settings

### Issue: Port Already in Use
- [ ] Change PORT in .env
- [ ] Or kill existing process: `lsof -i :5000`

### Issue: Module Not Found
- [ ] Run `npm install` again
- [ ] Check all dependencies listed
- [ ] Verify node_modules directory

### Issue: CORS Errors
- [ ] Update CORS_ORIGIN in .env
- [ ] Include frontend URL
- [ ] Restart server after changes

## ✅ Final Verification

```bash
# Run all checks
echo "1. Checking Node.js..."
node --version

echo "2. Checking MongoDB..."
mongosh --version

echo "3. Starting server..."
npm start

# In another terminal:
echo "4. Testing API..."
curl http://localhost:5000/api/token/stats

echo "5. Running integration tests..."
node server/tests/tokenIntegration.test.js
```

- [ ] All checks pass
- [ ] No error messages
- [ ] System ready for production

## 📋 Deployment Notes

**Date Deployed**: ___________
**Environment**: ___________
**Server URL**: ___________
**Database**: ___________
**Notes**: ___________

## 🎉 Go Live Checklist

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Backups configured
- [ ] Monitoring configured
- [ ] Team trained on system
- [ ] Support procedures documented
- [ ] Rollback plan in place

---

**Ready to Deploy**: ✅ YES / ❌ NO

**Sign-off**: ___________________ Date: ___________
