import React from 'react';
import { motion } from 'framer-motion';
import { History, Users, Settings, Leaf, BarChart2, Coins } from 'lucide-react';
import { ProposalsList } from './ProposalsList';

function PlaceholderView({ title, description, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-primary tracking-tight mb-2 flex items-center gap-3">
          <Icon size={28} className="text-blue-500" /> {title}
        </h1>
        <p className="text-secondary opacity-90 text-sm max-w-2xl">{description}</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-2">
          <Icon size={24} className="text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary">{title} Module</h3>
          <p className="text-sm text-muted max-w-sm mt-1">This section is currently under development. Historical data and settings will be synchronized shortly.</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function ActiveVotesView({ setGlobalStats, refreshTrigger }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-primary tracking-tight mb-2">Active Votes</h1>
        <p className="text-secondary opacity-90 text-sm max-w-2xl">Participate in current network governance decisions.</p>
      </div>
      <ProposalsList setGlobalStats={setGlobalStats} refreshTrigger={refreshTrigger} limit={null} hideHeader />
    </div>
  );
}

export function HistoryView() {
  return <PlaceholderView title="Vote History" description="Review past governance decisions and proposal outcomes." icon={History} />;
}

export function DelegationView() {
  return (
    <PlaceholderView title="Delegation" description="Delegate your voting power to trusted community members." icon={Users}>
      <button className="btn-primary mt-4">Browse Delegates</button>
    </PlaceholderView>
  );
}

export function SettingsView() {
  return <PlaceholderView title="Settings" description="Manage your preferences, notifications, and profile." icon={Settings} />;
}

export function EcosystemView() {
  return <PlaceholderView title="Ecosystem Grants" description="Submit and review funding requests for ecosystem projects." icon={Leaf} />;
}

export function TreasuryView() {
  return <PlaceholderView title="Treasury" description="Transparent view of the DAO's on-chain holdings and allocations." icon={Coins} />;
}

export function AnalyticsView() {
  return <PlaceholderView title="Analytics" description="Network participation metrics and voting trends." icon={BarChart2} />;
}
