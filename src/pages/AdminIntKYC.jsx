import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { 
  ShieldCheck, AlertTriangle, UserCheck, UserX, 
  Search, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

import { mockMetrics } from '@/src/mockData/adminInternoMocks';

export default function AdminIntKYC() {
  // Use centralized mock metrics
  const metrics = {
      pending: mockMetrics.kycPending,
      auto_approved: mockMetrics.kycAutoApproved,
      manual: mockMetrics.kycManual,
      approved_month: mockMetrics.kycApprovedMonth,
      rejected_month: mockMetrics.kycRejectedMonth,
  };

  // Mock Charts Data
  const decisionData = [
      { name: 'Aprovado Auto', value: 72, color: '#10b981' },
      { name: 'Manual', value: 20, color: '#8b5cf6' },
      { name: 'Reprovado', value: 8, color: '#ef4444' },
  ];

  const scoreData = [
      { name: '0-49', value: 8 },
      { name: '50-79', value: 20 },
      { name: '80-100', value: 72 },
  ];

  const redFlags = [
      { reason: 'PEP identificado (sem EDD)', count: 23 },
      { reason: 'Empresa < 1 ano com alto volume', count: 18 },
      { reason: 'Inconsistência em documentos', count: 12 },
      { reason: 'MCC de alto risco sem controles', count: 8 },
      { reason: 'Endereço não confere com CNPJ', count: 6 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="KYC/KYB & Compliance" 
        subtitle="Dashboard de Conformidade"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard 
            title="Pendente Análise" 
            value={metrics.pending} 
            icon={Clock} 
            className="border-blue-200 bg-blue-50 dark:bg-blue-900/20"
        />
        <KPICard 
            title="Manual Necessário" 
            value={metrics.manual} 
            icon={Search} 
            className="border-purple-200 bg-purple-50 dark:bg-purple-900/20"
        />
        <KPICard 
            title="Auto Aprovado" 
            value={`${metrics.auto_approved}%`} // Mock percentage logic
            icon={ShieldCheck} 
            trend="up"
            change="Meta: 70%"
        />
        <KPICard 
            title="Aprovado Mês" 
            value={metrics.approved_month} 
            icon={UserCheck} 
            trend="up"
            change="+15%"
        />
        <KPICard 
            title="Reprovado Mês" 
            value={metrics.rejected_month} 
            icon={UserX} 
            trend="down"
            change="7% total"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Charts */}
          <Card>
              <CardHeader><CardTitle>Resultado das Análises</CardTitle></CardHeader>
              <CardContent>
                  <div className="h-[250px] flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={decisionData} 
                                dataKey="value" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                            >
                                {decisionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                        {decisionData.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm font-medium">{item.name}: {item.value}%</span>
                            </div>
                        ))}
                    </div>
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader><CardTitle>Distribuição de Score HELENA</CardTitle></CardHeader>
              <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={50} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Red Flags */}
      <Card>
          <CardHeader><CardTitle>Red Flags Mais Comuns (30 dias)</CardTitle></CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {redFlags.map((flag, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-400 w-6">#{idx + 1}</span>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{flag.reason}</span>
                          </div>
                          <Badge variant="outline">{flag.count} casos</Badge>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

// Helper icon import
import { Clock } from 'lucide-react';