const axios = require('axios');

class AlphaVantageService {
    constructor() {
        this.apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        this.baseUrl = 'https://www.alphavantage.co/query';
    }

    // Get real-time stock quote
    async getStockQuote(symbol) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching quote for ${symbol}:`, error.message);
            throw error;
        }
    }

    // Get RSI (technical indicator)
    async getRSI(symbol, interval = 'daily') {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'RSI',
                    symbol: symbol,
                    interval: interval,
                    time_period: 14,
                    series_type: 'close',
                    apikey: this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching RSI for ${symbol}:`, error.message);
            throw error;
        }
    }
}

module.exports = new AlphaVantageService();