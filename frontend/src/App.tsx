import { useEffect, useState } from "react";
import "./App.css";

interface Stock {
  company: string;
  ticker: string;
  action: string;
  price: number;
  change: number;
  confidence: number;
  sector: string;
  reason: string;
}

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/stocks`)
    .then(res => res.json())
    .then(data => {
      // Check if backend wraps data inside "data"
      setStocks(Array.isArray(data) ? data : data.data || []);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
}, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading stock data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-2">AI Trading Assistant</h1>
      <p className="text-gray-400 mb-8">Smarter Insights • Real-Time Decisions</p>

      {/* Stock Table */}
      <div className="w-full max-w-6xl bg-gray-900 shadow-lg rounded-2xl overflow-hidden">
        <table className="min-w-full border border-gray-700 text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Ticker</th>
              <th className="p-4 text-left">Action</th>
              <th className="p-4 text-left">Price ($)</th>
              <th className="p-4 text-left">Change (%)</th>
              <th className="p-4 text-left">Confidence</th>
              <th className="p-4 text-left">Sector</th>
              <th className="p-4 text-left">Reason</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={index}
                className="border-t border-gray-800 hover:bg-gray-800 transition-all duration-200"
              >
                <td className="p-4 border border-gray-700 font-semibold">{stock.company}</td>
                <td className="p-4 border border-gray-700 font-semibold">{stock.ticker}</td>
                <td
                  className={`p-4 font-bold ${
                    stock.action === "BUY"
                      ? "text-green-400"
                      : stock.action === "SELL"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {stock.action}
                </td>
                <td className="p-4 border border-gray-700 font-semibold">${stock.price.toFixed(2)}</td>
                <td
                  className={`p-4 ${
                    stock.change >= 0 ? "text-trading-green" : "text-trading-red"
                  }`}
                >
                  {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change)}%
                </td>
                <td className="p-4 border border-gray-700 font-semibold">{stock.confidence}%</td>
                <td className="p-4 border border-gray-700 font-semibold">{stock.sector}</td>
                <td className="p-4 border border-gray-700 font-semibold">{stock.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
