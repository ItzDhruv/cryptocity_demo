const express = require("express");
const {
  getBalance,
  mintTokens,
  transferTokens,
  burnTokens,
  getHolderDetails,
  getTransactionHistory,
  getTokenStats,
  getTopHolders,
} = require("../controllers/tokenController");

const router = express.Router();

/**
 * Token Balance Routes
 */
router.get("/balance/:address", getBalance);
router.get("/holder/:address", getHolderDetails);

/**
 * Token Operation Routes
 */
router.post("/mint", mintTokens);
router.post("/transfer", transferTokens);
router.post("/burn", burnTokens);

/**
 * Query Routes
 */
router.get("/transactions/history", getTransactionHistory);
router.get("/stats", getTokenStats);
router.get("/holders/top", getTopHolders);

module.exports = router;
