import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProposalsList } from './components/ProposalsList';
import { CreateProposal } from './components/CreateProposal';
import { 
  ActiveVotesView, HistoryView, DelegationView, 
  SettingsView, EcosystemView, TreasuryView, AnalyticsView 
} from './components/Views';
import { Shield } from 'lucide-react';

export const PubKeyContext = React.createContext();

function App() {
  const [pubKey, setPubKey]   = useState('');
  const [stats, setStats]     = useState({ total:0, active:0, passed:0, rejected:0 });
  const [refresh, setRefresh] = useState(0);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const renderView = () => {
    switch(currentView) {
      case 'Active Votes': return <ActiveVotesView setGlobalStats={setStats} refreshTrigger={refresh} searchQuery={searchQuery} />;
      case 'History':      return <HistoryView />;
      case 'Delegation':   return <DelegationView />;
      case 'Settings':     return <SettingsView />;
      case 'Ecosystem':    return <EcosystemView />;
      case 'Treasury':     return <TreasuryView />;
      case 'Analytics':    return <AnalyticsView />;
      case 'Dashboard':
      default:
        return (
          <>
            {/* Page Title & Subtitle */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-2">
                Network Governance
              </h1>
              <p className="text-secondary opacity-90 text-sm md:text-base max-w-2xl">
                Decentralized oversight of the Soroban network parameters and ecosystem development grants. Transparency through cryptography.
              </p>
            </div>

            {/* Stats Dashboard */}
            <Dashboard stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 xl:gap-12">
              {/* Proposals feed (Left column) */}
              <div className="flex flex-col gap-5">
                <ProposalsList 
                  setGlobalStats={setStats} 
                  refreshTrigger={refresh} 
                  limit={3} 
                  searchQuery={searchQuery}
                  onViewAll={() => setCurrentView('Active Votes')} 
                />
              </div>

              {/* Sidebar/Forms (Right column) */}
              <div className="flex flex-col gap-6">
                <CreateProposal onProposalCreated={() => setRefresh(r => r + 1)} />
                
                {/* Delegate Voting Power Promo Card */}
                <div className="card bg-blue-50/50 border-blue-100 p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Shield size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-primary mb-1">Delegate your voting power</h3>
                    <p className="text-xs text-secondary leading-relaxed mb-3">
                      Don't have time to review every proposal? Delegate to a trusted community expert.
                    </p>
                    <button onClick={() => setCurrentView('Delegation')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      Browse Delegates &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <PubKeyContext.Provider value={pubKey}>
      <div className="layout-container font-sans text-primary">
        
        {/* Sidebar Left */}
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content Area */}
        <div className="main-content">
          
          {/* Top Header */}
          <Header pubKey={pubKey} setPubKey={setPubKey} currentView={currentView} setCurrentView={setCurrentView} setSearchQuery={setSearchQuery} />

          {/* Page Content */}
          <main className="px-8 py-8 md:px-12 w-full max-w-7xl mx-auto">
            {renderView()}
          </main>
        </div>
      </div>
    </PubKeyContext.Provider>
  );
}

export default App;
