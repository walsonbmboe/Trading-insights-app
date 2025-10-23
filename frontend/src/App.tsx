import { useEffect, useState } from 'react';
import './App.css';

const BASE_URL = import.meta.env.VITE_API_URL;

interface Stock {
  symbol: string;
  company: string;
  action: string;
  price: number;
  change: number;
  confidence: number;
  reason: string;
  sector: string;
}

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/stocks`)
      .then(res => res.json())
      .then(data => {
        setStocks(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stocks:', err);
        setLoading(false);
      });
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-700 border-green-400';
      case 'SELL': return 'bg-red-100 text-red-700 border-red-400';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">📈 Trading Insights Dashboard</h1>
        <p className="text-gray-600 mt-2">AI-powered stock recommendations and market analysis</p>
      </header>

      {loading ? (
        <div className="text-center text-lg font-semibold">Loading market data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock, i) => (
            <div key={i} className={`border-2 rounded-2xl shadow-lg p-6 transition hover:shadow-2xl hover:scale-105 bg-white`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{stock.company}</h2>
                <span className={`px-3 py-1 rounded-full border ${getActionColor(stock.action)} font-bold`}>
                  {stock.action}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">Ticker: {stock.symbol}</p>
              <p className="text-lg font-bold mb-2">${stock.price.toFixed(2)}</p>
              <p className={`mb-2 ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change > 0 ? '▲' : '▼'} {stock.change}%
              </p>
              <p className="text-sm text-gray-700 mb-4">{stock.reason}</p>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${stock.confidence}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-gray-600">
                Confidence: <strong>{stock.confidence}%</strong>
              </p>
              <p className="text-xs text-gray-400 mt-1">Sector: {stock.sector}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
