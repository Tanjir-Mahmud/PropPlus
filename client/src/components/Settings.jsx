import React, { useState } from 'react';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import Card from './ui/Card';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Settings = ({ onDataImported }) => {
    const { currentUser } = useAuth();
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState(null);
    const [importType, setImportType] = useState('leads');

    // Client-side processing removed in favor of Server-side Admin Import to fix permissions


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!currentUser) return setImportStatus({ type: 'error', message: 'User not authenticated' });

        setIsImporting(true);
        setImportStatus(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', importType);
        formData.append('userId', currentUser.uid);

        try {
            const response = await axios.post('/api/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { count } = response.data;
            setImportStatus({ type: 'success', message: `Successfully imported ${count} items.` });
            if (onDataImported) onDataImported();
        } catch (error) {
            console.error("Import Error:", error);
            const msg = error.response?.data?.error || error.message || 'Import failed.';
            setImportStatus({ type: 'error', message: msg });
        } finally {
            setIsImporting(false);
            e.target.value = null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

            {/* Live Sync Section */}
            <Card title="Google Sheets & Forms Sync" subtitle="Connect live data sources via CSV Link">
                <div className="mt-4 p-6 bg-slate-900/50 rounded-xl border border-slate-700 space-y-4">
                    <div className="flex items-start space-x-3 text-sm text-slate-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                        <AlertCircle size={18} className="text-blue-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-blue-200 font-medium mb-1">How to connect:</p>
                            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-xs">
                                <li>Open your Google Sheet (or Form Responses sheet).</li>
                                <li>Go to <b>File &gt; Share &gt; Publish to Web</b>.</li>
                                <li>Select <b>"Entire Document"</b> and format as <b>"Comma-separated values (.csv)"</b>.</li>
                                <li>Copy the generated link and paste it below.</li>
                            </ol>
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <div className="flex-1 relative">
                            <input
                                type="url"
                                placeholder="Paste your Google Sheet CSV Link here..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                                id="sheetUrl"
                            />
                            {importStatus && importStatus.source === 'url' && (
                                <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${importStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {importStatus.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                </div>
                            )}
                        </div>
                        <button
                            disabled={isImporting}
                            onClick={async () => {
                                const url = document.getElementById('sheetUrl').value;
                                if (!url) return;
                                setIsImporting(true);
                                setImportStatus(null);
                                setImportStatus({ type: 'error', message: 'URL Sync pending updates. Use File Import.', source: 'url' });
                            }}
                            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 rounded-lg transition-colors flex items-center space-x-2 shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isImporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Download size={18} />}
                            <span>Sync Now</span>
                        </button>
                    </div>
                </div>
            </Card>

            <Card title="File Import (Legacy)" subtitle="Upload static Excel or CSV files">
                <div className="mb-4">
                    <label className="block text-xs font-medium text-slate-400 mb-2">What are you importing?</label>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setImportType('leads')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'leads' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            Leads
                        </button>
                        <button
                            onClick={() => setImportType('inventory')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${importType === 'inventory' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            Property Inventory
                        </button>
                    </div>
                </div>

                <div className="mt-4 p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-center relative group hover:border-blue-500 transition-colors">
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleFileUpload}
                        disabled={isImporting}
                    />
                    {isImporting ? (
                        <div className="space-y-4 py-4">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm text-blue-400 font-medium italic">Processing data...</p>
                        </div>
                    ) : (
                        <div className="space-y-3 pointer-events-none">
                            <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                                <FileText size={28} />
                            </div>
                            <h4 className="text-white font-semibold">Drop your Excel/CSV here</h4>
                            <p className="text-xs text-slate-500">Supported formats: .xlsx, .xls, .csv</p>
                        </div>
                    )}
                </div>

                {importStatus && importStatus.source !== 'url' && (
                    <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 text-sm ${importStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {importStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        <span>{importStatus.message}</span>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Settings;
