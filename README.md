# Wallet Performance Analysis

## Overview
This project utilizes the Helius third-party API for fetching wallet transaction history. The Helius API provides timestamped transaction data, making it easy to implement and analyze wallet performance efficiently.

## Features
- Fetches wallet transaction history using Helius API
- Analyzes wallet performance metrics
- Computes trading activity and investment returns
- Ranks wallets based on ROI, Sharpe Ratio, and Trading Frequency
- Converts data into a CSV file for further analysis

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sharithasneem/cryptocurrencyWallet.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the script:
   ```sh
   node index.js
   ```

## Functionality Breakdown

### 1. Fetching Wallet Transaction History
- The function `fetchWalletHistory(wallet)` fetches transaction data from the Helius API.
- Ensures the wallet address is valid.
- Handles API errors and returns transaction data in JSON format.

### 2. Analyzing Wallet Performance
The function `analyzeWalletPerformance(wallet)`:
1. Fetches transaction history for a wallet.
2. Extracts investment and returns data.
3. Calculates key metrics:
   - **ROI (Return on Investment)**: Measures profitability.
   - **Trading Frequency**: Determines activity level.
   - **Sharpe Ratio**: Measures risk-adjusted returns.
   - **Volatility**: Assesses price fluctuations.
4. Returns a structured summary of wallet performance.

### 3. Processing Wallets from CSV
The function `convertCSVToWallets()`:
- Reads wallet addresses from a CSV file.
- Cleans and extracts wallet data.
- Returns a list of wallet addresses.

### 4. Ranking Wallets and Saving to CSV
The function `processWallets()`:
1. Loads wallet addresses from a CSV file.
2. Analyzes each wallet's performance.
3. Sorts wallets based on:
   - ROI
   - Sharpe Ratio
   - Trading Frequency
4. Saves the ranked data into a new CSV file (`ranked_wallets.csv`).

## Output
- The final ranked wallet data is stored in `ranked_wallets.csv`.
- The data includes:
  - Wallet Address
  - ROI (%)
  - Trading Frequency (trades/day)
  - Total Investment
  - Total Returns
  - Volatility
  - Sharpe Ratio

## Dependencies
- `fs`: File system operations
- `path`: File path handling
- `csv-parser` & `fast-csv`: CSV file parsing and writing
- `node-fetch`: API calls
- `moralis`: Blockchain analytics (optional)
- `mathjs`: Mathematical calculations

## Notes
- Ensure your API key is correctly set up in `.env`.
- The script may take some time depending on the number of wallets being processed.

## License
This project is licensed under the MIT License.

