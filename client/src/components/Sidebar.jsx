import React from 'react';
import {
    LayoutDashboard,
    Users,
    Home,
    BarChart3,
    Settings,
    TrendingUp
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, id, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="w-64 border-r border-slate-800 flex flex-col p-4 space-y-8 bg-[#020617]">
            <div className="flex items-center space-x-3 px-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <TrendingUp size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white italic">
                    Prop<span className="text-blue-500">Pulse</span>
                </span>
            </div>

            <nav className="flex-1 space-y-2">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem icon={Users} label="Leads Pipeline" id="leads" activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem icon={Home} label="Property Inventory" id="inventory" activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem icon={BarChart3} label="Sales Analytics" id="analytics" activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem icon={Settings} label="System Settings" id="settings" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">JD</div>
                    <div>
                        <p className="text-xs font-semibold text-white">Admin User</p>
                        <p className="text-[10px] text-slate-500">Sales Controller</p>
                    </div>
                </div>
                <button className="w-full text-[10px] py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors">Sign Out</button>
            </div>
        </aside>
    );
};

export default Sidebar;
