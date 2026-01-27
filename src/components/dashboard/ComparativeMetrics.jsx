import React from 'react';
import { cn } from '@/lib/utils';
import { CreditCard, QrCode, TrendingUp, DollarSign, Hash } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function ComparativeMetrics({ transactions = [] }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value || 0);
  };

  // Calculate metrics
  const approved = transactions.filter(t => t.status === 'approved');
  
  const cardTx = approved.filter(t => t.type === 'card');
  const pixTx = approved.filter(t => t.type === 'pix');
  
  const cardVolume = cardTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const pixVolume = pixTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const cardTicket = cardTx.length > 0 ? cardVolume / cardTx.length : 0;
  const pixTicket = pixTx.length > 0 ? pixVolume / pixTx.length : 0;

  // Approval for card vs conversion for pix
  const totalCard = transactions.filter(t => t.type === 'card');
  const cardApproved = totalCard.filter(t => t.status === 'approved');
  const cardApprovalRate = totalCard.length > 0 ? (cardApproved.length / totalCard.length) * 100 : 0;
  
  // For Pix, conversion rate (in real app, track QR generated vs paid)
  const pixConversionRate = 85.5; // Mock

  const comparisons = [
    {
      label: 'Volume',
      card: cardVolume,
      pix: pixVolume,
      format: 'currency',
      icon: DollarSign
    },
    {
      label: 'Quantidade',
      card: cardTx.length,
      pix: pixTx.length,
      format: 'number',
      icon: Hash
    },
    {
      label: 'Ticket Médio',
      card: cardTicket,
      pix: pixTicket,
      format: 'currency',
      icon: TrendingUp
    },
    {
      label: 'Conversão',
      card: cardApprovalRate,
      pix: pixConversionRate,
      format: 'percentage',
      icon: TrendingUp
    }
  ];

  const formatValue = (val, format) => {
    if (format === 'currency') return formatCurrency(val);
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    return new Intl.NumberFormat('pt-BR').format(val);
  };

  const chartData = comparisons.map(c => ({
    name: c.label,
    Cartão: c.format === 'currency' || c.format === 'number' ? c.card : c.card,
    Pix: c.format === 'currency' || c.format === 'number' ? c.pix : c.pix,
    format: c.format
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const format = payload[0].payload.format;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900 mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600">{entry.name}</span>
              </div>
              <span className="font-semibold">{formatValue(entry.value, format)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900">Comparativo Cartão vs Pix</h3>
        <p className="text-sm text-gray-500">Análise lado a lado dos métodos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {comparisons.map((comp) => {
          const Icon = comp.icon;
          const cardHigher = comp.card > comp.pix;
          const difference = Math.abs(comp.card - comp.pix);
          const percentDiff = comp.pix > 0 ? ((difference / comp.pix) * 100) : 0;

          return (
            <div key={comp.label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500">{comp.label}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Cartão</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatValue(comp.card, comp.format)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Pix</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatValue(comp.pix, comp.format)}
                  </span>
                </div>
              </div>
              {difference > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {cardHigher ? 'Cartão' : 'Pix'}{' '}
                    <span className={cn(
                      "font-semibold",
                      cardHigher ? 'text-blue-600' : 'text-teal-600'
                    )}>
                      {percentDiff.toFixed(0)}% maior
                    </span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparative Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Cartão" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Pix" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}