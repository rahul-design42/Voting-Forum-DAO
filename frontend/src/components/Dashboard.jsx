import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Zap, CheckCircle2, XCircle } from 'lucide-react';

const stats = [
  { key:'total',    label:'Total Proposals', icon: BarChart3,    accent:'text-blue-500',    bg:'bg-blue-50',    bar:'bg-blue-400' },
  { key:'active',   label:'Active',          icon: Zap,          accent:'text-amber-500',   bg:'bg-amber-50',   bar:'bg-amber-400' },
  { key:'passed',   label:'Passed',          icon: CheckCircle2, accent:'text-emerald-600', bg:'bg-emerald-50', bar:'bg-emerald-500' },
  { key:'rejected', label:'Rejected',        icon: XCircle,      accent:'text-red-500',     bg:'bg-red-50',     bar:'bg-red-400' },
];

export function Dashboard({ stats: data }) {
  const total = data.total || 1;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-6xl mx-auto">
      {stats.map((s, i) => {
        const Icon = s.icon;
        const pct  = Math.round(((data[s.key] ?? 0) / total) * 100);
        return (
          <motion.div key={s.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <Icon size={16} className={s.accent} />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-3">
              {data[s.key] ?? 0}
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
                className={`h-full rounded-full ${s.bar}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
