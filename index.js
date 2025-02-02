import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import Moralis from 'moralis';
import { parse, write } from 'fast-csv';
import { mean, std } from 'mathjs'; // For calculations

// Convert __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE = path.join(__dirname, 'src/top_traders_account_numbers.csv');
const OUTPUT_FILE = 'ranked_wallets.csv';

const API_KEY = '79910782-427a-4d42-96a8-230e88f9f88f'; // Replace with your actual API key

async function fetchWalletHistory(wallet) {
    try {
        if (!wallet) throw new Error("Wallet address is required.");

        const url = `https://api.helius.xyz/v0/addresses/${wallet}/transactions?api-key=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data || null; // Ensure response is not undefined
    } catch (error) {
        console.error(`Error fetching data for wallet ${wallet}: ${error.message}`);
        return null;
    }
}

async function analyzeWalletPerformance(wallet) {
    try {
        const transactions = await fetchWalletHistory(wallet);
        console.log("transactions", transactions)
        if (!transactions || transactions.length === 0) return null;

        let totalInvestment = 0;
        let totalReturns = 0;
        let transactionCount = transactions.length;
        let volumes = [];
        let returns = [];
        let timestamps = [];

        transactions.forEach(tx => {
            tx.tokenTransfers.forEach(transfer => {
                if (transfer.toUserAccount === wallet) {
                    totalReturns += transfer.tokenAmount;
                } else if (transfer.fromUserAccount === wallet) {
                    totalInvestment += transfer.tokenAmount;
                }
            });

            if (tx.timestamp) {
                timestamps.push(tx.timestamp);
            }
        });

        const roi = totalInvestment ? ((totalReturns - totalInvestment) / totalInvestment) * 100 : 0;

        const firstTimestamp = Math.min(...timestamps) * 1000;
        const lastTimestamp = Math.max(...timestamps) * 1000;
        const daysActive = (lastTimestamp - firstTimestamp) / (1000 * 60 * 60 * 24);
        const tradingFrequency = daysActive > 0 ? transactionCount / daysActive : 0;

        const activityLevel = { transactionCount, totalInvestment, totalReturns };

        timestamps.forEach((timestamp, i) => {
            if (i > 0) {
                const dailyReturn = (transactions[i].fee / transactions[i - 1].fee) - 1;
                returns.push(dailyReturn);
            }
        });

        const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length || 0;
        const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / (returns.length || 1));

        const sharpeRatio = volatility ? meanReturn / volatility : 0;

        return {
            roi: roi.toFixed(2) + '%',
            tradingFrequency: tradingFrequency.toFixed(2) + ' trades/day',
            activityLevel,
            volatility: volatility.toFixed(4),
            sharpeRatio: sharpeRatio.toFixed(4),
        };
    } catch (error) {
        console.error(`Error analyzing wallet performance: ${error.message}`);
        return null;
    }
}

function convertCSVToWallets() {
    return new Promise((resolve, reject) => {
        const wallets = [];
        fs.createReadStream(CSV_FILE)
            .pipe(parse({ headers: false }))
            .on('data', (row) => {
                const wallet = Object.values(row)[0]?.trim();
                if (wallet) wallets.push(wallet);
            })
            .on('end', () => resolve(wallets))
            .on('error', (err) => reject(`Error reading CSV: ${err.message}`));
    });
}
async function processWallets() {
    try {
        const wallets = await convertCSVToWallets();
        console.log(`Processing ${wallets.length} wallets...`);

        let rankedWallets = [];

        for (const wallet of wallets) {
            try {
                let indicators = await analyzeWalletPerformance(wallet);

                if (indicators) {
                    rankedWallets.push({ wallet, ...indicators });
                }
            } catch (error) {
                console.error(`Error processing wallet ${wallet}:`, error.message);
            }
        }

        rankedWallets.sort((a, b) =>
            b.roi + b.sharpeRatio + b.tradingFrequency -
            (a.roi + a.sharpeRatio + a.tradingFrequency)
        );

        const ws = fs.createWriteStream(OUTPUT_FILE);
        write(rankedWallets, { headers: true }).pipe(ws);
        console.log(`Ranking completed! Results saved to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error(error.message);
    }
}

processWallets().catch(console.error);
