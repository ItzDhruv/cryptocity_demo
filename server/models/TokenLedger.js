const mongoose = require("mongoose");

const tokenLedgerSchema = new mongoose.Schema(
  {
    // Unique transaction ID or operation ID
    operationId: {
      type: String,
      unique: true,
      required: true,
    },
    
    // Token metadata
    tokenName: {
      type: String,
      default: "LedgerToken",
    },
    tokenSymbol: {
      type: String,
      default: "LDG",
    },
    
    // Transaction details
    operationType: {
      type: String,
      enum: ["MINT", "BURN", "TRANSFER", "TRANSFER_FROM", "APPROVE"],
      required: true,
    },
    
    // Addresses involved
    fromAddress: {
      type: String,
      lowercase: true,
    },
    toAddress: {
      type: String,
      lowercase: true,
    },
    spenderAddress: {
      type: String,
      lowercase: true,
    },
    
    // Amount and value
    amount: {
      type: String, // Use string to handle large numbers
      required: true,
    },
    amountInWei: {
      type: String, // Full precision amount
      required: true,
    },
    
    // Current state tracking
    fromBalance: {
      type: String,
      default: "0",
    },
    toBalance: {
      type: String,
      default: "0",
    },
    totalSupply: {
      type: String,
      default: "0",
    },
    
    // Transaction status
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    
    // Error details if failed
    errorMessage: {
      type: String,
    },
    
    // Transaction hash (simulated)
    transactionHash: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
tokenLedgerSchema.index({ operationType: 1 });
tokenLedgerSchema.index({ fromAddress: 1 });
tokenLedgerSchema.index({ toAddress: 1 });
tokenLedgerSchema.index({ transactionHash: 1 });
tokenLedgerSchema.index({ createdAt: -1 });

module.exports = mongoose.model("TokenLedger", tokenLedgerSchema);
