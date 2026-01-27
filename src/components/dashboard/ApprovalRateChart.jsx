import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import { cn } from '@/lib/utils';

export default function ApprovalRateChart({ data = [], target = 85, className }) {
  // Mock data if no data provided
  const chartData = data.length > 0 ? data : [
    { name: 'Visa', rate: 92.5 },
    { name: 'Master', rate: 88.3 },
    { name: 'Elo', rate: 85.1 },
    { name: 'Amex', rate: 79.8 },
    { name: 'Hiper', rate: 82.4 },
    { name: 'Pix', rate: 98.5 },
  ];

  const getBarColor = (rate) => {
    if (rate >= target) return '#00D26A';
    if (rate >= target - 10) return '#FBBF24';
    return '#EF4444';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const rate = payload[0].value;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className={cn(
            "text-lg font-bold",
            rate >= target ? "text-emerald-600" : rate >= target - 10 ? "text-yellow-600" : "text-red-600"
          )}>
            {rate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">
            {rate >= target ? '✓ Acima da meta' : `${(target - rate).toFixed(1)}% abaixo da meta`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickFormatter={(value) => `${value}%`}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={target} 
            stroke="#6B7280" 
            strokeDasharray="5 5" 
            label={{ 
              value: `Meta ${target}%`, 
              position: 'right',
              fontSize: 11,
              fill: '#6B7280'
            }}
          />
          <Bar 
            dataKey="rate" 
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}