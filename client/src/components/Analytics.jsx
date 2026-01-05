import React from 'react';
import Card from './ui/Card';

const Analytics = () => {
    // Mock data for visual verification
    const varianceData = [40, 65, 35, 90, 55, 75, 85];
    const sourceData = [
        { source: "Google Ads", count: 45, color: "bg-blue-500" },
        { source: "Facebook", count: 32, color: "bg-sky-500" },
        { source: "Referrals", count: 18, color: "bg-emerald-500" },
        { source: "Instagram", count: 5, color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Sales Pipeline Variance" subtitle="Monthly Revenue Change" className="lg:col-span-2">
                    <div className="h-64 flex items-end justify-between space-x-2 pt-4 px-4">
                        {varianceData.map((h, i) => (
                            <div key={i} className="w-full group relative flex flex-col justify-end h-full">
                                <div
                                    style={{ height: `${h}%` }}
                                    className={`w-full rounded-t-sm transition-all duration-500 group-hover:bg-blue-400 ${i === 6 ? 'bg-blue-600' : 'bg-slate-800'}`}
                                ></div>
                                <span className="text-center mt-2 text-[10px] text-slate-500">M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Lead Sources" subtitle="Platform Distribution">
                    <div className="space-y-6 pt-4">
                        {sourceData.map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">{s.source}</span>
                                    <span className="text-white font-semibold">{s.count}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div style={{ width: `${s.count}%` }} className={`h-full ${s.color}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Commission / Revenue Section Mock */}
            <Card title="Revenue & Commission Stats" subtitle="Pending vs Approved Deals">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <p className="text-slate-500 text-xs">Total Commission</p>
                        <h3 className="text-xl font-bold text-white mt-1">$124,500</h3>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <p className="text-slate-500 text-xs">Pending Approval</p>
                        <h3 className="text-xl font-bold text-amber-500 mt-1">$45,200</h3>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <p className="text-slate-500 text-xs">Approved Deals</p>
                        <h3 className="text-xl font-bold text-emerald-500 mt-1">12</h3>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
