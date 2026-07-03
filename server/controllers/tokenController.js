const TokenLedger = require("../models/TokenLedger");
const TokenHolder = require("../models/TokenHolder");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Helper function to generate transaction hash
const generateTransactionHash = () => {
  return "0x" + crypto.randomBytes(32).toString("hex");
};

// Helper function to generate operation ID
const generateOperationId = () => {
  return `OP-${uuidv4()}`;
};

// Middleware for error handling (imported from existing)
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");

/**
 * Get token balance for an address
 * @route GET /api/token/balance/:address
 */
exports.getBalance = asyncErrorHandler(async (req, res, next) => {
  const { address } = req.params;

  if (!address || address.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Address is required",
    });
  }

  const holder = await TokenHolder.findOne({
    address: address.toLowerCase(),
  });

  if (!holder) {
    return res.status(200).json({
      success: true,
      data: {
        address: address.toLowerCase(),
        balance: "0",
        balanceInWei: "0",
        transactionCount: 0,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      address: holder.address,
      balance: holder.balance,
      balanceInWei: holder.balanceInWei,
      transactionCount: holder.transactionCount,
      accountStatus: holder.accountStatus,
      lastTransactionAt: holder.lastTransactionAt,
    },
  });
});

/**
 * Mint new tokens
 * @route POST /api/token/mint
 */
