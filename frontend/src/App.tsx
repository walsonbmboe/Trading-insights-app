import { useEffect, useState } from "react";
import "./index.css"; // Make sure Tailwind styles are loaded

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
      .then((res) => res.json())
      .then((data) => {
        setStocks(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => console.error(err))
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
      <h1 className="text-4xl font-bold text-center mb-2 text-trading-green">
        AI Trading Assistant
      </h1>
      <p className="text-gray-400 mb-10">
        Smarter Insights • Real-Time Decisions
      </p>

      {/* Table Container */}
      <div className="w-full max-w-6xl overflow-x-auto rounded-2xl shadow-xl bg-gray-900 border border-gray-800">
        <table className="min-w-full text-sm md:text-base text-gray-200">
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
                <td className="p-4 border border-gray-700">{stock.ticker}</td>
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
                <td className="p-4 border border-gray-700">
                  ${stock.price.toFixed(2)}
                </td>
                <td
                  className={`p-4 ${
                    stock.change >= 0 ? "text-trading-green" : "text-trading-red"
                  }`}
                >
                  {stock.change >= 0 ? "▲" : "▼"} {Math.abs(stock.change)}%
                </td>
                <td className="p-4 border border-gray-700">{stock.confidence}%</td>
                <td className="p-4 border border-gray-700">{stock.sector}</td>
                <td className="p-4 border border-gray-700">{stock.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
