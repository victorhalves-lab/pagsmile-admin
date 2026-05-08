import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ChevronRight } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const dimensions = [
  { id: 'volume', label: 'GMV', color: '#3b82f6' },
  { id: 'transactions', label: 'Transações', color: '#8b5cf6' },
  { id: 'growth', label: 'Crescimento', color: '#10b981' },
  { id: 'risk', label: 'Risco', color: '#ef4444' },
];

export default function Top10WithFilter({ subaccounts = [] }) {
  const [dimension, setDimension] = useState('volume');

  const data = useMemo(() => {
    const sorted = [...subaccounts];
    
    switch (dimension) {
      case 'volume':
        sorted.sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0));
        break;
      case 'transactions':
        sorted.sort((a, b) => (b.total_transactions || 0) - (a.total_transactions || 0));
        break;
      case 'growth':
        // Mock growth: use revenue_current_month / total_volume as proxy
        sorted.sort((a, b) => {
          const aGrowth = (a.revenue_current_month || 0) / (a.total_volume || 1);
          const bGrowth = (b.revenue_current_month || 0) / (b.total_volume || 1);
          return bGrowth - aGrowth;
        });
        break;
      case 'risk':
        sorted.sort((a, b) => (b.avg_chargeback_ratio || 0) - (a.avg_chargeback_ratio || 0));
        break;
      default:
        break;
    }

    return sorted.slice(0, 10).map(s => ({
      name: s.business_name?.slice(0, 18) || 'N/A',
      volume: s.total_volume || 0,
      transactions: s.total_transactions || 0,
      growth: ((s.revenue_current_month || 0) / (s.total_volume || 1)) * 100,
      risk: (s.avg_chargeback_ratio || 0) * 100,
    }));
  }, [subaccounts, dimension]);

  const currentDim = dimensions.find(d => d.id === dimension);

  const getValue = (item) => {
    switch (dimension) {
      case 'volume': return formatCurrency(item.volume);
      case 'transactions': return item.transactions.toLocaleString('pt-BR');
      case 'growth': return `${item.growth.toFixed(1)}%`;
      case 'risk': return `${item.risk.toFixed(2)}%`;
      default: return '-';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-lg">Top 10 Subcontas</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={dimension} onValueChange={setDimension}>
              <TabsList className="h-8">
                {dimensions.map(d => (
                  <TabsTrigger key={d.id} value={d.id} className="text-xs h-6">
                    {d.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" asChild>
              <Link to={createPageUrl('SubaccountsList')}>
                Ver Todas
                <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number"
                tickFormatter={(value) => {
                  if (dimension === 'volume') return `${(value / 1000).toFixed(0)}k`;
                  if (dimension === 'growth' || dimension === 'risk') return `${value.toFixed(1)}%`;
                  return value;
                }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip 
                formatter={(value) => {
                  if (dimension === 'volume') return formatCurrency(value);
                  if (dimension === 'growth' || dimension === 'risk') return `${value.toFixed(2)}%`;
                  return value.toLocaleString('pt-BR');
                }}
              />
              <Bar dataKey={dimension} radius={[0, 4, 4, 0]}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={currentDim?.color || '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}