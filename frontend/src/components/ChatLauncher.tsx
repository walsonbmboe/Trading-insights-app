import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LexRuntimeV2Client } from "@aws-sdk/client-lex-runtime-v2";
import { LexChat } from "./LexChat";

interface Props {
  lexClient: LexRuntimeV2Client;
}

export default function ChatLauncher({ lexClient }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed top-12 right-12 z-[999] w-14 h-14 rounded-full shadow-xl
                     bg-gradient-to-r from-blue-600 to-purple-600
                     flex items-center justify-center text-white text-2xl"
        >
          AI
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed top-10 right-6 z-[1000]"
          >
            <LexChat lexClient={lexClient} onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
