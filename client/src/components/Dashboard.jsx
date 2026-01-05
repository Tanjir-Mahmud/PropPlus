import React, { useMemo } from 'react';
import { DollarSign, Users, Home, TrendingUp, TrendingDown } from 'lucide-react';
import Card from './ui/Card';

const Dashboard = ({ leads = [], inventory = [] }) => {
    // Configuration
    const GLOBAL_COMMISSION_RATE = 3.5;

    // 1. Pipeline Value Calculation
    // Filter: New, Contacted, Site Visit, Negotiation
    const pipelineValue = useMemo(() => {
        const activeStages = ['New', 'Contacted', 'Site Visit', 'Negotiation'];
        return leads
            .filter(lead => activeStages.includes(lead.status))
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

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Pipeline Value */}
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
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
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <Users size={20} />
                    </div>
                    <p className="text-slate-500 text-xs mb-1 font-medium">Active Leads</p>
                    <h4 className="text-2xl font-bold text-white transition-all duration-300">
                        {activeLeadsCount}
                    </h4>
                </div>

                {/* Total Inventory */}
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                    <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center mb-3">
                        <Home size={20} />
                    </div>
                    <p className="text-slate-500 text-xs mb-1 font-medium">Total Inventory</p>
                    <h4 className="text-2xl font-bold text-white transition-all duration-300">
                        {inventory.length}
                    </h4>
                </div>

                {/* Estimated Revenue */}
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center mb-3">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-slate-500 text-xs mb-1 font-medium">Est. Revenue ({GLOBAL_COMMISSION_RATE}%)</p>
                    <h4 className="text-2xl font-bold text-white transition-all duration-300">
                        {formatCurrency(estimatedRevenue)}
                    </h4>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Sales Pipeline Variance" subtitle="Monthly Revenue Change" className="lg:col-span-2">
                    <div className="h-48 flex items-end justify-between space-x-2 pt-4">
                        {[40, 65, 35, 90, 55, 75, 85].map((h, i) => (
                            <div key={i} className="w-full group relative">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full rounded-t-sm transition-all duration-500 group-hover:bg-blue-400 ${i === 6 ? 'bg-blue-600' : 'bg-slate-800'}`}
                                ></div>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Lead Sources" subtitle="Platform Distribution">
                    <div className="space-y-4 pt-2">
                        {[
                            { source: "Google Ads", count: 45, color: "bg-blue-500" },
                            { source: "Facebook", count: 32, color: "bg-sky-500" },
                            { source: "Referrals", count: 18, color: "bg-emerald-500" },
                            { source: "Instagram", count: 5, color: "bg-purple-500" },
                        ].map((s, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">{s.source}</span>
                                    <span className="text-white font-semibold">{s.count}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                    <div style={{ width: `${s.count}%` }} className={`h-full ${s.color}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
