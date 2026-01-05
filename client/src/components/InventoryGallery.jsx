import React, { useState } from 'react';
import { Home, ChevronRight, Plus, Filter, CheckCircle, XCircle } from 'lucide-react';
import StatsOverview from './StatsOverview';
import AddPropertyModal from './AddPropertyModal';
import PropertyDetailsModal from './PropertyDetailsModal';

const InventoryGallery = ({ inventory = [], leads = [], searchTerm = '', onCreateProperty, onUpdate, onNavigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Filter Inventory
    const filteredInventory = inventory.filter(item => {
        const title = (item.title || '').toLowerCase();
        const location = (item.location || '').toLowerCase();
        const type = (item.type || '').toLowerCase();
        const search = searchTerm.toLowerCase();

        const matchesSearch = title.includes(search) ||
            location.includes(search) ||
            type.includes(search);

        const matchesType = filterType === 'All' || item.type === filterType;
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Filter Leads (for Stats)
    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = (item) => {
        const newStatus = item.status === 'Available' ? 'Booked' : 'Available';
        if (onUpdate) {
            onUpdate(item.id, { status: newStatus });
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex space-x-3">
                    {/* Type Filter */}
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-8 text-xs appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-slate-300 font-medium"
                        >
                            <option value="All">All Types</option>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Land">Land</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg py-2 px-4 text-xs appearance-none focus:outline-none focus:border-blue-500 cursor-pointer text-slate-300 font-medium"
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Add New Card */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-blue-500 transition-colors cursor-pointer group h-full min-h-[300px] order-first md:order-last"
                >
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                        <Plus size={24} className="group-hover:text-white" />
                    </div>
                    <span className="font-semibold text-sm">Add New Property</span>
                </div>

                {filteredInventory.map(item => (
                    <div key={item.id} className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all flex flex-col">
                        <div className="h-40 bg-slate-800 relative flex items-center justify-center">
                            <span className={`absolute top-3 right-3 text-[9px] px-2 py-1 rounded-full font-bold uppercase ${item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                                {item.status}
                            </span>
                            <Home size={48} className="text-slate-700" />

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-[2px]">
                                <button
                                    onClick={() => handleToggleStatus(item)}
                                    title={item.status === 'Available' ? "Mark as Booked" : "Mark as Available"}
                                    className="p-2 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform"
                                >
                                    {item.status === 'Available' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-bold truncate pr-2">{item.title}</h4>
                                <span className="text-blue-400 font-bold text-sm whitespace-nowrap">
                                    ${(item.price / 1000).toFixed(0)}k
                                </span>
                            </div>
                            <p className="text-slate-500 text-xs mb-4 line-clamp-1">{item.location}</p>
                            <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800">
                                <span className="text-xs font-medium text-slate-300">{item.type}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProperty(item);
                                    }}
                                    className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors text-white"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddPropertyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={onCreateProperty}
            />

            <PropertyDetailsModal
                isOpen={!!selectedProperty}
                onClose={() => setSelectedProperty(null)}
                property={selectedProperty}
                onUpdate={onUpdate}
            />
        </div>
    );
};

export default InventoryGallery;
