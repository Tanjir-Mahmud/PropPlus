import StatsOverview from './StatsOverview';
import Card from './ui/Card';

const Dashboard = ({ leads = [], inventory = [], searchTerm = '', onNavigate }) => {
    // Filter Inventory for Dashboard
    const filteredInventory = inventory.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter Leads for Dashboard
    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.source?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <StatsOverview leads={filteredLeads} inventory={filteredInventory} onNavigate={onNavigate} />

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
