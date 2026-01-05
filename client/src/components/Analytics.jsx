import React from 'react';
import Card from './ui/Card';

const Analytics = ({ deals = [], leads = [] }) => {
    // Calculate Monthly Revenue Logic
    const getMonthlyRevenueData = () => {
        const months = 7;
        const revenueData = new Array(months).fill(0);
        const today = new Date();

        deals.forEach(deal => {
            const dealDate = new Date(deal.date);
            const monthDiff = (today.getFullYear() - dealDate.getFullYear()) * 12 + (today.getMonth() - dealDate.getMonth());

            if (monthDiff >= 0 && monthDiff < months) {
                const index = months - 1 - monthDiff;
                revenueData[index] += Number(deal.amount || 0);
            }
        });
        return revenueData;
    };

    const varianceData = getMonthlyRevenueData();
    const maxRevenue = Math.max(...varianceData, 100000);

    // Calculate Lead Sources Logic
    const getSourceData = () => {
        const sourceCounts = {};
        let totalLeads = 0;

        leads.forEach(lead => {
            const source = lead.source || 'Other';
            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            totalLeads++;
        });

        const sortedSources = Object.entries(sourceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4); // Top 4 sources

        // Define colors for known sources, fallback for others
        const colors = {
            'Google Ads': 'bg-blue-500',
            'Facebook': 'bg-sky-500',
            'Referrals': 'bg-emerald-500',
            'Instagram': 'bg-purple-500',
            'Manual': 'bg-slate-500',
            'Google Sheets': 'bg-green-500'
        };

        return sortedSources.map(([source, count]) => ({
            source,
            count: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
            color: colors[source] || 'bg-slate-400'
        }));
    };

    const sourceData = getSourceData();

    // Generate last 7 months
    const getMonthLabels = () => {
        const months = [];
        const date = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }
        return months;
    };
    const monthLabels = getMonthLabels();

    // Calculate Commission Stats
    const getCommissionStats = () => {
        let totalCommission = 0;
        let pendingApproval = 0;
        let approvedDealsCount = 0;
        const COMMISSION_RATE = 0.025; // 2.5%

        deals.forEach(deal => {
            const commission = Number(deal.amount || 0) * COMMISSION_RATE;
            totalCommission += commission;

            if (deal.status === 'Pending') {
                pendingApproval += commission;
            } else if (deal.status === 'Approved') {
                approvedDealsCount++;
            }
        });

        return { totalCommission, pendingApproval, approvedDealsCount };
    };

    const { totalCommission, pendingApproval, approvedDealsCount } = getCommissionStats();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Sales Pipeline Variance" subtitle="Monthly Revenue Change" className="lg:col-span-2">
                    <div className="h-64 flex items-end justify-between space-x-2 pt-4 px-4">
                        {varianceData.map((val, i) => {
                            const heightPercentage = Math.min((val / maxRevenue) * 100, 100);
                            return (
                                <div key={i} className="w-full group relative flex flex-col justify-end h-full">
                                    <div className="flex justify-center mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full w-full">
                                        <span className="bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                            ${(val / 1000).toFixed(1)}k
                                        </span>
                                    </div>
                                    <div
                                        style={{ height: `${heightPercentage}%` }}
                                        className={`w-full rounded-t-sm transition-all duration-500 group-hover:bg-blue-400 ${i === 6 ? 'bg-blue-600' : 'bg-slate-800'}`}
                                    ></div>
                                    <span className="text-center mt-2 text-[10px] text-slate-500 uppercase">{monthLabels[i]}</span>
                                </div>
                            );
                        })}
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

            {/* Commission / Revenue Section */}
            <Card title="Revenue & Commission Stats" subtitle="Pending vs Approved Deals">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <p className="text-slate-500 text-xs">Total Commission</p>
                        <h3 className="text-xl font-bold text-white mt-1">${totalCommission.toLocaleString()}</h3>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <p className="text-slate-500 text-xs">Pending Approval</p>
                        <h3 className="text-xl font-bold text-amber-500 mt-1">${pendingApproval.toLocaleString()}</h3>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                        <p className="text-slate-500 text-xs">Approved Deals</p>
                        <h3 className="text-xl font-bold text-emerald-500 mt-1">{approvedDealsCount}</h3>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
