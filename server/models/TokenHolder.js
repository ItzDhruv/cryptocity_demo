const mongoose = require("mongoose");

const tokenHolderSchema = new mongoose.Schema(
  {
    // Wallet address or user identifier
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    
    // User reference (optional, for integration with user model)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
    },
    
    // Token balance details
    balance: {
      type: String, // Use string to handle large numbers precisely
      default: "0",
    },
    balanceInWei: {
      type: String, // Full precision balance
      default: "0",
    },
    
    // Transaction statistics
    totalMinted: {
      type: String,
      default: "0",
    },
    totalBurned: {
      type: String,
      default: "0",
    },
    totalTransferred: {
      type: String,
      default: "0",
    },
    totalReceived: {
      type: String,
      default: "0",
    },
    
    // Count statistics
    transactionCount: {
      type: Number,
      default: 0,
    },
    transferCount: {
      type: Number,
      default: 0,
    },
    receiveCount: {
      type: Number,
      default: 0,
    },
    
    // Account info
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "FROZEN", "INACTIVE"],
      default: "ACTIVE",
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
    lastTransactionAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
tokenHolderSchema.index({ address: 1 });
tokenHolderSchema.index({ userId: 1 });
tokenHolderSchema.index({ balance: 1 });
tokenHolderSchema.index({ accountStatus: 1 });

// Method to update balances
tokenHolderSchema.methods.addBalance = async function (amount) {
  this.balance = (BigInt(this.balance) + BigInt(amount)).toString();
  this.updatedAt = Date.now();
  return this.save();
};

tokenHolderSchema.methods.subtractBalance = async function (amount) {
  const currentBalance = BigInt(this.balance);
  const amountToSubtract = BigInt(amount);
  if (currentBalance < amountToSubtract) {
    throw new Error("Insufficient balance");
  }
  this.balance = (currentBalance - amountToSubtract).toString();
  this.updatedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model("TokenHolder", tokenHolderSchema);
