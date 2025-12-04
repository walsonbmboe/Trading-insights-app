// src/components/EnhancedStockModal.tsx
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  Brain,
} from "lucide-react";

interface FullStockData {
  companyName: string;
  ticker: string;
  price: number;
  change: number;
  action: string;

  // Financials
  marketCap: number;
  preTaxProfit: number;
  profitsRising: boolean;
  dividendYield: number;
  dividendsRising: boolean;
  debtOrCash: string;
  netDebt: number;
  roce: number;

  // Valuation
  peRatio: number;
  sharePriceMoving: string;
  bidAskSpread: number;

  // Leadership
  ceo: string;
  institutionalBuys: boolean;
  insiderOwnership: number;

  // Dates & Events
  nextEarnings: string;
  exDividendDate: string;
  dividendPaymentHistory: string;

  // Analysis
  outlook: string;
  dividendType: string;
  sector: string;
  earningsWarning: boolean;
  bankruptcyWarning: boolean;
  healthTrend: string;
  brokersView: string;
  chartLooks: string;
  annualReportSummary: string;

  // Trend data
  trend?: number[];

  // AI Insight
  aiInsight: string;
}

interface EnhancedStockModalProps {
  stock: FullStockData;
  onClose: () => void;
}

export default function EnhancedStockModal({
  stock,
  onClose,
}: EnhancedStockModalProps) {
  const [activeTab, setActiveTab] = useState<
    "financials" | "valuation" | "leadership" | "analysis" | "ai"
  >("financials");

  const tabs = [
    { id: "financials", label: "💰 Financials", icon: DollarSign },
    { id: "valuation", label: "📊 Valuation", icon: TrendingUp },
    { id: "leadership", label: "👔 Leadership", icon: Users },
    { id: "analysis", label: "📈 Analysis", icon: Calendar },
    { id: "ai", label: "🤖 AI Insights", icon: Brain },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-950 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-500/20"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-b border-gray-800 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white hover:rotate-90 transition-all duration-300 z-10"
          >
            ✕
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {stock.companyName}
              </h2>

              <div className="flex items-center gap-4">
                <span className="text-cyan-400 font-bold text-xl">{stock.ticker}</span>
                <span className="text-2xl font-bold text-white">
                  ${stock.price.toFixed(2)}
                </span>
                <span
                  className={`font-semibold ${
                    stock.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stock.change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(stock.change).toFixed(2)}%
                </span>
              </div>
            </div>

            <div
              className={`px-6 py-3 rounded-xl font-bold text-lg ${
                stock.action === "BUY"
                  ? "bg-green-500/20 text-green-400 border-2 border-green-500"
                  : stock.action === "SELL"
                  ? "bg-red-500/20 text-red-400 border-2 border-red-500"
                  : "bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500"
              }`}
            >
              {stock.action}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-800 bg-gray-900/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* FINANCIALS */}
          {activeTab === "financials" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Financial Overview
              </h3>

              <DataRow
                label="Market Cap"
                value={`$${stock.marketCap.toLocaleString()}B`}
              />
              <DataRow
                label="Pre-Tax Profit"
                value={`$${stock.preTaxProfit}M`}
              />
              <DataRow
                label="Profits Rising?"
                value={stock.profitsRising ? "✅ Yes" : "❌ No"}
                highlight={stock.profitsRising}
              />
              <DataRow
                label="Dividend Yield"
                value={`${stock.dividendYield.toFixed(2)}%`}
              />
              <DataRow
                label="Dividends Rising?"
                value={stock.dividendsRising ? "✅ Yes" : "⚠️ No"}
                highlight={stock.dividendsRising}
              />
              <DataRow label="Debt Status" value={stock.debtOrCash} />
              <DataRow label="Net Debt" value={`$${stock.netDebt}M`} />
              <DataRow label="ROCE" value={`${stock.roce}%`} />
              <DataRow label="Dividend Type" value={stock.dividendType} />
            </div>
          )}

          {/* VALUATION */}
          {activeTab === "valuation" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Valuation Metrics
              </h3>

              <DataRow label="P/E Ratio" value={stock.peRatio.toFixed(1)} />
              <DataRow label="Share Price Trend" value={stock.sharePriceMoving} />
              <DataRow
                label="Bid-Ask Spread"
                value={`${stock.bidAskSpread.toFixed(2)}%`}
              />

              {stock.trend && (
                <div className="mt-4 p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">
                    7-Day Price Movement
                  </h4>

                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={stock.trend.map((p, i) => ({
                        day: `Day ${i + 1}`,
                        price: p,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#22d3ee"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* LEADERSHIP */}
          {activeTab === "leadership" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Leadership & Ownership
              </h3>

              <DataRow label="CEO" value={stock.ceo} />
              <DataRow
                label="Institutional Buys"
                value={stock.institutionalBuys ? "✅ Active Buying" : "⚠️ No Recent Activity"}
                highlight={stock.institutionalBuys}
              />
              <DataRow
                label="Insider Ownership"
                value={`${stock.insiderOwnership}%`}
              />
            </div>
          )}

          {/* ANALYSIS */}
          {activeTab === "analysis" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Market Analysis
              </h3>

              <DataRow label="Outlook" value={stock.outlook} />
              <DataRow label="Sector" value={stock.sector} />
              <DataRow label="Next Earnings" value={stock.nextEarnings} />
              <DataRow label="Ex-Dividend Date" value={stock.exDividendDate} />
              <DataRow
                label="Dividend Payment History"
                value={stock.dividendPaymentHistory}
              />

              {stock.earningsWarning && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400">
                      ⚠️ Earnings Manipulation Warning
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Unusual accounting activity detected
                    </p>
                  </div>
                </div>
              )}

              {stock.bankruptcyWarning && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-400">
                      🚨 Bankruptcy Risk Warning
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      High debt levels and declining revenue
                    </p>
                  </div>
                </div>
              )}

              <DataRow label="Health Trend" value={stock.healthTrend} />
              <DataRow label="Brokers' View" value={stock.brokersView} />
              <DataRow label="Chart Analysis" value={stock.chartLooks} />

              <div className="p-4 bg-gray-800/50 rounded-xl mt-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">
                  Annual Report Summary
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {stock.annualReportSummary}
                </p>
              </div>
            </div>
          )}

          {/* AI INSIGHTS */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                AI-Powered Insights
              </h3>

              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {stock.aiInsight}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h5 className="text-xs font-semibold text-gray-400 mb-2">
                    Risk Level
                  </h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          stock.bankruptcyWarning
                            ? "bg-red-500 w-4/5"
                            : stock.earningsWarning
                            ? "bg-yellow-500 w-1/2"
                            : "bg-green-500 w-1/4"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        stock.bankruptcyWarning
                          ? "text-red-400"
                          : stock.earningsWarning
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {stock.bankruptcyWarning
                        ? "High"
                        : stock.earningsWarning
                        ? "Medium"
                        : "Low"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h5 className="text-xs font-semibold text-gray-400 mb-2">
                    AI Confidence
                  </h5>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 w-4/5" />
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">
                      85%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DataRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
      <span className="text-gray-400 text-sm font-medium">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-green-400" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
