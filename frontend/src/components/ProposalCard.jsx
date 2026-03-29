import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PubKeyContext } from '../App';
import { castVote, closeProposal } from '../utils/Soroban';
import { CheckCircle2, Clock, Users, Shield, Lock, Loader2, AlertCircle } from 'lucide-react';

// Random avatars for the mockup feel
const avatars = [
  "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  "https://i.pravatar.cc/150?u=a042581f4e29026703d",
];

export function ProposalCard({ proposal, index, onUpdate }) {
  const pubKey = useContext(PubKeyContext);
  const [loadingVote, setLoadingVote] = useState(null);
  const [loadingClose, setLoadingClose] = useState(false);
  const [error, setError] = useState('');
  const [votedStatus, setVotedStatus] = useState(null);

  const active   = proposal.is_active;
  const id       = Number(proposal.proposal_id);
  const targetScale = 60; // Random target quorum scale for UI demo purposes
  const forVotes = Number(proposal.votes_for     ?? 0);
  const against  = Number(proposal.votes_against ?? 0);
  const total    = forVotes + against || 1;
  const forPct   = Math.round((forVotes / total) * 100);
  
  // Fake quorum metric based on total votes to make it look like the mockup
  const quorumPct = Math.min(100, Math.round((total / targetScale) * 100));

  useEffect(() => {
    if (pubKey) {
      const stored = localStorage.getItem(`vote_${pubKey}_${id}`);
      if (stored) setVotedStatus(stored);
    }
  }, [pubKey, id]);

  const handleVote = async (favour) => {
    if (!pubKey) { setError('Connect your wallet to vote.'); return; }
    console.log(`[ProposalCard] Voting ${favour ? 'FOR' : 'AGAINST'} proposal #${id}`);
    setLoadingVote(favour ? 'for' : 'against'); setError('');
    try {
      await castVote(pubKey, id, favour);
      console.log(`[ProposalCard] Vote recorded successfully`);
      const statusStr = favour ? 'Yes' : 'No';
      localStorage.setItem(`vote_${pubKey}_${id}`, statusStr);
      setVotedStatus(statusStr);
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('[ProposalCard] Vote failed:', err);
      setError('Vote failed. Check wallet and network.');
    }
    finally   { setLoadingVote(null); }
  };

  const handleClose = async () => {
    if (!pubKey) return;
    console.log(`[ProposalCard] Closing proposal #${id}`);
    setLoadingClose(true); setError('');
    try {
      await closeProposal(pubKey, id);
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
      className={`card p-6 flex flex-col gap-5 border-l-4 ${active ? 'border-emerald-500' : 'border-slate-300'}`}
      style={{ borderLeftWidth: '3px' }}
      aria-label={`Proposal: ${proposal.title}`}
    >
      {/* Top Tag & Badge */}
      <div className="flex items-start justify-between gap-3">
        <span className="tag text-muted">
          PROP-{id} &bull; GOVERNANCE
        </span>
        
        {active ? (
          <span className="badge badge-active flex items-center gap-1">VOTING ACTIVE</span>
        ) : proposal.is_passed ? (
          <span className="badge badge-passed flex items-center gap-1">PASSED</span>
        ) : (
          <span className="badge badge-rejected flex items-center gap-1">REJECTED</span>
        )}
      </div>

      {/* Title & description */}
      <div>
        <h3 className="font-bold text-xl text-primary leading-snug mb-2">
          {proposal.title}
        </h3>
        <p className="text-sm text-secondary leading-relaxed line-clamp-2">
          {proposal.descrip}
        </p>
      </div>

      {/* Progress Bars (Yes / Quorum) */}
      <div className="grid grid-cols-2 gap-8 items-end mt-1">
        {/* YES Votes */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-primary mb-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500"/> Yes</span>
            <span>{forPct}%</span>
          </div>
          <div className="vote-bar">
            <motion.div className="vote-bar-success" initial={{ width: 0 }} animate={{ width: `${forPct}%` }} transition={{ duration: 0.7 }} />
          </div>
        </div>

        {/* Quorum */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-primary mb-2">
            <span className="flex items-center gap-1.5"><Users size={14} className="text-blue-600"/> Quorum</span>
            <span>{quorumPct}% / 60%</span>
          </div>
          <div className="vote-bar">
            <motion.div className="vote-bar-fill border-blue-600" style={{ background: '#3B82F6' }} initial={{ width: 0 }} animate={{ width: `${quorumPct}%` }} transition={{ duration: 0.7 }} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg" role="alert">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Footer Area */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            <img src={avatars[0]} className="w-6 h-6 rounded-full border border-white" alt="Voter" />
            <img src={avatars[1]} className="w-6 h-6 rounded-full border border-white" alt="Voter" />
            <div className="w-6 h-6 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
              +{total}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {active && (
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <Clock size={13} /> 2d 14h left
            </span>
          )}

          {active && !votedStatus && (
            <div className="flex gap-2">
              <button
                disabled={!!loadingVote || !pubKey}
                onClick={() => handleVote(true)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-lg text-sm font-semibold transition-colors
                  ${(!pubKey) ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                {loadingVote === 'for' ? <Loader2 size={14} className="animate-spin" /> : 'Cast Yes'}
              </button>
              <button
                disabled={!!loadingVote || !pubKey}
                onClick={() => handleVote(false)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-lg text-sm font-semibold transition-colors
                  ${(!pubKey) ? 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
              >
                {loadingVote === 'against' ? <Loader2 size={14} className="animate-spin" /> : 'Cast No'}
              </button>
            </div>
          )}

          {active && votedStatus && (
            <div className="flex items-center justify-center gap-2 py-1.5 px-4 rounded-lg text-sm font-semibold bg-gray-50 text-gray-700 border border-gray-200">
              <CheckCircle2 size={14} className="text-emerald-500" />
              You voted {votedStatus}
            </div>
          )}

          {/* Admin finalize button */}
          {active && (
            <button onClick={handleClose} disabled={loadingClose || !pubKey}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
              title="Close voting and finalize outcome (Admin)"
            >
              {loadingClose ? <Loader2 size={13} className="animate-spin" /> : <Shield size={13} />}
              Finalize
            </button>
          )}

        </div>
      </div>
    </motion.div>
  );
}
