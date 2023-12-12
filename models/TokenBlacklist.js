// models/TokenBlacklist.js

const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
}, { timestamps: true });


const TokenBlacklist = mongoose.model('TokenBlacklist', TokenBlacklistSchema);

module.exports = TokenBlacklist;
