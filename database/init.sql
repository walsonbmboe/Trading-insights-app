-- Create database schema for trading application (Updated for Alpha Vantage)
CREATE SCHEMA IF NOT EXISTS trading;

-- Create stocks table (for caching Alpha Vantage data)
CREATE TABLE IF NOT EXISTS trading.stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    company_name VARCHAR(255),
    price DECIMAL(10,2),
    change_amount DECIMAL(10,2),
    change_percent DECIMAL(5,2),
    volume BIGINT,
    market_cap BIGINT,
    rsi DECIMAL(5,2),
    sma_50 DECIMAL(10,2),
    sma_200 DECIMAL(10,2),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create recommendations table (dynamic recommendations)
CREATE TABLE IF NOT EXISTS trading.recommendations (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('BUY', 'SELL', 'HOLD')),
    reason TEXT NOT NULL,
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    target_price DECIMAL(10,2),
    risk_level VARCHAR(10) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    FOREIGN KEY (symbol) REFERENCES trading.stocks(symbol)
);

-- Top stocks list (curated list of 50 popular stocks)
CREATE TABLE IF NOT EXISTS trading.top_stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    rank INTEGER NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- App settings (global preferences for the public app)
CREATE TABLE IF NOT EXISTS trading.app_settings (
    id SERIAL PRIMARY KEY,
    setting_name VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert top 50 stocks (popular and liquid stocks)
INSERT INTO trading.top_stocks (symbol, rank, company_name, sector) VALUES
-- Technology Giants
('AAPL', 1, 'Apple Inc.', 'Technology'),
('MSFT', 2, 'Microsoft Corp.', 'Technology'),
('GOOGL', 3, 'Alphabet Inc.', 'Technology'),
('AMZN', 4, 'Amazon.com Inc.', 'Consumer Discretionary'),
('TSLA', 5, 'Tesla Inc.', 'Consumer Discretionary'),
('NVDA', 6, 'NVIDIA Corp.', 'Technology'),
('META', 7, 'Meta Platforms Inc.', 'Technology'),
('NFLX', 8, 'Netflix Inc.', 'Communication Services'),
('ADBE', 9, 'Adobe Inc.', 'Technology'),
('CRM', 10, 'Salesforce Inc.', 'Technology'),

-- Financial Services
('BRK-B', 11, 'Berkshire Hathaway Inc.', 'Financial Services'),
('JPM', 12, 'JPMorgan Chase & Co.', 'Financial Services'),
('V', 13, 'Visa Inc.', 'Financial Services'),
('MA', 14, 'Mastercard Inc.', 'Financial Services'),
('BAC', 15, 'Bank of America Corp.', 'Financial Services'),

-- Healthcare
('UNH', 16, 'UnitedHealth Group Inc.', 'Healthcare'),
('JNJ', 17, 'Johnson & Johnson', 'Healthcare'),
('PFE', 18, 'Pfizer Inc.', 'Healthcare'),
('ABBV', 19, 'AbbVie Inc.', 'Healthcare'),
('MRK', 20, 'Merck & Co Inc.', 'Healthcare'),

-- Consumer & Retail
('WMT', 21, 'Walmart Inc.', 'Consumer Staples'),
('PG', 22, 'Procter & Gamble Co.', 'Consumer Staples'),
('KO', 23, 'Coca-Cola Co.', 'Consumer Staples'),
('PEP', 24, 'PepsiCo Inc.', 'Consumer Staples'),
('COST', 25, 'Costco Wholesale Corp.', 'Consumer Staples'),

-- Technology & Semiconductors
('INTC', 26, 'Intel Corp.', 'Technology'),
('AMD', 27, 'Advanced Micro Devices Inc.', 'Technology'),
('ORCL', 28, 'Oracle Corp.', 'Technology'),
('IBM', 29, 'International Business Machines Corp.', 'Technology'),
('CSCO', 30, 'Cisco Systems Inc.', 'Technology'),

-- Communication & Media
('DIS', 31, 'Walt Disney Co.', 'Communication Services'),
('CMCSA', 32, 'Comcast Corp.', 'Communication Services'),
('VZ', 33, 'Verizon Communications Inc.', 'Communication Services'),
('T', 34, 'AT&T Inc.', 'Communication Services'),

-- Energy & Utilities
('XOM', 35, 'Exxon Mobil Corp.', 'Energy'),
('CVX', 36, 'Chevron Corp.', 'Energy'),

-- Industrial & Aerospace
('BA', 37, 'Boeing Co.', 'Industrials'),
('CAT', 38, 'Caterpillar Inc.', 'Industrials'),
('GE', 39, 'General Electric Co.', 'Industrials'),

-- Real Estate & REITs
('SPY', 40, 'SPDR S&P 500 ETF Trust', 'ETF'),

-- International & Growth
('BABA', 41, 'Alibaba Group Holding Ltd.', 'Consumer Discretionary'),
('TSM', 42, 'Taiwan Semiconductor Manufacturing Co.', 'Technology'),

-- Biotechnology
('GILD', 43, 'Gilead Sciences Inc.', 'Healthcare'),
('AMGN', 44, 'Amgen Inc.', 'Healthcare'),

-- Financial Technology
('PYPL', 45, 'PayPal Holdings Inc.', 'Financial Services'),
('SQ', 46, 'Block Inc.', 'Financial Services'),

-- Electric Vehicles & Clean Energy
('NIO', 47, 'NIO Inc.', 'Consumer Discretionary'),
('RIVN', 48, 'Rivian Automotive Inc.', 'Consumer Discretionary'),

-- Cloud & Software
('SNOW', 49, 'Snowflake Inc.', 'Technology'),
('PLTR', 50, 'Palantir Technologies Inc.', 'Technology')

ON CONFLICT (symbol) DO NOTHING;

-- Insert default app settings
INSERT INTO trading.app_settings (setting_name, setting_value, description) VALUES
('rsi_buy_threshold', '30', 'RSI level below which stocks are considered oversold (buy signal)'),
('rsi_sell_threshold', '70', 'RSI level above which stocks are considered overbought (sell signal)'),
('confidence_threshold', '75', 'Minimum confidence level for strong recommendations'),
('trading_style', 'growth', 'Default trading style: value, growth, momentum, dividend'),
('risk_tolerance', 'moderate', 'Default risk tolerance: conservative, moderate, aggressive'),
('update_interval', '60', 'Minutes between data updates from Alpha Vantage'),
('max_daily_api_calls', '25', 'Maximum Alpha Vantage API calls per day (free tier limit)')
ON CONFLICT (setting_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON trading.stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_last_updated ON trading.stocks(last_updated);
CREATE INDEX IF NOT EXISTS idx_recommendations_symbol ON trading.recommendations(symbol);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON trading.recommendations(created_at);
CREATE INDEX IF NOT EXISTS idx_top_stocks_rank ON trading.top_stocks(rank);
CREATE INDEX IF NOT EXISTS idx_top_stocks_sector ON trading.top_stocks(sector);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for stocks table
DROP TRIGGER IF EXISTS update_stocks_updated_at ON trading.stocks;
CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON trading.stocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for app_settings table
DROP TRIGGER IF EXISTS update_settings_updated_at ON trading.app_settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON trading.app_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();