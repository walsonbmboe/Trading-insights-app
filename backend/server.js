import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import pkg from "pg";

dotenv.config(); // Load env before using it

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

const app = express();

// ✅ Use fallback port to avoid EADDRINUSE
const PORT = process.env.PORT || 5000;

// ✅ Graceful port conflict handling
function startServer(port) {
  app.listen(port, () => {
    console.log(`🚀 Trading Insights API running on port ${port}`);
    console.log(`🏥 Health check available at http://localhost:${port}/health`);
    console.log(`📊 Market data endpoint: http://localhost:${port}/api/market-data`);
    console.log(`💡 Recommendations endpoint: http://localhost:${port}/api/recommendations`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Trying ${port + 1}...`);
      startServer(port + 1); // Retry with next port
    } else {
      throw err;
    }
  });
}

// ✅ Start the server with fallback logic
startServer(PORT);



// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock trading data (in production, you'd integrate with real APIs like Alpha Vantage, IEX Cloud, etc.)
let marketData = [
  { date: '2024-01-15', value: 4500, change: 2.3, volume: 1200000 },
  { date: '2024-01-16', value: 4520, change: 0.4, volume: 980000 },
  { date: '2024-01-17', value: 4480, change: -0.9, volume: 1500000 },
  { date: '2024-01-18', value: 4550, change: 1.6, volume: 1100000 },
  { date: '2024-01-19', value: 4580, change: 0.7, volume: 950000 },
];

let stockRecommendations = [
  // Technology Giants
  {
    symbol: 'AAPL',
    company: 'Apple Inc.',
    action: 'BUY',
    price: 185.50,
    change: 2.1,
    reason: 'Strong quarterly earnings and iPhone 15 sales momentum',
    confidence: 85,
    targetPrice: 200.00,
    volume: 45000000,
    marketCap: 2900000000000,
    peRatio: 28.5,
    previousClose: 181.50,
    sector: 'Technology'
  },
  {
    symbol: 'MSFT',
    company: 'Microsoft Corp.',
    action: 'BUY',
    price: 378.90,
    change: 1.8,
    reason: 'AI copilot integration driving enterprise adoption',
    confidence: 90,
    targetPrice: 420.00,
    volume: 28000000,
    marketCap: 2800000000000,
    peRatio: 32.1,
    previousClose: 372.20,
    sector: 'Technology'
  },
  {
    symbol: 'GOOGL',
    company: 'Alphabet Inc.',
    action: 'BUY',
    price: 142.50,
    change: 1.5,
    reason: 'AI integration boosting search and cloud revenue',
    confidence: 88,
    targetPrice: 160.00,
    volume: 22000000,
    marketCap: 1800000000000,
    peRatio: 25.2,
    previousClose: 140.40,
    sector: 'Technology'
  },
  {
    symbol: 'AMZN',
    company: 'Amazon.com Inc.',
    action: 'BUY',
    price: 155.90,
    change: 2.5,
    reason: 'AWS growth and e-commerce margin expansion',
    confidence: 82,
    targetPrice: 175.00,
    volume: 35000000,
    marketCap: 1600000000000,
    peRatio: 45.2,
    previousClose: 152.10,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'TSLA',
    company: 'Tesla Inc.',
    action: 'HOLD',
    price: 248.30,
    change: -1.2,
    reason: 'Consolidating after recent gains, awaiting Cybertruck delivery',
    confidence: 70,
    targetPrice: 280.00,
    volume: 85000000,
    marketCap: 790000000000,
    peRatio: 65.8,
    previousClose: 251.30,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'NVDA',
    company: 'NVIDIA Corp.',
    action: 'BUY',
    price: 620.40,
    change: 3.2,
    reason: 'AI chip demand surge and data center expansion',
    confidence: 95,
    targetPrice: 750.00,
    volume: 55000000,
    marketCap: 1520000000000,
    peRatio: 68.5,
    previousClose: 601.20,
    sector: 'Technology'
  },
  {
    symbol: 'META',
    company: 'Meta Platforms Inc.',
    action: 'HOLD',
    price: 310.20,
    change: -0.3,
    reason: 'VR investments offsetting advertising recovery',
    confidence: 68,
    targetPrice: 340.00,
    volume: 32000000,
    marketCap: 800000000000,
    peRatio: 22.8,
    previousClose: 311.13,
    sector: 'Technology'
  },
  {
    symbol: 'NFLX',
    company: 'Netflix Inc.',
    action: 'SELL',
    price: 450.75,
    change: -1.1,
    reason: 'Increased competition and subscriber growth concerns',
    confidence: 75,
    targetPrice: 400.00,
    volume: 18000000,
    marketCap: 200000000000,
    peRatio: 38.7,
    previousClose: 455.75,
    sector: 'Communication Services'
  },
  {
    symbol: 'ADBE',
    company: 'Adobe Inc.',
    action: 'BUY',
    price: 595.30,
    change: 1.9,
    reason: 'Creative Cloud dominance and AI features adoption',
    confidence: 83,
    targetPrice: 650.00,
    volume: 12000000,
    marketCap: 275000000000,
    peRatio: 42.3,
    previousClose: 584.20,
    sector: 'Technology'
  },
  {
    symbol: 'CRM',
    company: 'Salesforce Inc.',
    action: 'HOLD',
    price: 215.60,
    change: 0.8,
    reason: 'Steady enterprise adoption, watching integration costs',
    confidence: 72,
    targetPrice: 240.00,
    volume: 14000000,
    marketCap: 210000000000,
    peRatio: 35.6,
    previousClose: 213.90,
    sector: 'Technology'
  },
  // Financial Services
  {
    symbol: 'BRK-B',
    company: 'Berkshire Hathaway Inc.',
    action: 'BUY',
    price: 365.20,
    change: 0.5,
    reason: 'Warren Buffett\'s value investing continues to deliver',
    confidence: 87,
    targetPrice: 400.00,
    volume: 8000000,
    marketCap: 785000000000,
    peRatio: 24.8,
    previousClose: 363.40,
    sector: 'Financial Services'
  },
  {
    symbol: 'JPM',
    company: 'JPMorgan Chase & Co.',
    action: 'BUY',
    price: 152.30,
    change: 1.2,
    reason: 'Strong banking fundamentals and interest rate environment',
    confidence: 79,
    targetPrice: 170.00,
    volume: 25000000,
    marketCap: 445000000000,
    peRatio: 11.2,
    previousClose: 150.50,
    sector: 'Financial Services'
  },
  {
    symbol: 'V',
    company: 'Visa Inc.',
    action: 'BUY',
    price: 258.40,
    change: 1.6,
    reason: 'Digital payment growth and international expansion',
    confidence: 85,
    targetPrice: 285.00,
    volume: 16000000,
    marketCap: 535000000000,
    peRatio: 29.7,
    previousClose: 254.30,
    sector: 'Financial Services'
  },
  {
    symbol: 'MA',
    company: 'Mastercard Inc.',
    action: 'BUY',
    price: 412.60,
    change: 1.4,
    reason: 'Cross-border payment recovery and fintech partnerships',
    confidence: 84,
    targetPrice: 450.00,
    volume: 12000000,
    marketCap: 395000000000,
    peRatio: 31.5,
    previousClose: 406.90,
    sector: 'Financial Services'
  },
  {
    symbol: 'BAC',
    company: 'Bank of America Corp.',
    action: 'HOLD',
    price: 33.80,
    change: 0.3,
    reason: 'Stable earnings but watching credit quality',
    confidence: 70,
    targetPrice: 38.00,
    volume: 42000000,
    marketCap: 275000000000,
    peRatio: 9.8,
    previousClose: 33.70,
    sector: 'Financial Services'
  },
  // Healthcare
  {
    symbol: 'UNH',
    company: 'UnitedHealth Group Inc.',
    action: 'BUY',
    price: 524.70,
    change: 0.9,
    reason: 'Healthcare services expansion and Optum growth',
    confidence: 81,
    targetPrice: 575.00,
    volume: 9000000,
    marketCap: 485000000000,
    peRatio: 22.4,
    previousClose: 520.00,
    sector: 'Healthcare'
  },
  {
    symbol: 'JNJ',
    company: 'Johnson & Johnson',
    action: 'HOLD',
    price: 158.90,
    change: 0.2,
    reason: 'Dividend aristocrat with stable pharma pipeline',
    confidence: 73,
    targetPrice: 170.00,
    volume: 15000000,
    marketCap: 385000000000,
    peRatio: 19.8,
    previousClose: 158.60,
    sector: 'Healthcare'
  },
  {
    symbol: 'PFE',
    company: 'Pfizer Inc.',
    action: 'SELL',
    price: 28.45,
    change: -1.8,
    reason: 'Post-COVID revenue normalization concerns',
    confidence: 72,
    targetPrice: 25.00,
    volume: 38000000,
    marketCap: 160000000000,
    peRatio: 15.3,
    previousClose: 28.97,
    sector: 'Healthcare'
  },
  {
    symbol: 'ABBV',
    company: 'AbbVie Inc.',
    action: 'BUY',
    price: 168.30,
    change: 1.1,
    reason: 'Immunology portfolio strength and dividend yield',
    confidence: 78,
    targetPrice: 185.00,
    volume: 11000000,
    marketCap: 295000000000,
    peRatio: 17.6,
    previousClose: 166.50,
    sector: 'Healthcare'
  },
  {
    symbol: 'MRK',
    company: 'Merck & Co Inc.',
    action: 'BUY',
    price: 112.40,
    change: 0.8,
    reason: 'Keytruda dominance and oncology pipeline',
    confidence: 80,
    targetPrice: 125.00,
    volume: 13000000,
    marketCap: 285000000000,
    peRatio: 18.9,
    previousClose: 111.50,
    sector: 'Healthcare'
  },
  // Consumer & Retail
  {
    symbol: 'WMT',
    company: 'Walmart Inc.',
    action: 'BUY',
    price: 165.20,
    change: 1.3,
    reason: 'E-commerce growth and market share gains',
    confidence: 82,
    targetPrice: 180.00,
    volume: 18000000,
    marketCap: 445000000000,
    peRatio: 26.7,
    previousClose: 163.10,
    sector: 'Consumer Staples'
  },
  {
    symbol: 'PG',
    company: 'Procter & Gamble Co.',
    action: 'HOLD',
    price: 152.80,
    change: 0.4,
    reason: 'Defensive play with consistent dividends',
    confidence: 71,
    targetPrice: 165.00,
    volume: 10000000,
    marketCap: 365000000000,
    peRatio: 24.2,
    previousClose: 152.20,
    sector: 'Consumer Staples'
  },
  {
    symbol: 'KO',
    company: 'Coca-Cola Co.',
    action: 'HOLD',
    price: 59.75,
    change: 0.1,
    reason: 'Stable dividend but limited growth prospects',
    confidence: 68,
    targetPrice: 64.00,
    volume: 22000000,
    marketCap: 260000000000,
    peRatio: 23.5,
    previousClose: 59.69,
    sector: 'Consumer Staples'
  },
  {
    symbol: 'PEP',
    company: 'PepsiCo Inc.',
    action: 'HOLD',
    price: 172.40,
    change: 0.3,
    reason: 'Diversified portfolio balancing beverage challenges',
    confidence: 70,
    targetPrice: 185.00,
    volume: 12000000,
    marketCap: 240000000000,
    peRatio: 25.8,
    previousClose: 171.90,
    sector: 'Consumer Staples'
  },
  {
    symbol: 'COST',
    company: 'Costco Wholesale Corp.',
    action: 'BUY',
    price: 582.30,
    change: 1.7,
    reason: 'Membership model strength and inflation resilience',
    confidence: 86,
    targetPrice: 630.00,
    volume: 8000000,
    marketCap: 260000000000,
    peRatio: 38.4,
    previousClose: 572.60,
    sector: 'Consumer Staples'
  },
  // Technology & Semiconductors
  {
    symbol: 'INTC',
    company: 'Intel Corp.',
    action: 'SELL',
    price: 42.15,
    change: -2.1,
    reason: 'Market share loss to AMD and manufacturing delays',
    confidence: 78,
    targetPrice: 35.00,
    volume: 48000000,
    marketCap: 175000000000,
    peRatio: 18.2,
    previousClose: 43.05,
    sector: 'Technology'
  },
  {
    symbol: 'AMD',
    company: 'Advanced Micro Devices Inc.',
    action: 'BUY',
    price: 138.50,
    change: 2.8,
    reason: 'Data center share gains and AI chip momentum',
    confidence: 88,
    targetPrice: 165.00,
    volume: 32000000,
    marketCap: 225000000000,
    peRatio: 45.3,
    previousClose: 134.70,
    sector: 'Technology'
  },
  {
    symbol: 'ORCL',
    company: 'Oracle Corp.',
    action: 'HOLD',
    price: 105.20,
    change: 0.6,
    reason: 'Cloud transition ongoing, database dominance intact',
    confidence: 72,
    targetPrice: 115.00,
    volume: 14000000,
    marketCap: 290000000000,
    peRatio: 28.7,
    previousClose: 104.60,
    sector: 'Technology'
  },
  {
    symbol: 'IBM',
    company: 'International Business Machines Corp.',
    action: 'HOLD',
    price: 142.80,
    change: -0.2,
    reason: 'Red Hat growth offsetting legacy business decline',
    confidence: 65,
    targetPrice: 155.00,
    volume: 9000000,
    marketCap: 130000000000,
    peRatio: 21.4,
    previousClose: 143.09,
    sector: 'Technology'
  },
  {
    symbol: 'CSCO',
    company: 'Cisco Systems Inc.',
    action: 'HOLD',
    price: 51.60,
    change: 0.5,
    reason: 'Networking transformation and cybersecurity growth',
    confidence: 69,
    targetPrice: 58.00,
    volume: 26000000,
    marketCap: 210000000000,
    peRatio: 16.8,
    previousClose: 51.34,
    sector: 'Technology'
  },
  // Communication & Media
  {
    symbol: 'DIS',
    company: 'Walt Disney Co.',
    action: 'BUY',
    price: 92.45,
    change: 1.5,
    reason: 'Streaming profitability and parks recovery',
    confidence: 77,
    targetPrice: 110.00,
    volume: 20000000,
    marketCap: 170000000000,
    peRatio: 32.1,
    previousClose: 91.08,
    sector: 'Communication Services'
  },
  {
    symbol: 'CMCSA',
    company: 'Comcast Corp.',
    action: 'HOLD',
    price: 42.30,
    change: -0.4,
    reason: 'Broadband competition but content assets valuable',
    confidence: 66,
    targetPrice: 48.00,
    volume: 24000000,
    marketCap: 175000000000,
    peRatio: 12.3,
    previousClose: 42.47,
    sector: 'Communication Services'
  },
  {
    symbol: 'VZ',
    company: 'Verizon Communications Inc.',
    action: 'HOLD',
    price: 38.90,
    change: 0.2,
    reason: '5G buildout costs offset by dividend yield',
    confidence: 64,
    targetPrice: 44.00,
    volume: 28000000,
    marketCap: 165000000000,
    peRatio: 8.9,
    previousClose: 38.82,
    sector: 'Communication Services'
  },
  {
    symbol: 'T',
    company: 'AT&T Inc.',
    action: 'SELL',
    price: 16.25,
    change: -0.8,
    reason: 'High debt levels and competitive pressures',
    confidence: 71,
    targetPrice: 14.00,
    volume: 45000000,
    marketCap: 115000000000,
    peRatio: 7.2,
    previousClose: 16.38,
    sector: 'Communication Services'
  },
  // Energy & Utilities
  {
    symbol: 'XOM',
    company: 'Exxon Mobil Corp.',
    action: 'BUY',
    price: 108.60,
    change: 1.9,
    reason: 'Energy prices support and capital discipline',
    confidence: 76,
    targetPrice: 120.00,
    volume: 30000000,
    marketCap: 435000000000,
    peRatio: 11.5,
    previousClose: 106.60,
    sector: 'Energy'
  },
  {
    symbol: 'CVX',
    company: 'Chevron Corp.',
    action: 'BUY',
    price: 152.30,
    change: 1.6,
    reason: 'Permian Basin production and shareholder returns',
    confidence: 75,
    targetPrice: 170.00,
    volume: 18000000,
    marketCap: 295000000000,
    peRatio: 13.2,
    previousClose: 149.90,
    sector: 'Energy'
  },
  // Industrial & Aerospace
  {
    symbol: 'BA',
    company: 'Boeing Co.',
    action: 'HOLD',
    price: 215.40,
    change: 0.7,
    reason: '737 MAX recovery but supply chain challenges',
    confidence: 67,
    targetPrice: 240.00,
    volume: 16000000,
    marketCap: 130000000000,
    peRatio: 28.9,
    previousClose: 213.90,
    sector: 'Industrials'
  },
  {
    symbol: 'CAT',
    company: 'Caterpillar Inc.',
    action: 'BUY',
    price: 282.50,
    change: 1.3,
    reason: 'Infrastructure spending and mining demand',
    confidence: 78,
    targetPrice: 315.00,
    volume: 10000000,
    marketCap: 150000000000,
    peRatio: 17.4,
    previousClose: 278.90,
    sector: 'Industrials'
  },
  {
    symbol: 'GE',
    company: 'General Electric Co.',
    action: 'BUY',
    price: 112.80,
    change: 2.2,
    reason: 'Aerospace recovery and renewable energy growth',
    confidence: 80,
    targetPrice: 130.00,
    volume: 14000000,
    marketCap: 125000000000,
    peRatio: 24.6,
    previousClose: 110.40,
    sector: 'Industrials'
  },
  // ETF
  {
    symbol: 'SPY',
    company: 'SPDR S&P 500 ETF Trust',
    action: 'BUY',
    price: 452.30,
    change: 1.1,
    reason: 'Broad market exposure with low fees',
    confidence: 85,
    targetPrice: 480.00,
    volume: 75000000,
    marketCap: 420000000000,
    peRatio: 22.5,
    previousClose: 447.40,
    sector: 'ETF'
  },
  // International & Growth
  {
    symbol: 'BABA',
    company: 'Alibaba Group Holding Ltd.',
    action: 'BUY',
    price: 85.50,
    change: 1.8,
    reason: 'China market recovery and cloud services growth',
    confidence: 72,
    targetPrice: 110.00,
    volume: 28000000,
    marketCap: 220000000000,
    peRatio: 12.5,
    previousClose: 84.00,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'TSM',
    company: 'Taiwan Semiconductor Manufacturing Co.',
    action: 'BUY',
    price: 98.70,
    change: 2.4,
    reason: 'Leading chip foundry with AI demand tailwinds',
    confidence: 89,
    targetPrice: 115.00,
    volume: 22000000,
    marketCap: 510000000000,
    peRatio: 19.8,
    previousClose: 96.40,
    sector: 'Technology'
  },
  // Biotechnology
  {
    symbol: 'GILD',
    company: 'Gilead Sciences Inc.',
    action: 'HOLD',
    price: 82.30,
    change: 0.5,
    reason: 'HIV franchise stable, oncology pipeline developing',
    confidence: 69,
    targetPrice: 90.00,
    volume: 11000000,
    marketCap: 105000000000,
    peRatio: 14.7,
    previousClose: 81.89,
    sector: 'Healthcare'
  },
  {
    symbol: 'AMGN',
    company: 'Amgen Inc.',
    action: 'BUY',
    price: 268.90,
    change: 0.9,
    reason: 'Biosimilar defense and obesity drug potential',
    confidence: 74,
    targetPrice: 295.00,
    volume: 8000000,
    marketCap: 145000000000,
    peRatio: 16.3,
    previousClose: 266.50,
    sector: 'Healthcare'
  },
  // Financial Technology
  {
    symbol: 'PYPL',
    company: 'PayPal Holdings Inc.',
    action: 'HOLD',
    price: 62.40,
    change: -0.6,
    reason: 'Competition pressures but Venmo growth continues',
    confidence: 66,
    targetPrice: 72.00,
    volume: 20000000,
    marketCap: 70000000000,
    peRatio: 18.5,
    previousClose: 62.78,
    sector: 'Financial Services'
  },
  {
    symbol: 'SQ',
    company: 'Block Inc.',
    action: 'HOLD',
    price: 68.20,
    change: 0.8,
    reason: 'Cash App growth offset by merchant competition',
    confidence: 68,
    targetPrice: 80.00,
    volume: 15000000,
    marketCap: 42000000000,
    peRatio: 35.2,
    previousClose: 67.66,
    sector: 'Financial Services'
  },
  // Electric Vehicles & Clean Energy
  {
    symbol: 'NIO',
    company: 'NIO Inc.',
    action: 'SELL',
    price: 7.85,
    change: -3.2,
    reason: 'Cash burn concerns and intense EV competition',
    confidence: 73,
    targetPrice: 6.00,
    volume: 55000000,
    marketCap: 13000000000,
    peRatio: null,
    previousClose: 8.11,
    sector: 'Consumer Discretionary'
  },
  {
    symbol: 'RIVN',
    company: 'Rivian Automotive Inc.',
    action: 'SELL',
    price: 15.30,
    change: -2.8,
    reason: 'Production challenges and high cash burn rate',
    confidence: 76,
    targetPrice: 12.00,
    volume: 42000000,
    marketCap: 14500000000,
    peRatio: null,
    previousClose: 15.74,
    sector: 'Consumer Discretionary'
  },
  // Cloud & Software
  {
    symbol: 'SNOW',
    company: 'Snowflake Inc.',
    action: 'HOLD',
    price: 158.40,
    change: 1.2,
    reason: 'Data cloud leadership but valuation concerns',
    confidence: 70,
    targetPrice: 175.00,
    volume: 12000000,
    marketCap: 52000000000,
    peRatio: null,
    previousClose: 156.52,
    sector: 'Technology'
  },
  {
    symbol: 'PLTR',
    company: 'Palantir Technologies Inc.',
    action: 'BUY',
    price: 18.75,
    change: 3.5,
    reason: 'AI platform adoption and government contracts',
    confidence: 79,
    targetPrice: 25.00,
    volume: 48000000,
    marketCap: 40000000000,
    peRatio: 85.3,
    previousClose: 18.12,
    sector: 'Technology'
  }
];

// Trading analysis logic (simplified for demo)
function analyzeStock(symbol, price, change) {
  let action = 'HOLD';
  let confidence = 50;
  let reason = 'Market analysis pending';

  if (change > 2) {
    action = 'BUY';
    confidence = 80;
    reason = 'Strong upward momentum';
  } else if (change < -2) {
    action = 'SELL';
    confidence = 75;
    reason = 'Bearish trend detected';
  } else if (change > 0) {
    action = 'BUY';
    confidence = 65;
    reason = 'Positive price movement';
  }

  return { action, confidence, reason };
}

// Update market data with random fluctuations (simulating real market)
function updateMarketData() {
  const lastData = marketData[marketData.length - 1];
  const newValue = lastData.value * (1 + (Math.random() - 0.5) * 0.04); // ±2% random change
  const change = ((newValue - lastData.value) / lastData.value) * 100;
  
  const newData = {
    date: new Date().toISOString().split('T')[0],
    value: Math.round(newValue * 100) / 100,
    change: Math.round(change * 100) / 100,
    volume: Math.floor(Math.random() * 1000000) + 500000
  };

  // Keep only last 30 days of data
  if (marketData.length >= 30) {
    marketData.shift();
  }
  marketData.push(newData);

  console.log('Market data updated:', newData);
}

// Update stock recommendations
function updateRecommendations() {
  stockRecommendations = stockRecommendations.map(stock => {
    // Simulate price changes
    const priceChange = (Math.random() - 0.5) * 10; // ±5% change
    const newPrice = stock.price * (1 + priceChange / 100);
    const analysis = analyzeStock(stock.symbol, newPrice, priceChange);
    
    return {
      ...stock,
      price: Math.round(newPrice * 100) / 100,
      change: Math.round(priceChange * 100) / 100,
      action: analysis.action,
      confidence: analysis.confidence,
      reason: analysis.reason
    };
  });

  console.log('Stock recommendations updated');
}

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/stocks', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM stocks
      ORDER BY market_cap DESC
    `);
    client.release();

    // If database has no data, use mock list
    if (result.rows.length === 0) {
      console.log('⚠️ No stocks found in DB — using mock data');
      return res.json({
        success: true,
        data: stockRecommendations,
        count: stockRecommendations.length
      });
    }

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching stocks from database:', error);
    res.json({
      success: true,
      data: stockRecommendations,
      lastUpdated: new Date().toISOString(),
      total: stockRecommendations.length
    });
  }
});



// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  try {
    const totalStocks = stockRecommendations.length;
    const buyRecommendations = stockRecommendations.filter(s => s.action === 'BUY').length;
    const sellRecommendations = stockRecommendations.filter(s => s.action === 'SELL').length;
    const holdRecommendations = stockRecommendations.filter(s => s.action === 'HOLD').length;
    
    const averageConfidence = stockRecommendations.reduce((sum, stock) => sum + stock.confidence, 0) / totalStocks;
    
    res.json({
      success: true,
      data: {
        totalStocks,
        recommendations: {
          buy: buyRecommendations,
          sell: sellRecommendations,
          hold: holdRecommendations
        },
        averageConfidence: Math.round(averageConfidence * 100) / 100,
        marketTrend: marketData[marketData.length - 1]?.change > 0 ? 'bullish' : 'bearish'
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// ✅ Added for API Gateway integration
app.get('/trades', async (req, res) => {
  try {
    console.log('✅ /trades route is active');
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM trades
      ORDER BY trade_date DESC
    `);
    client.release();
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching trades from database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trades',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Schedule market data updates (every 5 minutes during market hours)
cron.schedule('*/5 * * * *', () => {
  updateMarketData();
  updateRecommendations();
});

// Initial data update
updateMarketData();
updateRecommendations();



// Test database connection
async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');

    const result = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
    console.log('📋 Available databases:', result.rows);

    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);

    if (error.message.includes('password authentication failed')) {
      console.log('💡 Try: Check your password in .env file');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('💡 Try: Different database name (postgres, tradingedge, etc.)');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Try: Check VPC security groups allow port 5432');
    }
  }
}


testDatabaseConnection();
export default app;