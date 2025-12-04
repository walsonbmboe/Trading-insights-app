// frontend/src/pages/Sentiments.tsx
console.log("API BASE →", import.meta.env.VITE_API_URL);
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import StockHoverTooltip from "../components/StockHoverTooltip";
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
import "../index.css";
import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";
import { createlexClient } from "../aws-lex-config";
import ChatLauncher from "../components/ChatLauncher";

type RawStock = Record<string, any>;

interface Stock {
  companyName?: string;
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
  trend?: number[];
  ceo?: string;
  dividendYield?: number;
  nextEarnings?: string;
  debtStatus?: "Net Cash" | "Moderate Debt" | "High Debt";
  outlook?: "Positive" | "Neutral" | "Negative";
  aiInsight?: string;
}

export default function Sentiments() {
  return <SentimentsPage />;
}

function SentimentsPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lexClient, setlexClient] = useState<LexRuntimeV2Client | null>(null);

  const [hoveredStock, setHoveredStock] = useState<Stock | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const apiBase = import.meta.env.VITE_API_URL;
  const wishlistApi = import.meta.env.VITE_WISHLIST_API_URL;

  // -------------------------------
  // ADD TO WISHLIST
  // -------------------------------
  async function addToWishlist(stock: Stock) {
    try {
      const res = await fetch(`${wishlistApi}/wishlist?userId=user123`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: stock.ticker,
          companyName: stock.companyName,
          currentPrice: stock.price,
          platform: "Wishlist",
          quantity: 0,
          avgPrice: 0,
          purchaseDate: null,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      console.log("Wishlist Add Response:", data);

      if (!res.ok) {
        alert("Failed to add to wishlist.");
        return;
      }

      alert(`Added ${stock.ticker} to your wishlist!`);
    } catch (err) {
      console.error("Wishlist Error:", err);
      alert("Could not add to wishlist.");
    }
  }

  // -------------------------------
  // Load Lex client
  // -------------------------------
  useEffect(() => {
    createlexClient().then(setlexClient);
  }, []);

  // -------------------------------
  // Fetch Sentiment Data
  // -------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/stocks`);
        const json = await res.json();
        const raw: RawStock[] = Array.isArray(json) ? json : json.data || [];

        const mockCEOs = [
          "Tim Cook",
          "Satya Nadella",
          "Jensen Huang",
          "Lisa Su",
          "Sundar Pichai",
          "Andy Jassy",
          "Mark Zuckerberg",
        ];
        const mockEarningsDates = [
          "Jan 30, 2025",
          "Feb 15, 2025",
          "Mar 5, 2025",
          "Feb 28, 2025",
          "Jan 25, 2025",
        ];
        const mockDebtStatus = ["Net Cash", "Moderate Debt", "High Debt"] as const;
        const mockOutlook = ["Positive", "Neutral", "Negative"] as const;

        const generateAIInsight = (stock: Stock): string => {
  const insights: string[] = [
    `Strong revenue growth of 15% YoY.`,
    `New CEO brings innovation direction.`,
    `Dividend growth trend is strong.`,
    `P/E ratio indicates potential value.`,
    `Insider buying increased recently.`,
    `Debt-to-equity ratio improving.`,
    `Market share is expanding in the sector.`,
    `Earnings have recently beaten expectations.`,
  ];

  const idx = Math.floor(Math.random() * insights.length);
  return insights[idx] ?? "";
};


        const normalized: Stock[] = raw.map((s: RawStock, idx: number) => {
          const stock: Stock = {
            companyName: s.companyName || s.company || s.name,
            ticker: s.ticker || s.symbol,
            action:
              ["BUY", "SELL", "HOLD"].includes((s.action || "").toUpperCase()) ?
              (s.action as any).toUpperCase() :
              "HOLD",
            price: Number(s.price ?? 0),
            change: Number(s.change ?? 0),
            confidence: Number(s.confidence ?? 0),
            sector: s.sector || "Technology",
            reason: s.reason || "",
            targetPrice: Number(s.targetPrice ?? 0),
            marketCap: Number(s.marketCap ?? Math.random() * 2000 + 100),
            peRatio: Number(s.peRatio ?? Math.random() * 40 + 10),
            previousClose: Number(s.previousClose ?? 0),
            trend:
              s.trend ||
              Array.from({ length: 7 }, () => s.price + Math.random() * 10 - 5),

            ceo: mockCEOs[idx % mockCEOs.length],
            dividendYield: Math.random() * 5,
            nextEarnings: mockEarningsDates[idx % mockEarningsDates.length],
            debtStatus: mockDebtStatus[idx % mockDebtStatus.length],
            outlook: mockOutlook[idx % mockOutlook.length],
            aiInsight: "",
          };

          stock.aiInsight = generateAIInsight(stock);
          return stock;
        });

        setStocks(normalized);
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase]);

  // -------------------------------
  // Tooltip handlers
  // -------------------------------
  const handleMouseEnter = (stock: Stock, event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredStock(stock);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      setShowTooltip(true);
    }, 300);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (showTooltip) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowTooltip(false);
    setHoveredStock(null);
  };

  // ---------------------------------------
  // LOADING SCREEN
  // ---------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-gray-400">
        Loading market data…
      </div>
    );
  }

  // ---------------------------------------
  // MAIN UI
  // ---------------------------------------
  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-gradient-to-b from-black via-black to-gray-900">
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 text-cyan-300 font-semibold underline hover:text-cyan-400"
      >
        ← Home
      </Link>

      <div className="relative z-10 p-6">
        {/* HEADER */}
        <header className="max-w-6xl mx-auto text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 text-transparent bg-clip-text drop-shadow-lg">
            ⚡ AI Trading Assistant ⚡
          </h1>
          <p className="text-gray-400">Smarter Insights • Real-Time Decisions</p>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto space-y-8">
          {/* -------------------- */}
          {/* Charts Section */}
          {/* -------------------- */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* PIE CHART */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 shadow-xl">
              <h2 className="text-lg font-semibold text-cyan-300 mb-2">
                Market Sentiment
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "BUY",
                        value: stocks.filter((s) => s.action === "BUY").length,
                      },
                      {
                        name: "HOLD",
                        value: stocks.filter((s) => s.action === "HOLD").length,
                      },
                      {
                        name: "SELL",
                        value: stocks.filter((s) => s.action === "SELL").length,
                      },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* LINE CHART */}
            <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-4 shadow-xl">
              <h2 className="text-lg font-semibold text-cyan-300 mb-2">
                Price Movement Overview
              </h2>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={stocks.map((s) => ({ name: s.ticker, price: s.price }))}
                >
                  <CartesianGrid stroke="#222" />
                  <XAxis dataKey="name" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line dataKey="price" stroke="#22d3ee" strokeWidth={2.5} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* -------------------- */}
          {/* STOCK TABLE */}
          {/* -------------------- */}
          <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 shadow-2xl">
            <table className="min-w-full text-sm">
              <thead className="text-gray-300 bg-gray-800">
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
                    className="cursor-pointer hover:bg-gray-800/50 transition"
                    onClick={() => {
                      setSelectedStock(s);
                      setIsModalOpen(true);
                    }}
                    onMouseEnter={(e) => handleMouseEnter(s, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <td className="p-3 border border-gray-800">{s.companyName}</td>
                    <td className="p-3 border border-gray-800">{s.ticker}</td>
                    <td className="p-3 border border-gray-800">
                      <span
                        className={`px-3 py-1 rounded-full font-bold ${
                          s.action === "BUY"
                            ? "bg-green-500/20 text-green-300"
                            : s.action === "SELL"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {s.action}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-800">
                      ${s.price.toFixed(2)}
                    </td>
                    <td
                      className={`p-3 border border-gray-800 ${
                        s.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {s.change >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(s.change).toFixed(2)}%
                    </td>
                    <td className="p-3 border border-gray-800">
                      {s.confidence}%
                    </td>
                    <td className="p-3 border border-gray-800">{s.sector}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>

        {/* -------------------- */}
        {/* TOOLTIP */}
        {/* -------------------- */}
        {hoveredStock && (
          <StockHoverTooltip
            show={showTooltip}
            position={tooltipPosition}
            data={{
              companyName: hoveredStock.companyName || "Unknown",
              ticker: hoveredStock.ticker,
              marketCap: hoveredStock.marketCap || 0,
              peRatio: hoveredStock.peRatio || 0,
              dividendYield: hoveredStock.dividendYield || 0,
              ceo: hoveredStock.ceo || "Unknown",
              nextEarnings: hoveredStock.nextEarnings || "TBD",
              debtStatus: hoveredStock.debtStatus || "Moderate Debt",
              outlook: hoveredStock.outlook || "Neutral",
              aiInsight: hoveredStock.aiInsight,
            }}
          />
        )}

        {/* -------------------- */}
        {/* MODAL */}
        {/* -------------------- */}
        <AnimatePresence>
          {isModalOpen && selectedStock && (
            <motion.div
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="bg-gray-900 border border-cyan-800/30 rounded-2xl p-6 w-[90%] max-w-lg shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-cyan-400 text-center">
                  {selectedStock.companyName} ({selectedStock.ticker})
                </h2>

                {/* Chart inside modal */}
                {selectedStock.trend && (
                  <div className="w-full h-[160px]">
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
                        <Tooltip />
                        <Line
                          dataKey="price"
                          stroke="#22d3ee"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Add To Wishlist Button */}
                <button
                  onClick={() => addToWishlist(selectedStock)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 
                  hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold 
                  transition-all shadow-lg shadow-cyan-500/20"
                >
                  Add to Wishlist
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot */}
        {lexClient && <ChatLauncher lexClient={lexClient} />}
      </div>
    </div>
  );
}