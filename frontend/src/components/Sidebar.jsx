import React from 'react';
import { LayoutDashboard, CheckSquare, Clock, Users, Settings, FileText, HelpCircle } from 'lucide-react';

export function Sidebar({ currentView, setCurrentView }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="p-6 border-b border-gray-100/60">
        <h1 className="text-xl font-bold text-primary tracking-tight flex items-center gap-1.5">
          Transparent DAO
        </h1>
      </div>

      <div className="px-6 py-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">Governance</h2>
        <p className="text-[10px] text-muted mb-4">Institutional Terminal</p>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={currentView === 'Dashboard'} onClick={() => setCurrentView('Dashboard')} />
          <NavItem icon={CheckSquare} label="Active Votes" active={currentView === 'Active Votes'} onClick={() => setCurrentView('Active Votes')} />
          <NavItem icon={Clock} label="History" active={currentView === 'History'} onClick={() => setCurrentView('History')} />
          <NavItem icon={Users} label="Delegation" active={currentView === 'Delegation'} onClick={() => setCurrentView('Delegation')} />
        </nav>
      </div>

      {/* Footer Links */}
      <div className="mt-auto p-6 flex flex-col gap-3">
        <a href="#" className="flex items-center gap-2.5 text-sm font-medium text-secondary hover:text-primary transition-colors">
          <FileText size={16} /> Docs
        </a>
        <a href="#" className="flex items-center gap-2.5 text-sm font-medium text-secondary hover:text-primary transition-colors">
          <HelpCircle size={16} /> Support
        </a>
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-blue-50/50 text-blue-600' 
          : 'text-secondary hover:bg-slate-50 hover:text-primary'
      }`}
    >
      <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
      {label}
    </button>
  );
}
