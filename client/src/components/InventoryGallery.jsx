import React from 'react';
import { Home, ChevronRight, Plus } from 'lucide-react';

const InventoryGallery = ({ inventory }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inventory.map(item => (
                <div key={item.id} className="group bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
                    <div className="h-40 bg-slate-800 relative flex items-center justify-center">
                        <span className={`absolute top-3 right-3 text-[9px] px-2 py-1 rounded-full font-bold uppercase ${item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                            {item.status}
                        </span>
                        <Home size={48} className="text-slate-700" />
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-bold">{item.title}</h4>
                            <span className="text-blue-400 font-bold text-sm">
                                ${(item.price / 1000).toFixed(0)}k
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs mb-4">{item.location}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                            <span className="text-xs font-medium text-slate-300">{item.type}</span>
                            <button className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors text-white">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-blue-500 transition-colors cursor-pointer group h-full min-h-[250px]">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                    <Plus size={24} className="group-hover:text-white" />
                </div>
                <span className="font-semibold text-sm">Add New Property</span>
            </div>
        </div>
    );
};

export default InventoryGallery;
