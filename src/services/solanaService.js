const { Connection, PublicKey } = require('@solana/web3.js');

// Fetch transaction and portfolio data for a wallet
const fetchWalletData = async (walletAddress) => {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const publicKey = new PublicKey(walletAddress);

    // Example: Fetch transaction history
    const transactionHistory = await connection.getConfirmedSignaturesForAddress2(publicKey);

    // Example: Fetch portfolio (You might need a library or custom logic for this)
    const portfolio = {}; // Add logic to fetch portfolio details.

    return { address: walletAddress, transactions: transactionHistory, portfolio };
};

module.exports = { fetchWalletData };
