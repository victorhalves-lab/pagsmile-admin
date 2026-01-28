import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';

export default function VolumeChart({ data = [], period = '7d', className }) {
  // Mock data if no data provided
  const chartData = data.length > 0 ? data : [
    { date: '20/01', card: 45200, pix: 23100, total: 68300 },
    { date: '21/01', card: 52100, pix: 28400, total: 80500 },
    { date: '22/01', card: 48700, pix: 31200, total: 79900 },
    { date: '23/01', card: 61300, pix: 35600, total: 96900 },
    { date: '24/01', card: 55800, pix: 29800, total: 85600 },
    { date: '25/01', card: 67200, pix: 38100, total: 105300 },
    { date: '26/01', card: 72500, pix: 41200, total: 113700 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">{entry.name}</span>
              </div>
              <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("h-72", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPix" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2bc196" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2bc196" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => formatCurrency(value)}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="card"
            name="Cartão"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCard)"
          />
          <Area
            type="monotone"
            dataKey="pix"
            name="Pix"
            stroke="#2bc196"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPix)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}