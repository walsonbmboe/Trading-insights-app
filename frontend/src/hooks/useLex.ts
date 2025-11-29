// src/hooks/useLex.ts
import { useState, useCallback } from "react";
import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";
import {
  RecognizeTextCommand,
  RecognizeTextCommandInput,
} from "@aws-sdk/client-lex-runtime-v2";
import { BOT_ID, BOT_ALIAS_ID, LOCALE, SESSION_ID } from "../aws-lex-config";

export type Message = {
  from: "user" | "bot";
  text: string;
};

export const useLex = (lexClient: LexRuntimeV2Client) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  if (!lexClient) {
  console.warn("Lex client not ready yet");
  return;
}
  const sendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: inputText }]);
    setLoading(true);

    const params: RecognizeTextCommandInput = {
      botId: BOT_ID,
      botAliasId: BOT_ALIAS_ID,
      localeId: LOCALE,
      sessionId: SESSION_ID(),
      text: inputText,
    };

    try {
      const res = await lexClient.send(new RecognizeTextCommand(params));
      const botMsg = res.messages?.[0]?.content || "Sorry, I didn’t catch that.";
      setMessages((prev) => [...prev, { from: "bot", text: botMsg }]);
    } catch (err) {
      console.error("Lex error:", err);
      setMessages((prev) => [...prev, { from: "bot", text: "Error contacting assistant." }]);
    } finally {
      setLoading(false);
    }
  }, [lexClient]);

  return { messages, sendMessage, loading };
};