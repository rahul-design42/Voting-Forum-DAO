import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PubKeyContext } from '../App';
import { castVote, closeProposal } from '../utils/Soroban';
import { ThumbsUp, ThumbsDown, Lock, Loader2, AlertCircle } from 'lucide-react';

export function ProposalCard({ proposal, index, onUpdate }) {
  const pubKey = useContext(PubKeyContext);
  const [loadingVote, setLoadingVote] = useState(null);
  const [loadingClose, setLoadingClose] = useState(false);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);

  const active   = proposal.is_active;
  const forVotes = Number(proposal.votes_for     ?? 0);
  const against  = Number(proposal.votes_against ?? 0);
  const total    = forVotes + against || 1;
  const forPct   = Math.round((forVotes / total) * 100);

  const handleVote = async (favour) => {
    if (!pubKey) { setError('Connect your wallet to vote.'); return; }
    console.log(`[ProposalCard] Voting ${favour ? 'FOR' : 'AGAINST'} proposal #${proposal.proposal_id}`);
    setLoadingVote(favour ? 'for' : 'against'); setError('');
    try {
      await castVote(pubKey, Number(proposal.proposal_id), favour);
      console.log(`[ProposalCard] Vote recorded successfully`);
      setVoted(true);
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('[ProposalCard] Vote failed:', err);
      setError('Vote failed. Check wallet and network.');
    }
    finally   { setLoadingVote(null); }
  };

  const handleClose = async () => {
    if (!pubKey) return;
    console.log(`[ProposalCard] Closing proposal #${proposal.proposal_id}`);
    setLoadingClose(true); setError('');
    try {
      await closeProposal(pubKey, Number(proposal.proposal_id));
      console.log(`[ProposalCard] Proposal closed successfully`);
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('[ProposalCard] Close failed:', err);
      setError('Close failed.');
    }
    finally { setLoadingClose(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="card p-5 flex flex-col gap-3.5"
      aria-label={`Proposal: ${proposal.title}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {active
            ? <span className="badge badge-active">● Active</span>
            : proposal.is_passed
              ? <span className="badge badge-passed">✓ Passed</span>
              : <span className="badge badge-rejected">✕ Rejected</span>
          }
          <span className="badge badge-id">#{Number(proposal.proposal_id)}</span>
        </div>

        {active && (
          <button onClick={handleClose} disabled={loadingClose || !pubKey}
            className="btn-ghost !py-1.5 !px-2.5 !text-xs shrink-0"
            aria-label="Close this proposal"
          >
            {loadingClose ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />}
            Close
          </button>
        )}
      </div>

      {/* Title & description */}
      <div>
        <h3 className="font-semibold text-base text-primary leading-snug mb-1.5">
          {proposal.title}
        </h3>
        <p className="text-sm text-secondary leading-relaxed">{proposal.descrip}</p>
      </div>

      <hr className="divider" />

      {/* Vote counts + bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-emerald-600">{forVotes} For  ({forPct}%)</span>
          <span className="text-muted">{forVotes + against} votes total</span>
          <span className="text-red-500">{against} Against</span>
        </div>
        <div className="vote-bar">
          <motion.div
            className="vote-bar-for"
            initial={{ width: 0 }}
            animate={{ width: `${forPct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg" role="alert">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Vote buttons */}
      {active && (
        <div className="flex gap-2.5 pt-0.5">
          <button
            disabled={!!loadingVote || !pubKey || voted}
            onClick={() => handleVote(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors duration-150
              ${(!pubKey || voted) ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
            aria-label="Vote in favour"
          >
            {loadingVote === 'for' ? <Loader2 size={15} className="animate-spin" /> : <ThumbsUp size={15} />}
            For
          </button>
          <button
            disabled={!!loadingVote || !pubKey || voted}
            onClick={() => handleVote(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors duration-150
              ${(!pubKey || voted) ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
            aria-label="Vote against"
          >
            {loadingVote === 'against' ? <Loader2 size={15} className="animate-spin" /> : <ThumbsDown size={15} />}
            Against
          </button>
        </div>
      )}

      {/* Success toast */}
      <AnimatePresence>
        {voted && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-center"
          >
            ✓ Vote recorded on-chain
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
