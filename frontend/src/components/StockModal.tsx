// src/components/StockModal.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type StockModalProps = {
  stock: {
    ticker: string;
    companyName: string;
    price: number;
    change: number;
    targetPrice?: number;
    marketCap?: string;
    peRatio?: number;
    previousClose?: number;
  };
  onClose: () => void;
};

const StockModal: React.FC<StockModalProps> = ({ stock, onClose }) => {
  // Sample historical data for the mini chart
  const sampleData = [
    { date: "Mon", price: stock.price - 2 },
    { date: "Tue", price: stock.price - 1 },
    { date: "Wed", price: stock.price },
    { date: "Thu", price: stock.price + 1 },
    { date: "Fri", price: stock.price + 0.5 },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 relative border border-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-red-400 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-1">{stock.companyName}</h2>
        <p className="text-gray-400 mb-4">{stock.ticker}</p>

        {/* Price and Change */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-semibold">£{stock.price.toFixed(2)}</span>
          <span
            className={`text-sm px-2 py-1 rounded ${
              stock.change > 0
                ? "bg-green-500/20 text-green-400"
                : stock.change < 0
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {stock.change > 0 ? "+" : ""}
            {stock.change}%
          </span>
        </div>

        {/* Extra Details */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-gray-400">Target Price</p>
            <p className="font-semibold">
              £{stock.targetPrice?.toFixed(2) ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Market Cap</p>
            <p className="font-semibold">{stock.marketCap ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-400">P/E Ratio</p>
            <p className="font-semibold">{stock.peRatio ?? "—"}</p>
          </div>
          <div>
            <p className="text-gray-400">Prev Close</p>
            <p className="font-semibold">
              £{stock.previousClose?.toFixed(2) ?? "—"}
            </p>
          </div>
        </div>

        {/* Mini Trend Chart */}
        <div className="h-40 bg-gray-800 rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={stock.change >= 0 ? "#10B981" : "#EF4444"}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StockModal;
