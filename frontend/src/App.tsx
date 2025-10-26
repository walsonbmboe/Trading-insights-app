// frontend/src/App.tsx
import { useEffect, useState } from "react";
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
}

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
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
    .map((s, i) => ({ name: s.ticker, price: s.price }));

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
    {/* Glossy + Techy Overlays */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05),_transparent_70%)] mix-blend-soft-light pointer-events-none" />
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(30,64,175,0.2)_0%,rgba(6,182,212,0.1)_100%)] opacity-70 pointer-events-none" />
    <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.02),_transparent_80%)] pointer-events-none" />
    <div className="absolute inset-0 bg-[url('/assets/tech-grid.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

    <div className="relative z-10 p-6">


        {/* Header */}
        <header className="max-w-6xl mx-auto text-center mb-10">
  <h1
    className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4
               text-center bg-clip-text
               bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500
               drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]
               animate-pulse text-white"
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
                      {summary.map((entry, idx) => (
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
                    <th className="p-3 text-left">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {stocks.map((s, i) => (
                    <tr
                      key={i}
                      className="even:bg-gray-900/50 odd:bg-transparent hover:bg-gray-800/60 transition-colors"
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
                      <td className="p-3 border border-gray-800 text-gray-300">{s.confidence}%</td>
                      <td className="p-3 border border-gray-800 text-gray-300">{s.sector}</td>
                      <td className="p-3 border border-gray-800 text-gray-300 italic">{s.reason}</td>
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
          </div> {/* closes inner content wrapper */}
  </div> );  {/* closes outermost container */}
}
