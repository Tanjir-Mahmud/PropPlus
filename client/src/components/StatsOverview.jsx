import React, { useMemo } from 'react';
import { DollarSign, Users, Home, TrendingUp, TrendingDown } from 'lucide-react';

const StatsOverview = ({ leads = [], inventory = [], onNavigate }) => {
    // Configuration
    const GLOBAL_COMMISSION_RATE = 3.5;

    // 1. Pipeline Value Calculation
    // Filter: Exclude Closed and Lost
    const pipelineValue = useMemo(() => {
        const inactiveStages = ['Closed', 'Lost'];
        return leads
            .filter(lead => !inactiveStages.includes(lead.status))
            .reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
    }, [leads]);

    // 2. Active Leads Tracking
    // Status is NOT Closed or Lost
    const activeLeadsCount = useMemo(() => {
        const inactiveStages = ['Closed', 'Lost'];
        return leads.filter(lead => !inactiveStages.includes(lead.status)).length;
    }, [leads]);

    // 3. Estimated Revenue
    const estimatedRevenue = (pipelineValue * GLOBAL_COMMISSION_RATE) / 100;

    // 4. Variance Reporting (Mock Logic for "Previous Month")
    const previousPipelineValue = pipelineValue > 0 ? pipelineValue * 0.85 : 0;
    const isPositiveVariance = pipelineValue >= previousPipelineValue;

    // Formatters
    const formatCurrency = (val) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
        return `$${val.toFixed(0)}`;
    };

    const handleCardClick = (tabId) => {
        if (onNavigate) {
            onNavigate(tabId);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Pipeline Value */}
            <div
                onClick={() => handleCardClick('leads')}
                className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all active:scale-[0.98]"
            >
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center mb-3">
                        <DollarSign size={20} />
                    </div>
                    <div className={`flex items-center space-x-1 text-xs font-bold ${isPositiveVariance ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isPositiveVariance ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>15%</span>
                    </div>
                </div>
                <p className="text-slate-500 text-xs mb-1 font-medium">Pipeline Value</p>
                <h4 className="text-2xl font-bold text-white transition-all duration-300">
                    {formatCurrency(pipelineValue)}
                </h4>
            </div>

            {/* Active Leads */}
            <div
                onClick={() => handleCardClick('leads')}
                className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-slate-900/80 transition-all active:scale-[0.98]"
            >
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-3">
                    <Users size={20} />
                </div>
                <p className="text-slate-500 text-xs mb-1 font-medium">Active Leads</p>
                <h4 className="text-2xl font-bold text-white transition-all duration-300">
                    {activeLeadsCount}
                </h4>
            </div>

            {/* Total Inventory */}
            <div
                onClick={() => handleCardClick('inventory')}
                className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-purple-500/50 hover:bg-slate-900/80 transition-all active:scale-[0.98]"
            >
                <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-3">
                    <Home size={20} />
                </div>
                <p className="text-slate-500 text-xs mb-1 font-medium">Total Inventory</p>
                <h4 className="text-2xl font-bold text-white transition-all duration-300">
                    {inventory.length}
                </h4>
            </div>

            {/* Estimated Revenue */}
            <div
                onClick={() => handleCardClick('analytics')}
                className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl cursor-pointer hover:border-amber-500/50 hover:bg-slate-900/80 transition-all active:scale-[0.98]"
            >
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp size={20} />
                </div>
                <p className="text-slate-500 text-xs mb-1 font-medium">Est. Revenue ({GLOBAL_COMMISSION_RATE}%)</p>
                <h4 className="text-2xl font-bold text-white transition-all duration-300">
                    {formatCurrency(estimatedRevenue)}
                </h4>
            </div>
        </div>
    );
};

export default StatsOverview;
