import React, { useState, useRef, useEffect } from "react";
import { useLex } from "../hooks/useLex";
import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";

interface Props {
  lexClient: LexRuntimeV2Client;
  onClose?: () => void;
}

export const LexChat: React.FC<Props> = ({ lexClient, onClose }) => {
  const { messages = [], sendMessage = async () => {}, loading = false } = useLex(lexClient) || {};
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed top-12 right-12 z-50 w-[380px] h-[460px] flex flex-col
                bg-[#0D1117]/70 backdrop-blur-2xl rounded-[32px] shadow-2xl
                border border-white/10 overflow-hidden ring-1 ring-white/20">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3
                bg-gradient-to-r from-purple-500 to-pink-500">
  <div className="flex items-center gap-2">
    <span className="text-white text-lg">🤖</span>
    <span className="text-white font-semibold text-sm">AI Trading Assistant</span>
  </div>
  <button onClick={onClose} className="text-white text-xl hover:scale-110 transition">×</button>
</div>

      {/* Welcome Bubble */}
      <div className="px-4 pt-3 pb-2">
        <div className="inline-block px-3 py-2 rounded-2xl bg-white/10 text-sm text-white">
          Hello! I am your AI Trading Assistant. I can look up stocks, analyze
          trends, or help with trading actions.
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-2 overflow-y-auto space-y-2">
        {messages.map((m, idx) => (
  <div key={idx} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] px-6 py-3 rounded-full text-base shadow-lg ${
        m.from === "user"
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          : "bg-white/20 text-white border border-white/20 rounded-full"
      }`}
    >
      {m.text}
    </div>
  </div>
))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200" />
            </div>
            Typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 px-3 py-2 border-t border-gray-200"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500
                     text-white disabled:opacity-50 hover:scale-105 transition"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
};
