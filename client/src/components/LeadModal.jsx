import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const LeadModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        budget: '',
        project: '',
        source: 'Manual'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', phone: '', email: '', budget: '', project: '', source: 'Manual' }); // Reset
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">New Lead Entry</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                            <input
                                required
                                type="tel"
                                placeholder="+1 234..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Budget ($)</label>
                            <input
                                required
                                type="number"
                                placeholder="500000"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Project Interest</label>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        >
                            <option value="">Select Project...</option>
                            <option value="Skyline Tower">Skyline Tower</option>
                            <option value="Ocean View">Ocean View</option>
                            <option value="Central Mall">Central Mall</option>
                            <option value="Sunset Villas">Sunset Villas</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                            <Save size={18} />
                            <span>Create Lead Record</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadModal;
