import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle, Clock, Ban } from 'lucide-react';

export default function MerchantSummary({ stats, onFilterByStatus }) {
  const summaryItems = [
    {
      label: 'Total',
      value: stats.total || 0,
      icon: Building2,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      filter: null
    },
    {
      label: 'Ativos',
      value: stats.active || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      filter: ['active']
    },
    {
      label: 'Em Análise',
      value: (stats.kyc_pending || 0) + (stats.kyc_incomplete || 0),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      filter: ['kyc_pending', 'kyc_incomplete'],
      tooltip: `KYC Pendente: ${stats.kyc_pending || 0} | Doc. Incompleta: ${stats.kyc_incomplete || 0}`
    },
    {
      label: 'Bloqueados',
      value: (stats.blocked || 0) + (stats.suspended || 0),
      icon: Ban,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      filter: ['blocked', 'suspended'],
      tooltip: `Bloqueados: ${stats.blocked || 0} | Suspensos: ${stats.suspended || 0}`
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {summaryItems.map((item) => (
        <Card
          key={item.label}
          className={`cursor-pointer hover:shadow-md transition-shadow ${item.filter ? 'hover:border-blue-300' : ''}`}
          onClick={() => item.filter && onFilterByStatus(item.filter)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-2xl font-bold">{item.value.toLocaleString('pt-BR')}</p>
              </div>
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
            {item.filter && (
              <p className="text-xs text-slate-400 mt-2">Clique para filtrar</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}