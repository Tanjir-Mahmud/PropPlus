import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeadsPipeline from './components/LeadsPipeline';
import InventoryGallery from './components/InventoryGallery';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import LeadModal from './components/LeadModal';
import axios from 'axios';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch Leads
      const leadsRes = await axios.get('http://localhost:3000/api/leads');
      setLeads(Array.isArray(leadsRes.data) ? leadsRes.data : []);

      // Fetch Inventory
      const invRes = await axios.get('http://localhost:3000/api/inventory');
      setInventory(Array.isArray(invRes.data) ? invRes.data : []);

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateLead = async (leadData) => {
    try {
      const res = await axios.post('http://localhost:3000/api/leads', { ...leadData, status: 'New' });
      setLeads(prev => [...prev, res.data]);
    } catch (error) {
      console.error("Failed to create lead", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    // Optimistic Update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    try {
      await axios.put(`http://localhost:3000/api/leads/${id}`, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      fetchData(); // Revert on error
    }
  };

  const handleSyncLeads = async () => {
    setIsSyncing(true);
    setTimeout(async () => {
      // Simulation: Inject mock leads
      const mockLeads = [
        { name: "Sync Lead 1", budget: 600000, source: "Google Sheets", status: "New", project: "Ocean View", phone: "000" },
        { name: "Sync Lead 2", budget: 950000, source: "Google Sheets", status: "New", project: "Skyline Tower", phone: "000" },
        { name: "Sync Lead 3", budget: 420000, source: "Google Sheets", status: "New", project: "Central Mall", phone: "000" },
      ];

      for (const lead of mockLeads) {
        await handleCreateLead(lead);
      }
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-10">
          <h2 className="text-lg font-semibold capitalize text-white">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center space-x-2">
              {/* Sync Button */}
              <button
                onClick={handleSyncLeads}
                disabled={isSyncing}
                title="Google Sheets Sync"
                className={`p-2 rounded-full transition-all ${isSyncing ? 'bg-green-500/20 text-green-500 animate-spin' : 'hover:bg-slate-800 text-slate-400 hover:text-green-400'}`}
              >
                <RefreshCw size={18} />
              </button>

              <Search size={16} className="absolute left-[3.25rem] top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search leads, properties..."
                className="bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500 w-64 text-slate-200 placeholder-slate-600"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-colors shadow-lg shadow-blue-900/20"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-slate-500">Loading PropPulse Data...</div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard leads={leads} inventory={inventory} />}
              {activeTab === 'leads' && <LeadsPipeline leads={leads} onCreateLead={() => setIsModalOpen(true)} onUpdateStatus={handleUpdateStatus} />}
              {activeTab === 'inventory' && <InventoryGallery inventory={inventory} />}
              {activeTab === 'analytics' && <Analytics />}
              {activeTab === 'settings' && <Settings onDataImported={fetchData} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
