import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { PubKeyContext } from '../App';
import { createProposal } from '../utils/Soroban';
import { Loader2, AlertCircle } from 'lucide-react';

export function CreateProposal({ onProposalCreated }) {
  const pubKey   = useContext(PubKeyContext);
  const [title, setTitle]     = useState('');
  const [desc, setDesc]       = useState('');
  const [funding, setFunding] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!pubKey) { setError('Connect your wallet first.'); return; }
    
    const finalDesc = funding.trim() ? `${desc}\n\nRequired Funding: ${funding.trim()} XLM` : desc;
    
    console.log(`[CreateProposal] Creating proposal: title="${title}", desc="${finalDesc}"`);
    setLoading(true); setError(''); setSuccess(false);
    try {
      const result = await createProposal(pubKey, title, finalDesc);
      console.log("[CreateProposal] Proposal created successfully, result:", result);
      setTitle(''); setDesc(''); setFunding('');
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
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-primary tracking-tight">New Proposal</h2>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="card p-6 border-t-4 border-t-blue-500"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-5">
          {/* Wallet warning */}
          {!pubKey && (
            <div className="flex items-start gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg text-[11px] font-medium leading-tight">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              Connect your Freighter Wallet to Draft a Proposal.
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2" htmlFor="proposal-title">
              Proposal Title
            </label>
            <input
              id="proposal-title"
              type="text"
              className="input-field bg-slate-50"
              placeholder="e.g. Upgrade SDK for Rust 1.70"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading || !pubKey}
              maxLength={60}
              required
            />
          </div>

          {/* Category Dropdown (Simulated visual only) */}
          <div>
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">
              Category
            </label>
            <select className="input-field bg-slate-50 text-sm appearance-none" disabled={loading || !pubKey}>
              <option>Network Parameter</option>
              <option>Ecosystem Grant</option>
              <option>Core Protocol</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2" htmlFor="proposal-desc">
              Short Description
            </label>
            <textarea
              id="proposal-desc"
              className="input-field bg-slate-50 text-sm leading-relaxed"
              style={{ minHeight: 90, resize: 'none' }}
              placeholder="Describe the purpose and impact of this proposal..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              disabled={loading || !pubKey}
              maxLength={300}
              required
            />
          </div>

          {/* Required Funding */}
          <div>
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2" htmlFor="proposal-funding">
              Required Funding (Optional)
            </label>
            <div className="relative">
              <input
                id="proposal-funding"
                type="number"
                min="0"
                step="any"
                className="input-field bg-slate-50 text-sm pr-12"
                placeholder="0.00"
                value={funding}
                onChange={e => setFunding(e.target.value)}
                disabled={loading || !pubKey}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                XLM
              </span>
            </div>
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
              ✓ Proposal drafted successfully!
            </motion.div>
          )}

          <button
            type="submit"
            className="btn-primary w-full py-3 shadow-md border border-blue-600/20"
            disabled={loading || !pubKey || !title.trim() || !desc.trim()}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Publish Draft'}
          </button>
          
          <p className="text-[10px] text-center text-slate-400 italic">
            Drafting a proposal requires a minimum stake of 1,000 XLM to prevent network spam.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
