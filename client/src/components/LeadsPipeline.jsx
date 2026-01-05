import React from 'react';
import { Plus, Filter, MoreHorizontal, DollarSign } from 'lucide-react';

const LeadsPipeline = ({ leads, searchTerm = '', onCreateLead, onUpdateStatus }) => {

    const handleStatusChange = async (id, newStatus) => {
        if (onUpdateStatus) {
            onUpdateStatus(id, newStatus);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.project?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <button
                        onClick={onCreateLead}
                        className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg flex items-center space-x-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={14} /> <span>Create Lead</span>
                    </button>
                    <button className="px-4 py-1.5 bg-slate-800 text-white text-xs rounded-lg flex items-center space-x-2 hover:bg-slate-700 transition-colors">
                        <Filter size={14} /> <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
                {['New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed'].map((stage) => (
                    <div key={stage} className="min-w-[280px] w-[280px] flex flex-col space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center space-x-2">
                                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">{stage}</h4>
                                <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
                                    {filteredLeads.filter(l => l.status === stage).length}
                                </span>
                            </div>
                            <MoreHorizontal size={14} className="text-slate-600 cursor-pointer hover:text-slate-400" />
                        </div>

                        <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-800 p-2 space-y-3 overflow-y-auto custom-scrollbar">
                            {filteredLeads.filter(l => l.status === stage).map(lead => (
                                <div key={lead.id} className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all shadow-sm group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${lead.source === 'Google Sheets' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {lead.source}
                                        </span>
                                        {/* Simple Status Mover */}
                                        <select
                                            className="bg-transparent text-[10px] text-slate-500 focus:text-white focus:outline-none cursor-pointer"
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                        >
                                            {['New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed', 'Lost'].map(s => (
                                                <option key={s} value={s} className="bg-slate-900 text-slate-300">{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <h5 className="text-sm font-semibold text-white mb-1">{lead.name}</h5>
                                    <p className="text-[11px] text-slate-400 mb-4">{lead.project || 'No Project'}</p>
                                    <div className="flex justify-between items-center border-t border-slate-700 pt-3">
                                        <div className="flex items-center space-x-1 text-emerald-500">
                                            <DollarSign size={12} />
                                            <span className="text-xs font-bold">
                                                {isNaN(Number(lead.budget)) ? '0' : (Number(lead.budget) / 1000).toFixed(0)}k
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeadsPipeline;
