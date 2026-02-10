import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const AnalyticsBarChart = ({ data, dataKey = "views", layout = "vertical" }) => {
    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout={layout} margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={layout === "vertical" ? false : true} vertical={layout === "horizontal" ? false : true} stroke="#f1f5f9" />
                    <XAxis 
                        type={layout === "vertical" ? "number" : "category"} 
                        dataKey={layout === "horizontal" ? "name" : undefined}
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <YAxis 
                        type={layout === "vertical" ? "category" : "number"}
                        dataKey={layout === "vertical" ? "name" : undefined}
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                        }} 
                    />
                    <Bar dataKey={dataKey} radius={[0, 10, 10, 0]} fill="#6366f1">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsBarChart;
