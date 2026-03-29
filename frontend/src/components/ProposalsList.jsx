import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PubKeyContext } from '../App';
import { ProposalCard } from './ProposalCard';
import { viewForumStats, viewProposal } from '../utils/Soroban';
import { Wallet, FileQuestion, RefreshCw } from 'lucide-react';

/* Inline skeleton matching new card design */
function SkeletonCard() {
  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-center"><div className="skeleton h-4 w-32"/><div className="skeleton h-6 w-20 rounded-full"/></div>
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-4 w-4/6" />
      <div className="flex gap-8 mt-4">
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-2 w-full rounded-full" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-[-8px]"><div className="skeleton h-8 w-8 rounded-full"/><div className="skeleton h-8 w-8 rounded-full"/></div>
        <div className="skeleton h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function ProposalsList({ setGlobalStats, refreshTrigger, limit, hideHeader, onViewAll, searchQuery }) {
  const pubKey = useContext(PubKeyContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const loadData = async () => {
    if (!pubKey) { setLoading(false); return; }
    console.log("[ProposalsList] loadData: fetching stats and proposals...");
    setLoading(true); setError('');
    try {
      const stats = await viewForumStats(pubKey);
      console.log("[ProposalsList] Raw stats from contract:", stats);
      if (stats) {
        const mapped = {
          total:    Number(stats.total_proposals    ?? 0),
          active:   Number(stats.active_proposals   ?? 0),
          passed:   Number(stats.passed_proposals   ?? 0),
          rejected: Number(stats.rejected_proposals ?? 0),
        };
        console.log("[ProposalsList] Mapped stats:", mapped);
        setGlobalStats(mapped);
        const list = [];
        for (let i = mapped.total; i > 0; i--) {
          try {
            console.log(`[ProposalsList] Fetching proposal #${i}...`);
            const p = await viewProposal(pubKey, i);
            console.log(`[ProposalsList] Proposal #${i} data:`, p);
            if (p) list.push(p);
          } catch (err) {
            console.error(`[ProposalsList] Failed to fetch proposal #${i}:`, err);
          }
        }
        console.log(`[ProposalsList] Total proposals loaded: ${list.length}`);
        setProposals(list);
      } else {
        console.warn("[ProposalsList] viewForumStats returned null/undefined");
      }
    } catch (err) {
      console.error("[ProposalsList] loadData error:", err);
      setError('Failed to load proposals. Check network and contract.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [pubKey, refreshTrigger]);

  const header = hideHeader ? null : (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-primary tracking-tight">Active Proposals</h2>
      <button 
        onClick={(e) => { e.preventDefault(); if (onViewAll) onViewAll(); }}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
      >
        View All Proposals
      </button>
    </div>
  );

  const filteredProposals = proposals.filter((p) => 
    !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displayedProposals = limit ? filteredProposals.slice(0, limit) : filteredProposals;

  if (!pubKey) return (
    <>
      {header}
      <div className="card p-12 flex flex-col items-center gap-3 text-center border-dashed" role="status">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
          <Wallet size={20} className="text-slate-400" />
        </div>
        <h3 className="font-semibold text-primary text-sm">Connect Wallet</h3>
        <p className="text-xs text-muted max-w-xs">Connect your Freighter wallet to view governance proposals on the Stellar network.</p>
      </div>
    </>
  );

  if (loading) return (
    <>
      {header}
      <div className="flex flex-col gap-6" role="status" aria-label="Loading proposals">
        {[1,2].map(i => <SkeletonCard key={i} />)}
      </div>
    </>
  );

  if (error) return (
    <>
      {header}
      <div className="card p-8 flex flex-col items-center gap-3 text-center border-red-100 bg-red-50" role="alert">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={loadData} className="btn-ghost !text-red-600 !border-red-200 !bg-white">
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    </>
  );

  if (proposals.length === 0) return (
    <>
      {header}
      <div className="card p-12 flex flex-col items-center gap-3 text-center border-dashed" role="status">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
          <FileQuestion size={20} className="text-slate-400" />
        </div>
        <h3 className="font-semibold text-primary text-sm">No Proposals Yet</h3>
        <p className="text-xs text-muted">Be the first to submit a governance proposal.</p>
      </div>
    </>
  );

  return (
    <>
      {header}
      <AnimatePresence>
        <div className="flex flex-col gap-6" role="list" aria-label="Governance proposals">
          {displayedProposals.map((p, i) => (
            <div role="listitem" key={Number(p.proposal_id)}>
              <ProposalCard proposal={p} index={i} onUpdate={loadData} />
            </div>
          ))}
        </div>
      </AnimatePresence>
    </>
  );
}
