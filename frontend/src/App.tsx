import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

interface Stock {
  symbol: string;
  company: string;
  action: string;
  price: number;
  change: number;
  reason: string;
  confidence: number;
  sector: string;
}

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/stocks`).then((res) => res.json()),
      fetch(`${BASE_URL}/api/analytics`).then((res) => res.json()),
    ])
      .then(([stocksData, analyticsData]) => {
        setStocks(stocksData.data || []);
        setAnalytics(analyticsData.data || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg text-white">
        <p className="text-lg">Loading market insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 font-sans p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-trading-green">
          AI Trading Assistant
        </h1>
        <span className="text-sm text-gray-400">
          Smarter Insights • Real-Time Decisions
        </span>
      </header>

      {/* Analytics Summary */}
      {analytics && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400">Total Stocks</h3>
            <p className="text-2xl font-bold">{analytics.totalStocks}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400">Buy Signals</h3>
            <p className="text-2xl font-bold text-trading-green">
              {analytics.recommendations.buy}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400">Sell Signals</h3>
            <p className="text-2xl font-bold text-trading-red">
              {analytics.recommendations.sell}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-400">Market Trend</h3>
            <p
              className={`text-2xl font-bold ${
                analytics.marketTrend === "bullish"
                  ? "text-trading-green"
                  : "text-trading-red"
              }`}
            >
              {analytics.marketTrend.toUpperCase()}
            </p>
          </div>
        </section>
      )}

      {/* Stock Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Stock Recommendations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-700">
            <thead className="bg-gray-800">
              <tr className="text-left text-gray-400 uppercase text-xs">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Ticker</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Price ($)</th>
                <th className="py-3 px-4">Change (%)</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Reason</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr
                  key={stock.symbol}
                  className="border-t border-gray-700 hover:bg-gray-700/40 transition"
                >
                  <td className="py-3 px-4 font-medium">{stock.company}</td>
                  <td className="py-3 px-4 text-gray-400">{stock.symbol}</td>
                  <td
                    className={`py-3 px-4 font-bold ${
                      stock.action === "BUY"
                        ? "text-trading-green"
                        : stock.action === "SELL"
                        ? "text-trading-red"
                        : "text-yellow-400"
                    }`}
                  >
                    {stock.action}
                  </td>
                  <td className="py-3 px-4">${stock.price}</td>
                  <td
                    className={`py-3 px-4 ${
                      stock.change > 0
                        ? "text-trading-green"
                        : "text-trading-red"
                    }`}
                  >
                    {stock.change > 0 ? "▲" : "▼"} {stock.change}%
                  </td>
                  <td className="py-3 px-4">{stock.confidence}%</td>
                  <td className="py-3 px-4 text-gray-400">{stock.sector}</td>
                  <td className="py-3 px-4 text-gray-300">{stock.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
