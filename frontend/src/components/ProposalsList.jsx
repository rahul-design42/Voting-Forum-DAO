import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PubKeyContext } from '../App';
import { ProposalCard } from './ProposalCard';
import { viewForumStats, viewProposal } from '../utils/Soroban';
import { Wallet, FileQuestion, RefreshCw, Loader2 } from 'lucide-react';

/* Inline skeleton for loading state */
function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-3.5">
      <div className="flex gap-2"><div className="skeleton h-5 w-16"/><div className="skeleton h-5 w-8"/></div>
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-1.5 w-full rounded-full" />
      <div className="flex gap-2">
        <div className="skeleton h-10 flex-1 rounded-lg" />
        <div className="skeleton h-10 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

export function ProposalsList({ setGlobalStats, refreshTrigger }) {
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

  if (!pubKey) return (
    <div className="card p-12 flex flex-col items-center gap-3 text-center" role="status">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
        <Wallet size={22} className="text-gray-400" />
      </div>
      <h3 className="font-semibold text-primary text-sm">Connect Wallet</h3>
      <p className="text-xs text-muted max-w-xs">Connect your Freighter wallet to view governance proposals on the Stellar network.</p>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading proposals">
      {[1,2,3].map(i => <SkeletonCard key={i} />)}
    </div>
  );

  if (error) return (
    <div className="card p-8 flex flex-col items-center gap-3 text-center border-red-100 bg-red-50" role="alert">
      <p className="text-sm text-red-600">{error}</p>
      <button onClick={loadData} className="btn-ghost !text-red-600 !border-red-200">
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  );

  if (proposals.length === 0) return (
    <div className="card p-12 flex flex-col items-center gap-3 text-center" role="status">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
        <FileQuestion size={22} className="text-gray-400" />
      </div>
      <h3 className="font-semibold text-primary text-sm">No Proposals Yet</h3>
      <p className="text-xs text-muted">Be the first to submit a governance proposal.</p>
    </div>
  );

  return (
    <AnimatePresence>
      <div className="flex flex-col gap-4" role="list" aria-label="Governance proposals">
        {proposals.map((p, i) => (
          <div role="listitem" key={Number(p.proposal_id)}>
            <ProposalCard proposal={p} index={i} onUpdate={loadData} />
          </div>
        ))}
      </div>
    </AnimatePresence>
  );
}