exports.mintTokens = asyncErrorHandler(async (req, res, next) => {
  const { toAddress, amount } = req.body;

  if (!toAddress || !amount) {
    return res.status(400).json({
      success: false,
      message: "toAddress and amount are required",
    });
  }

  if (BigInt(amount) <= 0n) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0",
    });
  }

  const operationId = generateOperationId();
  const txHash = generateTransactionHash();
  const addresses = toAddress.toLowerCase();

  try {
    // Update or create token holder
    let holder = await TokenHolder.findOne({ address: addresses });

    if (!holder) {
      holder = new TokenHolder({
        address: addresses,
        balance: amount,
        balanceInWei: amount,
        totalMinted: amount,
        transactionCount: 1,
      });
    } else {
      const prevBalance = holder.balance;
      holder.balance = (BigInt(prevBalance) + BigInt(amount)).toString();
      holder.balanceInWei = holder.balance;
      holder.totalMinted = (BigInt(holder.totalMinted) + BigInt(amount)).toString();
      holder.transactionCount += 1;
      holder.lastTransactionAt = new Date();
    }

    await holder.save();

    // Record transaction in ledger
    const ledgerEntry = new TokenLedger({
      operationId,
      operationType: "MINT",
      toAddress: addresses,
      amount,
      amountInWei: amount,
      toBalance: holder.balance,
      totalSupply: (BigInt(holder.totalMinted)).toString(),
      status: "SUCCESS",
      transactionHash: txHash,
    });

    await ledgerEntry.save();

    res.status(201).json({
      success: true,
      message: "Tokens minted successfully",
      data: {
        operationId,
        transactionHash: txHash,
        toAddress: addresses,
        amount,
        newBalance: holder.balance,
        transactionCount: holder.transactionCount,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Log failed transaction
    const failedLedger = new TokenLedger({
      operationId,
      operationType: "MINT",
      toAddress: addresses,
      amount,
      amountInWei: amount,
      status: "FAILED",
      errorMessage: error.message,
      transactionHash: txHash,
    });
    await failedLedger.save();

    return res.status(500).json({
      success: false,
      message: "Failed to mint tokens",
      error: error.message,
    });
  }
});

/**
 * Transfer tokens between addresses
 * @route POST /api/token/transfer
 */
exports.transferTokens = asyncErrorHandler(async (req, res, next) => {
  const { fromAddress, toAddress, amount } = req.body;

  if (!fromAddress || !toAddress || !amount) {
    return res.status(400).json({
      success: false,
      message: "fromAddress, toAddress, and amount are required",
    });
  }

  if (BigInt(amount) <= 0n) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0",
    });
  }

  if (fromAddress.toLowerCase() === toAddress.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "Cannot transfer to the same address",
    });
  }

  const operationId = generateOperationId();
  const txHash = generateTransactionHash();
  const from = fromAddress.toLowerCase();
  const to = toAddress.toLowerCase();

  try {
    // Get sender holder
    let fromHolder = await TokenHolder.findOne({ address: from });

    if (!fromHolder || BigInt(fromHolder.balance) < BigInt(amount)) {
      const failedLedger = new TokenLedger({
        operationId,
        operationType: "TRANSFER",
        fromAddress: from,
        toAddress: to,
        amount,
        amountInWei: amount,
        status: "FAILED",
        errorMessage: "Insufficient balance",
        transactionHash: txHash,
      });
      await failedLedger.save();

      return res.status(400).json({
        success: false,
        message: "Insufficient balance for transfer",
      });
    }

    // Update sender
    fromHolder.balance = (BigInt(fromHolder.balance) - BigInt(amount)).toString();
    fromHolder.balanceInWei = fromHolder.balance;
    fromHolder.totalTransferred = (BigInt(fromHolder.totalTransferred) + BigInt(amount)).toString();
    fromHolder.transferCount += 1;
    fromHolder.transactionCount += 1;
    fromHolder.lastTransactionAt = new Date();
    await fromHolder.save();

    // Get or create receiver
    let toHolder = await TokenHolder.findOne({ address: to });

    if (!toHolder) {
      toHolder = new TokenHolder({
        address: to,
        balance: amount,
        balanceInWei: amount,
        totalReceived: amount,
        receiveCount: 1,
        transactionCount: 1,
      });
    } else {
      toHolder.balance = (BigInt(toHolder.balance) + BigInt(amount)).toString();
      toHolder.balanceInWei = toHolder.balance;
      toHolder.totalReceived = (BigInt(toHolder.totalReceived) + BigInt(amount)).toString();
      toHolder.receiveCount += 1;
      toHolder.transactionCount += 1;
      toHolder.lastTransactionAt = new Date();
    }

    await toHolder.save();

    // Record transaction in ledger
    const ledgerEntry = new TokenLedger({
      operationId,
      operationType: "TRANSFER",
      fromAddress: from,
      toAddress: to,
      amount,
      amountInWei: amount,
      fromBalance: fromHolder.balance,
      toBalance: toHolder.balance,
      status: "SUCCESS",
      transactionHash: txHash,
    });

    await ledgerEntry.save();

    res.status(200).json({
      success: true,
      message: "Tokens transferred successfully",
      data: {
        operationId,
        transactionHash: txHash,
        fromAddress: from,
        toAddress: to,
        amount,
        fromNewBalance: fromHolder.balance,
        toNewBalance: toHolder.balance,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Log failed transaction
    const failedLedger = new TokenLedger({
      operationId,
      operationType: "TRANSFER",
      fromAddress: from,
      toAddress: to,
      amount,
      amountInWei: amount,
      status: "FAILED",
      errorMessage: error.message,
      transactionHash: txHash,
    });
    await failedLedger.save();

    return res.status(500).json({
      success: false,
      message: "Failed to transfer tokens",
      error: error.message,
    });
  }
});

/**
 * Burn tokens
 * @route POST /api/token/burn
 */
exports.burnTokens = asyncErrorHandler(async (req, res, next) => {
  const { address, amount } = req.body;

  if (!address || !amount) {
    return res.status(400).json({
      success: false,
      message: "address and amount are required",
    });
  }

  if (BigInt(amount) <= 0n) {
    return res.status(400).json({
      success: false,
      message: "Amount must be greater than 0",
    });
  }

  const operationId = generateOperationId();
  const txHash = generateTransactionHash();
  const addr = address.toLowerCase();

  try {
    // Get holder
    let holder = await TokenHolder.findOne({ address: addr });

    if (!holder || BigInt(holder.balance) < BigInt(amount)) {
      const failedLedger = new TokenLedger({
        operationId,
        operationType: "BURN",
        fromAddress: addr,
        amount,
        amountInWei: amount,
        status: "FAILED",
        errorMessage: "Insufficient balance",
        transactionHash: txHash,
      });
      await failedLedger.save();

      return res.status(400).json({
        success: false,
        message: "Insufficient balance for burning",
      });
    }

    // Update holder
    const prevBalance = holder.balance;
    holder.balance = (BigInt(holder.balance) - BigInt(amount)).toString();
    holder.balanceInWei = holder.balance;
    holder.totalBurned = (BigInt(holder.totalBurned) + BigInt(amount)).toString();
    holder.transactionCount += 1;
    holder.lastTransactionAt = new Date();
    await holder.save();

    // Record transaction in ledger
    const ledgerEntry = new TokenLedger({
      operationId,
      operationType: "BURN",
      fromAddress: addr,
      amount,
      amountInWei: amount,
      fromBalance: holder.balance,
      status: "SUCCESS",
      transactionHash: txHash,
    });

    await ledgerEntry.save();

    res.status(200).json({
      success: true,
      message: "Tokens burned successfully",
      data: {
        operationId,
        transactionHash: txHash,
        address: addr,
        amount,
        newBalance: holder.balance,
        totalBurned: holder.totalBurned,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    // Log failed transaction
    const failedLedger = new TokenLedger({
      operationId,
      operationType: "BURN",
      fromAddress: addr,
      amount,
      amountInWei: amount,
      status: "FAILED",
      errorMessage: error.message,
      transactionHash: txHash,
    });
    await failedLedger.save();

    return res.status(500).json({
      success: false,
      message: "Failed to burn tokens",
      error: error.message,
    });
  }
});

/**
 * Get token holder details
 * @route GET /api/token/holder/:address
 */
exports.getHolderDetails = asyncErrorHandler(async (req, res, next) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: "Address is required",
    });
  }

  const holder = await TokenHolder.findOne({
    address: address.toLowerCase(),
  });

  if (!holder) {
    return res.status(200).json({
      success: true,
      data: {
        address: address.toLowerCase(),
        balance: "0",
        transactionCount: 0,
        transferCount: 0,
        receiveCount: 0,
        accountStatus: "ACTIVE",
      },
    });
  }

  res.status(200).json({
    success: true,
    data: holder,
  });
});

