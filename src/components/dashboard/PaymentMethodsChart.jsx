import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const COLORS = {
  card: '#3B82F6',
  pix: '#2bc196',
};

export default function PaymentMethodsChart({ data = [], className }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Cartão', value: 65, amount: 152340.50 },
    { name: 'Pix', value: 35, amount: 82150.75 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value}% das vendas</p>
          <p className="text-sm font-semibold text-[#2bc196]">
            {formatCurrency(payload[0].payload.amount)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? COLORS.card : COLORS.pix}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-6 mt-4">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: index === 0 ? COLORS.card : COLORS.pix }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
            <span className="text-sm font-semibold">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}