// src/Pages/Portfolio.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Upload,
  Bell,
  Trash2,
  X,
} from "lucide-react";

const portfolioBase = import.meta.env.VITE_PORTFOLIO_API_URL as string;

type AlertType = "ABOVE" | "BELOW";

interface PortfolioStock {
  id: string;
  ticker: string;
  companyName: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  platform: string;
  purchaseDate: string;
  wishlist: boolean;
  alertPrice?: number;
  alertType?: AlertType;
}

export default function Portfolio() {
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"holdings" | "wishlist">(
    "holdings"
  );

  // Add stock modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newAvgPrice, setNewAvgPrice] = useState("");
  const [newPlatform, setNewPlatform] = useState("Manual Entry");
  const [addAsWishlist, setAddAsWishlist] = useState(false);

  // Alert modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(
    null
  );
  const [alertType, setAlertType] = useState<AlertType>("ABOVE");
  const [alertPrice, setAlertPrice] = useState("");

  const userId = "user123"; // TODO: replace with Cognito user later
  const alertEmail = "buildoncloud.awsconsult@gmail.com"; // TODO: later pull from user profile

  // ============================
  // LOAD PORTFOLIO FROM API
  // ============================
  const loadPortfolio = async () => {
    if (!portfolioBase) {
      console.error("VITE_PORTFOLIO_API_URL is not set");
      setError("Portfolio API URL not configured.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${portfolioBase}/portfolio?userId=${encodeURIComponent(userId)}`
      );
      const json = await res.json();
      console.log("Portfolio API raw response:", json);

      const items = Array.isArray(json)
        ? json
        : typeof json.body === "string"
        ? JSON.parse(json.body)
        : [];

      const mapped: PortfolioStock[] = items.map(
        (item: any, index: number) => ({
          id: item.stockId || `${item.ticker}-${index}`,
          ticker: item.ticker, // Lambda already strips STOCK#
          companyName: item.companyName ?? "",
          quantity: Number(item.quantity ?? 0),
          avgPrice: Number(item.avgPrice ?? 0),
          currentPrice: Number(item.currentPrice ?? 0),
          platform: item.platform ?? "",
          purchaseDate: item.purchaseDate ?? "",
          wishlist:
            item.wishlist === true || Number(item.quantity ?? 0) === 0,
          alertPrice:
            item.alertPrice !== undefined
              ? Number(item.alertPrice)
              : undefined,
          alertType: item.alertType ?? undefined,
        })
      );

      setStocks(mapped);
    } catch (err: any) {
      console.error("Error loading portfolio:", err);
      setError(err.message || "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  // Derived views
  const holdings = stocks.filter((s) => !s.wishlist && s.quantity > 0);
  const wishlist = stocks.filter((s) => s.wishlist || s.quantity === 0);

  // Totals from holdings only
  const totalValue = holdings.reduce(
    (sum, s) => sum + s.quantity * s.currentPrice,
    0
  );
  const totalCost = holdings.reduce(
    (sum, s) => sum + s.quantity * s.avgPrice,
    0
  );
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent =
    totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const calculateGainLoss = (stock: PortfolioStock) => {
    const value = stock.quantity * stock.currentPrice;
    const cost = stock.quantity * stock.avgPrice;
    const gainLoss = value - cost;
    const percent = cost > 0 ? (gainLoss / cost) * 100 : 0;
    return { gainLoss, percent };
  };

  const visibleStocks =
    activeTab === "holdings" ? holdings : wishlist;

  // ============================
  // ADD STOCK (HOLDING / WISHLIST)
  // ============================
  const handleAddStock = async () => {
    if (!portfolioBase) return;

    const ticker = newTicker.trim().toUpperCase();
    if (!ticker) {
      alert("Please enter a ticker");
      return;
    }

    const payload = {
      userId,
      ticker,
      companyName: newCompany,
      quantity: addAsWishlist ? 0 : Number(newQuantity || 0),
      avgPrice: addAsWishlist ? 0 : Number(newAvgPrice || 0),
      platform: addAsWishlist ? "" : newPlatform,
      wishlist: addAsWishlist,
    };

    try {
      const res = await fetch(
        `${portfolioBase}/portfolio?userId=${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Add stock failed:", text);
        alert("Failed to add stock");
        return;
      }

      await loadPortfolio();
      setShowAddModal(false);
      setNewTicker("");
      setNewCompany("");
      setNewQuantity("");
      setNewAvgPrice("");
      setNewPlatform("Manual Entry");
      setAddAsWishlist(false);
    } catch (err) {
      console.error("Add stock error:", err);
      alert("Error adding stock");
    }
  };

  // ============================
  // DELETE STOCK
  // ============================
  const handleDeleteStock = async (stock: PortfolioStock) => {
    if (!portfolioBase) return;
    if (!confirm(`Remove ${stock.ticker} from portfolio?`)) return;

    try {
      const res = await fetch(
        `${portfolioBase}/portfolio/${encodeURIComponent(
          stock.ticker
        )}?userId=${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete stock failed:", text);
        alert("Failed to delete stock");
        return;
      }

      setStocks((prev) => prev.filter((s) => s.id !== stock.id));
    } catch (err) {
      console.error("Delete stock error:", err);
      alert("Error deleting stock");
    }
  };

  // ============================
  // SET ALERT
  // ============================
  const openAlertModal = (stock: PortfolioStock) => {
    setSelectedStock(stock);
    setAlertType(stock.alertType ?? "ABOVE");
    setAlertPrice(
      stock.alertPrice !== undefined ? String(stock.alertPrice) : ""
    );
    setShowAlertModal(true);
  };

  const handleSaveAlert = async () => {
    if (!portfolioBase || !selectedStock) return;

    const priceNum = Number(alertPrice);
    if (!priceNum || priceNum <= 0) {
      alert("Enter a valid target price");
      return;
    }

    const payload = {
      userId,
      ticker: selectedStock.ticker,
      targetPrice: priceNum,
      alertType,
      email: alertEmail,
    };

    try {
      const res = await fetch(
        `${portfolioBase}/alerts?userId=${encodeURIComponent(userId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Create alert failed:", text);
        alert("Failed to set alert");
        return;
      }

      // Optimistically update local state
      setStocks((prev) =>
        prev.map((s) =>
          s.id === selectedStock.id
            ? { ...s, alertPrice: priceNum, alertType }
            : s
        )
      );

      setShowAlertModal(false);
    } catch (err) {
      console.error("Create alert error:", err);
      alert("Error creating alert");
    }
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse" />

      {/* Header */}
      <header className="w-full backdrop-blur-xl bg-slate-900/50 border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-cyan-300 font-semibold hover:text-cyan-400 transition-colors"
          >
            ← Home
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Error + Loading */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/40 border border-red-500/40 rounded-lg px-4 py-2">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-slate-300">
            Loading portfolio…
          </div>
        )}

        {/* Summary cards (based on holdings only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Total Value</p>
            <p className="text-3xl font-bold text-white">
              $
              {totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">
              Total Gain/Loss
            </p>
            <div className="flex items-center gap-2">
              <p
                className={`text-3xl font-bold ${
                  totalGainLoss >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                $
                {Math.abs(totalGainLoss).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {totalGainLoss >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
            <p
              className={`text-sm mt-1 ${
                totalGainLoss >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {totalGainLoss >= 0 ? "+" : ""}
              {totalGainLossPercent.toFixed(2)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-2">Active Alerts</p>
            <p className="text-3xl font-bold text-white">
              {stocks.filter((s) => s.alertPrice).length}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/50"
          >
            <Plus className="w-5 h-5" />
            Add Stock
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 rounded-full font-semibold transition-all">
            <Upload className="w-5 h-5" />
            Upload CSV
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveTab("holdings")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "holdings"
                ? "bg-slate-100/10 text-cyan-300 border border-cyan-400/60"
                : "bg-slate-900/60 text-slate-400 border border-slate-700"
            }`}
          >
            Holdings
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "wishlist"
                ? "bg-slate-100/10 text-cyan-300 border border-cyan-400/60"
                : "bg-slate-900/60 text-slate-400 border border-slate-700"
            }`}
          >
            Wishlist
          </button>
        </div>

        {/* Holdings / Wishlist Table */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">
            {activeTab === "holdings" ? "Holdings" : "Wishlist"}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-slate-400 text-sm border-b border-slate-800">
                <tr>
                  <th className="text-left p-3">Stock</th>
                  {activeTab === "holdings" && (
                    <>
                      <th className="text-left p-3">Quantity</th>
                      <th className="text-left p-3">Avg Price</th>
                      <th className="text-left p-3">
                        Current Price
                      </th>
                      <th className="text-left p-3">Gain/Loss</th>
                      <th className="text-left p-3">Platform</th>
                    </>
                  )}
                  {activeTab === "wishlist" && (
                    <>
                      <th className="text-left p-3">
                        Target Entry (optional)
                      </th>
                    </>
                  )}
                  <th className="text-left p-3">Alert</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleStocks.map((stock) => {
                  const { gainLoss, percent } =
                    calculateGainLoss(stock);
                  return (
                    <tr
                      key={stock.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-bold text-white">
                            {stock.ticker}
                          </p>
                          <p className="text-xs text-slate-400">
                            {stock.companyName}
                          </p>
                        </div>
                      </td>

                      {activeTab === "holdings" && (
                        <>
                          <td className="p-3 text-white">
                            {stock.quantity}
                          </td>
                          <td className="p-3 text-slate-300">
                            ${stock.avgPrice.toFixed(2)}
                          </td>
                          <td className="p-3 text-white">
                            ${stock.currentPrice.toFixed(2)}
                          </td>
                          <td className="p-3">
                            <div
                              className={
                                gainLoss >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              <p className="font-semibold">
                                $
                                {Math.abs(
                                  gainLoss
                                ).toFixed(2)}
                              </p>
                              <p className="text-xs">
                                {gainLoss >= 0 ? "+" : ""}
                                {percent.toFixed(2)}%
                              </p>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-slate-700/50 rounded-full text-xs">
                              {stock.platform || "—"}
                            </span>
                          </td>
                        </>
                      )}

                      {activeTab === "wishlist" && (
                        <td className="p-3 text-slate-300 text-sm">
                          You can later convert this into a
                          full holding with quantity & platform.
                        </td>
                      )}

                      <td className="p-3">
                        {stock.alertPrice ? (
                          <div className="flex items-center gap-1 text-xs text-cyan-400">
                            <Bell className="w-3 h-3" />
                            {stock.alertType === "ABOVE" ? ">" : "<"} $
                            {stock.alertPrice}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            None
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openAlertModal(stock)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Set Alert"
                          >
                            <Bell className="w-4 h-4 text-cyan-400" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteStock(stock)
                            }
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {visibleStocks.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-6 text-center text-slate-400 text-sm"
                    >
                      {activeTab === "holdings"
                        ? "No holdings yet. Add a stock to begin tracking your portfolio."
                        : "No wishlist items yet. Add from the Sentiments page or via the Add Stock button and mark as wishlist."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Stock Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  Add Stock to Portfolio
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Ticker
                  </label>
                  <input
                    type="text"
                    placeholder="AAPL"
                    value={newTicker}
                    onChange={(e) =>
                      setNewTicker(e.target.value)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Company Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apple Inc."
                    value={newCompany}
                    onChange={(e) =>
                      setNewCompany(e.target.value)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="wishlist-toggle"
                    type="checkbox"
                    checked={addAsWishlist}
                    onChange={(e) =>
                      setAddAsWishlist(e.target.checked)
                    }
                    className="h-4 w-4 text-cyan-500"
                  />
                  <label
                    htmlFor="wishlist-toggle"
                    className="text-sm text-slate-300"
                  >
                    Add as wishlist only (no quantity or platform
                    yet)
                  </label>
                </div>

                {!addAsWishlist && (
                  <>
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">
                        Quantity
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        value={newQuantity}
                        onChange={(e) =>
                          setNewQuantity(e.target.value)
                        }
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">
                        Average Price
                      </label>
                      <input
                        type="number"
                        placeholder="145.50"
                        step="0.01"
                        value={newAvgPrice}
                        onChange={(e) =>
                          setNewAvgPrice(e.target.value)
                        }
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">
                        Platform
                      </label>
                      <select
                        value={newPlatform}
                        onChange={(e) =>
                          setNewPlatform(e.target.value)
                        }
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option>Manual Entry</option>
                        <option>Robinhood</option>
                        <option>E*TRADE</option>
                        <option>Fidelity</option>
                      </select>
                    </div>
                  </>
                )}

                <button
                  onClick={handleAddStock}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all mt-6"
                >
                  {addAsWishlist
                    ? "Add to Wishlist"
                    : "Add to Portfolio"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Set Alert Modal */}
      <AnimatePresence>
        {showAlertModal && selectedStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAlertModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  Set Price Alert
                </h3>
                <button
                  onClick={() => setShowAlertModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-400">Stock</p>
                <p className="text-lg font-bold">
                  {selectedStock.ticker} -{" "}
                  {selectedStock.companyName}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Current Price:{" "}
                  <span className="text-white font-semibold">
                    $
                    {selectedStock.currentPrice.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Alert Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === "ABOVE"}
                        onChange={() =>
                          setAlertType("ABOVE")
                        }
                      />
                      <span>Above</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === "BELOW"}
                        onChange={() =>
                          setAlertType("BELOW")
                        }
                      />
                      <span>Below</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Target Price
                  </label>
                  <input
                    type="number"
                    placeholder="180.00"
                    step="0.01"
                    value={alertPrice}
                    onChange={(e) =>
                      setAlertPrice(e.target.value)
                    }
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={handleSaveAlert}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold transition-all mt-6"
                >
                  Save Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}