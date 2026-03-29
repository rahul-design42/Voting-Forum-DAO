import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkConnection, retrievePublicKey, getRequestAccess, getBalance } from "../utils/Freighter";
import { Wallet, Bell, Settings as SettingsIcon, Search } from "lucide-react";

export function Header({ pubKey, setPubKey, currentView, setCurrentView, setSearchQuery }) {
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

  const navClass = (viewName) => 
    `text-sm font-medium border-b-2 py-1 transition-colors ${currentView === viewName ? 'text-primary border-primary' : 'text-secondary border-transparent hover:text-primary'}`;

  return (
    <header className="header-top">
      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6">
        <button onClick={() => setCurrentView('Active Votes')} className={navClass('Active Votes')}>Proposals</button>
        <button onClick={() => setCurrentView('Ecosystem')} className={navClass('Ecosystem')}>Ecosystem</button>
        <button onClick={() => setCurrentView('Treasury')} className={navClass('Treasury')}>Treasury</button>
        <button onClick={() => setCurrentView('Analytics')} className={navClass('Analytics')}>Analytics</button>
      </nav>

      {/* Right Side Tools */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* Search */}
        <div className="relative hidden lg:block w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search proposals..." 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-secondary hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
            <Bell size={18} />
          </button>
          <button 
            onClick={() => setCurrentView('Settings')}
            className={`p-2 rounded-lg transition-colors ${currentView === 'Settings' ? 'bg-slate-100 text-primary' : 'text-secondary hover:text-primary hover:bg-slate-50'}`}
          >
            <SettingsIcon size={18} />
          </button>
        </div>

        {/* Wallet */}
        <div className="ml-2">
          <AnimatePresence mode="wait">
            {pubKey ? (
              <motion.div key="connected" initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-blue-50/50 border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Wallet size={12} />
                </div>
                <div>
                  <p className="text-[10px] text-blue-600 font-semibold leading-none">{balance} XLM</p>
                  <p className="text-xs font-bold text-slate-800 leading-none mt-0.5">
                    {pubKey.slice(0,4)}…{pubKey.slice(-4)}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.button key="disconnected" initial={{ opacity:0 }} animate={{ opacity:1 }}
                onClick={connectWallet} disabled={connecting}
                className="btn-primary !py-2 !px-4 !text-sm"
              >
                {connecting ? "Connecting…" : "Connect Wallet"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
