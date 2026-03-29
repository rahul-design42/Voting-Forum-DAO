import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { key:'total',    label:'Total Proposals', accent:'border-blue-500',   subtext:'~ +12% from last epoch', subtextColor:'text-blue-600' },
  { key:'active',   label:'Active Votes',    accent:'border-emerald-500', subtext:'Current quorum: 68%',   subtextColor:'text-emerald-600' },
  { key:'passed',   label:'Passed',          accent:'border-emerald-700', subtext:'Execution rate: 99.2%', subtextColor:'text-secondary' },
  { key:'rejected', label:'Rejected',        accent:'border-red-500',     subtext:'Last rejection: 3 days ago', subtextColor:'text-secondary' },
];

export function Dashboard({ stats: data }) {
  // To simulate the mockup numbers, we could use the real data, but the user mockup has large numbers.
  // We'll use the real data from the contract.
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 w-full">
      {stats.map((s, i) => {
        const val = data[s.key] ?? 0;
        
        return (
          <motion.div key={s.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`card p-5 xl:p-6 border-l-4 ${s.accent}`}
            style={{ borderLeftWidth: '3px' }}
          >
            <h3 className="text-xs font-semibold text-secondary mb-2">{s.label}</h3>
            
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-3">
              {val > 0 ? val.toLocaleString() : "0"}
            </div>
            
            <div className={`text-[11px] font-medium ${s.subtextColor}`}>
              {s.subtext}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
