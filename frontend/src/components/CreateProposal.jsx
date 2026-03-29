import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { PubKeyContext } from '../App';
import { createProposal } from '../utils/Soroban';
import { Send, Loader2, AlertCircle, FilePlus2 } from 'lucide-react';

export function CreateProposal({ onProposalCreated }) {
  const pubKey   = useContext(PubKeyContext);
  const [title, setTitle]     = useState('');
  const [desc, setDesc]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!pubKey) { setError('Connect your wallet first.'); return; }
    console.log(`[CreateProposal] Creating proposal: title="${title}", desc="${desc}"`);
    setLoading(true); setError(''); setSuccess(false);
    try {
      const result = await createProposal(pubKey, title, desc);
      console.log("[CreateProposal] Proposal created successfully, result:", result);
      setTitle(''); setDesc('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      if (onProposalCreated) onProposalCreated();
    } catch (err) {
      console.error("[CreateProposal] Failed to create proposal:", err);
      setError('Transaction failed. Ensure Freighter is on Testnet with sufficient XLM.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="card overflow-hidden sticky top-4"
    >
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <FilePlus2 size={16} className="text-emerald-600" />
        <div>
          <h2 className="text-sm font-bold text-primary">New Proposal</h2>
          <p className="text-xs text-muted mt-0.5">Submit governance on-chain</p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Wallet warning */}
        {!pubKey && (
          <div className="flex items-start gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2.5 rounded-lg text-xs">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            Connect Freighter Wallet to create proposals.
          </div>
        )}

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5" htmlFor="proposal-title">
              Title
            </label>
            <input
              id="proposal-title"
              type="text"
              className="input-field"
              placeholder="Short, descriptive title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading || !pubKey}
              maxLength={60}
              required
            />
            <p className="text-[11px] text-muted text-right mt-1">{title.length}/60</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5" htmlFor="proposal-desc">
              Description
            </label>
            <textarea
              id="proposal-desc"
              className="input-field"
              style={{ minHeight: 110, resize: 'none' }}
              placeholder="Explain the rationale, expected impact, and steps..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              disabled={loading || !pubKey}
              maxLength={300}
              required
            />
            <p className={`text-[11px] text-right mt-1 ${(300 - desc.length) < 30 ? 'text-red-500' : 'text-muted'}`}>
              {300 - desc.length} chars remaining
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg" role="alert">
              <AlertCircle size={12} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-center"
            >
              ✓ Proposal deployed to chain!
            </motion.div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !pubKey || !title.trim() || !desc.trim()}
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Submitting…</>
              : <><Send size={15} /> Deploy Proposal</>
            }
          </button>
        </form>

        {/* Footer tags */}
        <div className="pt-1 flex items-center gap-3 justify-center">
          {['Transparent', 'Immutable', 'On-Chain'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
