import React from 'react';

const Card = ({ children, title, subtitle, extra, className = "" }) => (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-xl p-5 backdrop-blur-sm ${className}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-slate-100 font-semibold">{title}</h3>
                {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
            </div>
            {extra}
        </div>
        {children}
    </div>
);

export default Card;
