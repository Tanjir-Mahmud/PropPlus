import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import LeadsPipeline from './LeadsPipeline';
import InventoryGallery from './InventoryGallery';
import Analytics from './Analytics';
import Settings from './Settings';
import LeadModal from './LeadModal';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const MainLayout = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [leads, setLeads] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [deals, setDeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        // Direct users path for proper permissions
        const userPath = `users/${currentUser.uid}`;

        const handleDataLoad = () => setIsLoading(false);
        const handleError = (context, err) => {
            console.error(`Error fetching ${context}:`, err);
            setIsLoading(false);
        };

        // Listen for Leads
        const unsubLeads = onSnapshot(
            collection(db, userPath, 'leads'),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLeads(data);
                handleDataLoad();
            },
            (err) => handleError('leads', err)
        );

        // Listen for Inventory
        const unsubInventory = onSnapshot(
            collection(db, userPath, 'inventory'),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setInventory(data);
                handleDataLoad();
            },
            (err) => handleError('inventory', err)
        );

        // Listen for Deals
        const unsubDeals = onSnapshot(
            collection(db, userPath, 'deals'),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDeals(data);
                handleDataLoad();
            },
            (err) => handleError('deals', err)
        );

        return () => {
            unsubLeads();
            unsubInventory();
            unsubDeals();
        };
    }, [currentUser]);

    const handleCreateLead = async (leadData) => {
        if (!currentUser) return;
        const userPath = `users/${currentUser.uid}`;
        try {
            await addDoc(collection(db, userPath, 'leads'), {
                ...leadData,
                status: 'New',
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Failed to create lead", error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!currentUser) return;
        const userPath = `users/${currentUser.uid}`;
        try {
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));

            await updateDoc(doc(db, userPath, 'leads', id), { status: newStatus });

            if (newStatus === 'Closed') {
                const lead = leads.find(l => l.id === id);
                if (lead && lead.propertyId) {
                    try {
                        await addDoc(collection(db, userPath, 'deals'), {
                            propertyId: lead.propertyId,
                            leadId: lead.id,
                            amount: lead.budget || 0,
                            date: serverTimestamp()
                        });
                        await updateDoc(doc(db, userPath, 'inventory', lead.propertyId), { status: 'Sold' });
                    } catch (err) {
                        console.error("Failed to process deal automation", err);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleCreateProperty = async (propertyData) => {
        if (!currentUser) return;
        const userPath = `users/${currentUser.uid}`;
        try {
            await addDoc(collection(db, userPath, 'inventory'), propertyData);
        } catch (error) {
            console.error("Failed to create property", error);
        }
    };

    const handleUpdateProperty = async (id, updateData) => {
        if (!currentUser) return;
        const userPath = `users/${currentUser.uid}`;
        try {
            await updateDoc(doc(db, userPath, 'inventory', id), updateData);
        } catch (error) {
            console.error("Failed to update property", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <LeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateLead}
                inventory={inventory}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-10">
                    <h2 className="text-lg font-semibold capitalize text-white">{activeTab.replace('-', ' ')}</h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative flex items-center space-x-2">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search leads, properties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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

                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-slate-500">Loading PropPulse Data...</div>
                    ) : (
                        <>
                            {activeTab === 'dashboard' && (
                                leads.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                        <div className="p-6 bg-slate-900 rounded-full">
                                            <Plus size={48} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Welcome to PropPulse</h2>
                                            <p className="text-slate-400 max-w-md">Your dashboard is ready. Start by adding your first lead to track your pipeline.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center space-x-2"
                                        >
                                            <Plus size={20} />
                                            <span>Create Your First Lead</span>
                                        </button>
                                    </div>
                                ) : (
                                    <Dashboard leads={leads} inventory={inventory} deals={deals} searchTerm={searchTerm} onNavigate={setActiveTab} />
                                )
                            )}
                            {activeTab === 'leads' && <LeadsPipeline leads={leads} searchTerm={searchTerm} onCreateLead={() => setIsModalOpen(true)} onUpdateStatus={handleUpdateStatus} />}
                            {activeTab === 'inventory' && <InventoryGallery inventory={inventory} leads={leads} searchTerm={searchTerm} onCreateProperty={handleCreateProperty} onUpdate={handleUpdateProperty} onNavigate={setActiveTab} />}
                            {activeTab === 'analytics' && <Analytics deals={deals} leads={leads} />}
                            {activeTab === 'settings' && <Settings onDataImported={() => { }} />}
                        </>
                    )}
                </div>

                {/* DEBUG BAR - REMOVE LATER */}
                <div className="bg-slate-900 border-t border-slate-800 p-2 text-[10px] text-slate-500 flex justify-between px-4 font-mono">
                    <span>UID: {currentUser?.uid || 'Not Logged In'}</span>
                    <span>Leads: {leads.length} | Inventory: {inventory.length}</span>
                    <span>Loading: {isLoading ? 'Yes' : 'No'}</span>
                    <span>Path: users/{currentUser?.uid}/...</span>
                </div>

            </main>
        </div>
    );
};

export default MainLayout;
