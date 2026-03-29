import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProposalsList } from './components/ProposalsList';
import { CreateProposal } from './components/CreateProposal';
import { Shield } from 'lucide-react';

export const PubKeyContext = React.createContext();

function App() {
  const [pubKey, setPubKey]   = useState('');
  const [stats, setStats]     = useState({ total:0, active:0, passed:0, rejected:0 });
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="min-h-screen text-primary" style={{ background: '#F8FAF9' }}>
      <div className="w-full max-w-[1440px] mx-auto px-6 py-8 md:px-12 md:py-12">
        <PubKeyContext.Provider value={pubKey}>

          {/* Navigation Header */}
          <Header pubKey={pubKey} setPubKey={setPubKey} />

          {/* Hero Section */}
          <motion.section
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.08, duration:0.4 }}
            className="card mb-10 px-10 py-12 bg-white flex flex-col items-center text-center w-full"
            style={{ borderTop: '4px solid #10B981' }}
            aria-label="Hero section"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="tag flex items-center gap-1 mb-2 bg-emerald-50 px-3 py-1.5 rounded-full text-emerald-700 font-bold tracking-wide">
                <Shield size={12} className="text-emerald-500" /> Stellar Blockchain · Soroban
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight">
                Decentralised Governance Forum
              </h1>
              <p className="text-base md:text-lg text-secondary max-w-2xl leading-relaxed">
                Create proposals, cast votes, and collectively shape community decisions — transparently on-chain with no central authority.
              </p>
            </div>
          </motion.section>

          {/* Stats Dashboard */}
          <Dashboard stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Proposals feed */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-primary">Live Proposals</h2>
                <span className="bg-white border rounded-full px-3 py-1 text-xs font-semibold shadow-sm">{stats.total} total</span>
              </div>
              <ProposalsList setGlobalStats={setStats} refreshTrigger={refresh} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CreateProposal onProposalCreated={() => setRefresh(r => r + 1)} />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">
              Built on <a href="https://stellar.org" target="_blank" rel="noreferrer" className="text-emerald-600 font-semibold hover:underline">Stellar</a> using the Soroban SDK
            </p>
            <p className="font-mono text-[10px] text-gray-300 tracking-wider">
              CONTRACT: CAVULOT…QFJIVIY
            </p>
          </footer>

        </PubKeyContext.Provider>
      </div>
    </div>
  );
}

export default App;
