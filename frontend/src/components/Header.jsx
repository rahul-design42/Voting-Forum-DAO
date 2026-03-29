import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkConnection, retrievePublicKey, getRequestAccess, getBalance } from "../utils/Freighter";
import { Wallet, Zap, CheckCircle2 } from "lucide-react";

export function Header({ pubKey, setPubKey }) {
  const [balance, setBalance] = useState("0");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (pubKey) getBalance().then(setBalance);
  }, [pubKey]);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      if (await checkConnection()) {
        let key = await retrievePublicKey();
        if (!key) { await getRequestAccess(); key = await retrievePublicKey(); }
        setPubKey(key);
      } else {
        await getRequestAccess();
        setPubKey(await retrievePublicKey());
      }
    } catch {
      alert("Install Freighter Wallet and set it to Testnet.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <header className="w-full max-w-6xl mx-auto mb-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-flat px-6 py-3.5 flex justify-between items-center"
        style={{ borderRadius: 12 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Zap size={15} fill="white" className="text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-primary" style={{ letterSpacing: '-0.02em' }}>
              VotingForum
            </span>
            <span className="ml-1.5 text-xs font-medium text-gray-400">DAO</span>
          </div>
        </div>

        {/* Network pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700">Stellar Testnet</span>
        </div>

        {/* Wallet */}
        <AnimatePresence mode="wait">
          {pubKey ? (
            <motion.div key="connected" initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200"
            >
              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 leading-none">{balance} XLM</p>
                <p className="text-xs font-semibold text-gray-700 leading-none mt-0.5">
                  {pubKey.slice(0,5)}…{pubKey.slice(-5)}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.button key="disconnected" initial={{ opacity:0 }} animate={{ opacity:1 }}
              onClick={connectWallet} disabled={connecting}
              className="btn-primary"
            >
              <Wallet size={15} />
              {connecting ? "Connecting…" : "Connect Wallet"}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
