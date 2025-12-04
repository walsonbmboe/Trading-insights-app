// src/components/StockHoverTooltip.tsx
import { motion, AnimatePresence } from "framer-motion";

interface StockTooltipData {
  companyName: string;
  ticker: string;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  ceo: string;
  nextEarnings: string;
  debtStatus: "Net Cash" | "Moderate Debt" | "High Debt";
  outlook: "Positive" | "Neutral" | "Negative";
  aiInsight?: string;
}

interface StockHoverTooltipProps {
  data: StockTooltipData;
  position: { x: number; y: number };
  show: boolean;
}

export default function StockHoverTooltip({ data, position, show }: StockHoverTooltipProps) {
  const outlookColors = {
    Positive: "text-green-400 bg-green-500/10 border-green-500/30",
    Neutral: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    Negative: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  const debtColors = {
    "Net Cash": "text-green-400",
    "Moderate Debt": "text-yellow-400",
    "High Debt": "text-red-400",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${position.x + 20}px`,
            top: `${position.y - 50}px`,
          }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-950 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 p-4 w-80 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-800">
              <div>
                <h3 className="font-bold text-white text-lg">{data.ticker}</h3>
                <p className="text-xs text-gray-400">{data.companyName}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✨</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Market Cap</span>
                <span className="text-white font-semibold text-sm">
                  ${data.marketCap >= 1000 ? `${(data.marketCap / 1000).toFixed(1)}T` : `${data.marketCap}B`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">P/E Ratio</span>
                <span className="text-white font-semibold text-sm">
                  {data.peRatio.toFixed(1)}
                  {data.peRatio > 30 && <span className="text-yellow-400 ml-1 text-xs">⚠️ High</span>}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Dividend Yield</span>
                <span className="text-cyan-400 font-semibold text-sm">
                  {data.dividendYield > 0 ? `${data.dividendYield.toFixed(2)}%` : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">CEO</span>
                <span className="text-white font-medium text-sm">{data.ceo}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Next Earnings</span>
                <span className="text-purple-400 font-medium text-sm">{data.nextEarnings}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Financial Health</span>
                <span className={`font-semibold text-sm ${debtColors[data.debtStatus]}`}>
                  {data.debtStatus}
                </span>
              </div>
            </div>

            {/* Outlook Badge */}
            <div className="mb-3">
              <div className={`px-3 py-2 rounded-lg border ${outlookColors[data.outlook]} text-center`}>
                <span className="text-xs font-semibold">
                  {data.outlook === "Positive" && "🟢"}
                  {data.outlook === "Neutral" && "🟡"}
                  {data.outlook === "Negative" && "🔴"}
                  {" "}Outlook: {data.outlook}
                </span>
              </div>
            </div>

            {/* AI Insight */}
            {data.aiInsight && (
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 text-xs mt-0.5">🤖</span>
                  <p className="text-xs text-gray-300 leading-relaxed">{data.aiInsight}</p>
                </div>
              </div>
            )}

            {/* Hint */}
            <p className="text-[10px] text-gray-500 text-center mt-2">
              Click row for full analysis
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}