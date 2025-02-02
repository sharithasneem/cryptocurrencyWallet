const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true },
    transactions: [{
        transactionId: { type: String },
        timestamp: { type: Date },
        amount: { type: Number },
        token: { type: String },
        counterparty: { type: String },
    }],
    portfolio: [{
        token: { type: String },
        balance: { type: Number },
    }],
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
