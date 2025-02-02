const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');

// Route to create a new wallet
router.post('/', async (req, res) => {
    console.log("hey walet route here")
    const { walletAddress } = req.body;
    console.log("hey walet route here", req.body)

    try {
        const newWallet = new Wallet({
            walletAddress,
        });

        await newWallet.save();
        res.status(201).json(newWallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Route to get a wallet's data by address
router.get('/:walletAddress', async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ walletAddress: req.params.walletAddress });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json(wallet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
