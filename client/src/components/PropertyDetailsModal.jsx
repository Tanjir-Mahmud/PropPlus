import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Home, Calendar, ShieldCheck, CheckCircle, XCircle, Edit, Save } from 'lucide-react';

const PropertyDetailsModal = ({ isOpen, onClose, property, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Reset when modal opens or property changes
    useEffect(() => {
        if (isOpen && property) {
            setIsEditing(false);
            setFormData({
                title: property.title || '',
                location: property.location || '',
                price: property.price || '',
                type: property.type || '',
                status: property.status || 'Available',
                description: property.description || '' // Assuming there might be a description field eventually
            });
        }
    }, [isOpen, property]);

    if (!isOpen || !property) return null;

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(property.id, formData);
        }
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">

                {/* Header Image Area */}
                <div className="h-48 bg-slate-800 relative flex items-center justify-center bg-grid-slate-700/[0.2]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
                    <Home size={64} className="text-slate-600/50" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors backdrop-blur-md z-10"
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-4 left-6 flex space-x-2">
                        {isEditing ? (
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="Available">Available</option>
                                <option value="Booked">Booked</option>
                                <option value="Sold">Sold</option>
                            </select>
                        ) : (
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${property.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                {property.status === 'Available' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                <span>{property.status}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 mr-4">
                            {isEditing ? (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Property Title"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} className="text-blue-500" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="bg-transparent border-b border-slate-700 text-slate-300 focus:outline-none focus:border-blue-500 text-sm w-full"
                                            placeholder="Location"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-white mb-2">{property.title}</h2>
                                    <div className="flex items-center text-slate-400 space-x-2">
                                        <MapPin size={16} className="text-blue-500" />
                                        <span>{property.location}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="text-right">
                            {isEditing ? (
                                <div className="space-y-2 flex flex-col items-end">
                                    <div className="flex items-center">
                                        <span className="text-lg mr-1 text-slate-500">$</span>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right text-xl font-bold text-blue-400 focus:outline-none focus:border-blue-500 w-32"
                                        />
                                    </div>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Land">Land</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div className="text-3xl font-bold text-blue-400 flex items-center justify-end">
                                        <span className="text-lg mr-1">$</span>
                                        {(property.price / 1000).toLocaleString()}k
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium uppercase tracking-widest">{property.type}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Listed Date</p>
                                <p className="text-sm font-semibold text-slate-200">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Verification</p>
                                <p className="text-sm font-semibold text-slate-200">Verified Listing</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">Description</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            This premium {formData.type?.toLowerCase() || property.type.toLowerCase()} located in the heart of {formData.location || property.location} offers exceptional value.
                            Features include modern amenities, proximity to key landmarks, and a high potential for appreciation.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all flex items-center space-x-2"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center space-x-2"
                            >
                                <Edit size={16} />
                                <span>Edit Details</span>
                            </button>
                            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all">
                                Contact Agent
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsModal;
