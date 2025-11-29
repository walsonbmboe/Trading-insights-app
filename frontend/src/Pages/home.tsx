// src/pages/Home.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Wallet, Brain, MessageCircle, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  const nav = useNavigate();

  // Quick Action Cards
  const quickActions = [
    {
      title: "Analyze Market Sentiment",
      desc: "See AI-driven buy/hold/sell outlooks across your watchlist.",
      icon: <TrendingUp className="w-8 h-8" />,
      path: "/sentiments",
      gradient: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/50",
    },
    {
      title: "Review Portfolio",
      desc: "Track performance, risk and allocation in one consolidated view.",
      icon: <Wallet className="w-8 h-8" />,
      path: "/portfolio",
      gradient: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/50",
    },
    {
      title: "Refine Strategy with AI",
      desc: "Ask the assistant to explain, test or challenge your next move.",
      icon: <Brain className="w-8 h-8" />,
      path: "/sentiments",
      gradient: "from-purple-500 to-pink-500",
      glow: "shadow-purple-500/50",
    },
  ];

  const features = [
    { icon: <Sparkles className="w-5 h-5" />, text: "AI-Powered Insights" },
    { icon: <Zap className="w-5 h-5" />, text: "Real-Time Analysis" },
    { icon: <Shield className="w-5 h-5" />, text: "Risk Management" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* ========================= NAVBAR ========================= */}
      <header className="w-full backdrop-blur-xl bg-slate-900/50 border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Trading Assistant
            </span>
          </motion.div>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <button 
              onClick={() => nav("/")} 
              className="text-slate-300 hover:text-white transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              onClick={() => nav("/sentiments")} 
              className="text-slate-300 hover:text-white transition-colors relative group"
            >
              Sentiments
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </button>
            <button 
              onClick={() => nav("/portfolio")} 
              className="text-slate-300 hover:text-white transition-colors relative group"
            >
              Portfolio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </button>
          </nav>
        </div>
      </header>

      {/* ========================= MAIN CONTENT ========================= */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24 relative z-10">

        {/* ========================= HERO SECTION ========================= */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">Powered by Advanced AI</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Trade with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                clarity
              </span>
              <br />
              instead of noise
            </h1>

            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Get a clean, consolidated view of market sentiment, portfolio health and
              AI-backed signals—so every decision feels measured, not emotional.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => nav("/sentiments")}
              className="group relative px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
            >
              <span className="relative z-10">Explore Sentiments</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </button>

            <button
              onClick={() => nav("/portfolio")}
              className="px-8 py-4 rounded-full font-semibold text-white border border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              View Portfolio
            </button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 pt-8"
          >
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-blue-400">{feature.icon}</div>
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ========================= TODAY'S SNAPSHOT ========================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Today's Snapshot</h2>
                    <p className="text-sm text-slate-400">Real-time market intelligence</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                  <span className="text-sm text-emerald-400 font-medium">Live</span>
                </div>
              </div>

              <div className="space-y-4">
                <SnapshotRow label="Global Sentiment" value="Moderately Bullish" trend="up" />
                <SnapshotRow label="AI Confidence" value="High (82%)" trend="up" />
                <SnapshotRow label="Portfolio Risk" value="Balanced" trend="neutral" />
              </div>

              <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-slate-400 leading-relaxed">
                  💡 These indicators are a guide, not a guarantee. You stay in control; the system
                  simply keeps the numbers honest.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================= QUICK START ========================= */}
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-4">Quick Start</h2>
            <p className="text-slate-400 text-center max-w-2xl mx-auto">
              Choose your next action and let AI guide your trading decisions
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.map((item, idx) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => nav(item.path)}
                className={`group relative text-left rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 backdrop-blur-xl p-6 overflow-hidden transition-all duration-300 hover:border-slate-600 hover:shadow-2xl ${item.glow}`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{item.desc}</p>

                  <span className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    Launch
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>

                {/* Glow effect */}
                <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              </motion.button>
            ))}
          </div>
        </section>

        {/* ========================= AI COMPANION ========================= */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex justify-center"
        >
          <div className="max-w-2xl w-full relative rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl p-8 shadow-2xl overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
            
            <div className="relative z-10 flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI Companion
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Advanced emotional intelligence for real understanding. Ask it anything about markets, strategies, or risk management.
                </p>
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70">
                  Start Conversation
                </button>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      {/* ========================= FOOTER ========================= */}
      <footer className="relative z-10 border-t border-slate-800/50 mt-24 py-12 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 text-sm text-slate-400 text-center leading-relaxed">
          <div className="mb-4">
            <span className="font-semibold text-white">AI Trading Assistant</span> © 2025
          </div>
          <div className="mb-2">
            Built for data-driven, emotionally balanced decision-making.
          </div>
          <div>
            Support:{" "}
            <a
              href="mailto:buildoncloud.awsconsult@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              buildoncloud.awsconsult@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SnapshotRow({ label, value, trend }: { label: string; value: string; trend: "up" | "down" | "neutral" }) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-blue-400"
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm hover:bg-slate-800/50 transition-colors">
      <span className="text-slate-300 font-medium">{label}</span>
      <span className={`font-bold ${trendColors[trend]}`}>{value}</span>
    </div>
  );
}