/**
 * Get transaction history
 * @route GET /api/token/transactions
 */
exports.getTransactionHistory = asyncErrorHandler(async (req, res, next) => {
  const { address, type, limit = 50, page = 1 } = req.query;

  let query = {};

  if (address) {
    const addr = address.toLowerCase();
    query = {
      $or: [{ fromAddress: addr }, { toAddress: addr }],
    };
  }

  if (type) {
    query.operationType = type;
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    TokenLedger.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip),
    TokenLedger.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: transactions,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get token statistics
 * @route GET /api/token/stats
 */
exports.getTokenStats = asyncErrorHandler(async (req, res, next) => {
  const [totalHolders, activeTransactions, mintTransactions, burnTransactions] =
    await Promise.all([
      TokenHolder.countDocuments({}),
      TokenLedger.countDocuments({ operationType: "TRANSFER" }),
      TokenLedger.countDocuments({ operationType: "MINT" }),
      TokenLedger.countDocuments({ operationType: "BURN" }),
    ]);

  const totalSupplyData = await TokenLedger.aggregate([
    {
      $match: { operationType: "MINT", status: "SUCCESS" },
    },
    {
      $group: {
        _id: null,
        totalSupply: {
          $sum: { $toDecimal: "$amount" },
        },
      },
    },
  ]);

  const totalBurnedData = await TokenLedger.aggregate([
    {
      $match: { operationType: "BURN", status: "SUCCESS" },
    },
    {
      $group: {
        _id: null,
        totalBurned: {
          $sum: { $toDecimal: "$amount" },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalHolders,
      activeTransactions,
      mintTransactions,
      burnTransactions,
      totalSupply: totalSupplyData[0]?.totalSupply || 0,
      totalBurned: totalBurnedData[0]?.totalBurned || 0,
      netSupply: (totalSupplyData[0]?.totalSupply || 0) - (totalBurnedData[0]?.totalBurned || 0),
    },
  });
});

/**
 * Get top token holders
 * @route GET /api/token/top-holders
 */
exports.getTopHolders = asyncErrorHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const holders = await TokenHolder.find({ accountStatus: "ACTIVE" })
    .sort({ balance: -1 })
    .limit(parseInt(limit))
    .select("address balance balanceInWei transactionCount lastTransactionAt");

  res.status(200).json({
    success: true,
    data: holders,
  });
});
