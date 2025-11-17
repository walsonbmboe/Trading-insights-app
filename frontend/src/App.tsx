// frontend/src/App.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import StockModal from "./components/StockModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./index.css";

type RawStock = Record<string, any>;

interface Stock {
  company: string;
  ticker: string;
  action: "BUY" | "SELL" | "HOLD";
  price: number;
  change: number;
  confidence: number;
  sector: string;
  reason: string;
  targetPrice?: number;
  marketCap?: number;
  peRatio?: number;
  previousClose?: number;
  trend?: number[]; // mini chart data
}

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/stocks`);
        const json = await res.json();
        const raw: RawStock[] = Array.isArray(json) ? json : json.data || [];

        const normalized: Stock[] = raw.map((s: RawStock, idx: number) => ({
          company: s.company || s.Company || s.name || `Stock ${idx + 1}`,
          ticker: s.ticker || s.Ticker || s.symbol || `STK${idx + 1}`,
          action:
            s.action?.toUpperCase() === "BUY"
              ? "BUY"
              : s.action?.toUpperCase() === "SELL"
              ? "SELL"
              : "HOLD",
          price: Number(s.price ?? s.Price ?? 0),
          change: Number(s.change ?? s.Change ?? 0),
          confidence: Number(s.confidence ?? s.Confidence ?? 0),
          sector: s.sector || s.Sector || "Unknown",
          reason: s.reason || s.Reason || "",
          targetPrice: Number(s.targetPrice ?? s.TargetPrice ?? 0),
          marketCap: Number(s.marketCap ?? s.MarketCap ?? 0),
          peRatio: Number(s.peRatio ?? s.PERatio ?? 0),
          previousClose: Number(s.previousClose ?? s.PreviousClose ?? 0),
          trend: s.trend || Array.from({ length: 7 }, () => s.price + Math.random() * 10 - 5),
        }));

        setStocks(normalized);
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase]);

  const lineData = stocks
    .filter((s) => !Number.isNaN(s.price) && s.price > 0)
    .map((s) => ({ name: s.ticker, price: s.price }));

  const summary = [
    { name: "BUY", value: stocks.filter((s) => s.action === "BUY").length },
    { name: "HOLD", value: stocks.filter((s) => s.action === "HOLD").length },
    { name: "SELL", value: stocks.filter((s) => s.action === "SELL").length },
  ];
  const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const actionColors: Record<string, string> = {
    BUY: "bg-green-500/20 text-green-300 border border-green-400",
    SELL: "bg-red-500/20 text-red-300 border border-red-400",
    HOLD: "bg-yellow-500/20 text-yellow-300 border border-yellow-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-950 to-gray-900 text-gray-400">
        Loading market data…
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-white font-sans bg-gradient-to-b from-black via-black to-gray-900">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05),_transparent_70%)] mix-blend-soft-light pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(30,64,175,0.2)_0%,rgba(6,182,212,0.1)_100%)] opacity-70 pointer-events-none" />
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.02),_transparent_80%)] pointer-events-none" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <header className="max-w-6xl mx-auto text-center mb-10">
          <h1
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4
              bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse"
          >
            ⚡ AI Trading Assistant ⚡
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Smarter Insights • Real-Time Decisions
          </p>
        </header>

        {/* Charts */}
        <main className="max-w-6xl mx-auto space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 shadow-xl">
              <h2 className="text-lg font-semibold text-cyan-300 mb-2">
                Market Sentiment
              </h2>
              <div className="w-full min-h-[260px]">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={summary}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {summary.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0b1220",
                        border: "1px solid #2b2b2b",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-4 shadow-xl">
              <h2 className="text-lg font-semibold text-cyan-300 mb-2">
                Price Movement Overview
              </h2>
              {lineData.length === 0 ? (
                <div className="text-gray-400 p-6">
                  No valid price data available.
                </div>
              ) : (
                <div className="w-full min-h-[280px]">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={lineData}>
                      <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0b1220",
                          border: "1px solid #2b2b2b",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>

          {/* Table */}
          <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm md:text-base table-auto">
                <thead className="text-gray-300 text-xs uppercase tracking-wide bg-gray-800">
                  <tr>
                    <th className="p-3 text-left">Company</th>
                    <th className="p-3 text-left">Ticker</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Change</th>
                    <th className="p-3 text-left">Confidence</th>
                    <th className="p-3 text-left">Sector</th>
                  </tr>
                </thead>

                <tbody>
                  {stocks.map((s, i) => (
                    <tr
                    key={i}
                    className="even:bg-gray-900/50 odd:bg-transparent hover:bg-gray-800/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedStock(s)}
                      > 
                      <td className="p-3 border border-gray-800 font-medium">{s.company}</td>
                      <td className="p-3 border border-gray-800 text-gray-300">{s.ticker}</td>
                      <td className="p-3 border border-gray-800">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold shadow-md ${actionColors[s.action]}`}
                        >
                          {s.action}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-800">${s.price.toFixed(2)}</td>
                      <td
                        className={`p-3 border border-gray-800 font-semibold ${
                          s.change >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {s.change >= 0 ? "▲ " : "▼ "}
                        {Math.abs(s.change).toFixed(2)}%
                      </td>
                      <td className="p-3 border border-gray-800 text-gray-300">
                        {s.confidence}%
                      </td>
                      <td className="p-3 border border-gray-800 text-gray-300">{s.sector}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="text-xs text-gray-500 text-center mt-10">
          © {new Date().getFullYear()} Trading Insights
        </footer>
      </div>

      {/* MODAL POPUP */}
      <AnimatePresence>
  {isModalOpen && selectedStock && (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-950 border border-cyan-800/30 ring-1 ring-cyan-400/20 rounded-2xl p-6 w-[90%] max-w-lg relative shadow-[0_0_30px_rgba(34,211,238,0.3)]"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      >
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white hover:rotate-90 transition-transform duration-300"
      >
        ✕
      </button>

      {/* Modal Header */}
      <h2 className="text-2xl font-bold mb-4 text-cyan-400 text-center">
        {selectedStock.company} ({selectedStock.ticker})
      </h2>

      {/* Stock Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <p>
          <span className="text-gray-400">Target Price:</span>{" "}
          ${selectedStock.targetPrice?.toFixed(2) || "—"}
        </p>
        <p>
          <span className="text-gray-400">Market Cap:</span>{" "}
          ${selectedStock.marketCap?.toLocaleString() || "—"}
        </p>
        <p>
          <span className="text-gray-400">P/E Ratio:</span>{" "}
          {selectedStock.peRatio || "—"}
        </p>
        <p>
          <span className="text-gray-400">Previous Close:</span>{" "}
          ${selectedStock.previousClose?.toFixed(2) || "—"}
        </p>
      </div>

      {/* Mini Trend Chart */}
{selectedStock.trend?.length ? (
  <div className="w-full flex justify-center">
    <div className="w-[320px] h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={selectedStock.trend.map((p, i) => ({
            name: `Day ${i + 1}`,
            price: p,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b1220",
              border: "1px solid #2b2b2b",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
) : (
  <p className="text-sm text-gray-400 text-center mt-4">
    <span className="text-gray-400">Trend Data:</span> — No chart data available
  </p>
)}

    </motion.div>
    </motion.div>
  )}
</AnimatePresence>
{selectedStock && (
  <StockModal
    stock={selectedStock}
    onClose={() => setSelectedStock(null)}
  />
)}
</div> )}