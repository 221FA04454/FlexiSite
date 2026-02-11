import React from 'react';
import { Card, CardContent } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, icon: LucideIcon, trend, color, bg }) => {
    const isPositive = trend.startsWith('+');
    
    return (
        <Card className="!border-none !shadow-sm !rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-2xl ${bg} ${color}`}>
                        <LucideIcon size={24} />
                    </div>
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-pink-50 text-pink-600'}`}>
                            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
