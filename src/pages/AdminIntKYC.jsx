import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { 
  ShieldCheck, AlertTriangle, UserCheck, 
  FileText, Clock, XCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function AdminIntKYC() {
  const { data: subaccounts } = useQuery({
    queryKey: ['kyc_dashboard_metrics'],
    queryFn: () => base44.entities.Subaccount.list(1000), 
  });

  const metrics = React.useMemo(() => {
    if (!subaccounts) return { pending: 0, analysis: 0, auto: 0, manual: 0, approved: 0, rejected: 0 };
    return {
      pending: subaccounts.filter(s => s.status === 'kyc_submitted').length,
      analysis: subaccounts.filter(s => s.status === 'kyc_in_analysis').length,
      auto: subaccounts.filter(s => s.kyc_decision === 'approved' && s.ai_red_flags?.length === 0).length,
      manual: subaccounts.filter(s => s.kyc_decision === 'manual_review').length,
      approved: subaccounts.filter(s => s.status === 'kyc_approved').length,
      rejected: subaccounts.filter(s => s.status === 'kyc_rejected').length,
    };
  }, [subaccounts]);

  const distributionData = [
    { name: 'Aprovado', value: metrics.approved, color: '#10b981' },
    { name: 'Manual', value: metrics.manual, color: '#8b5cf6' },
    { name: 'Reprovado', value: metrics.rejected, color: '#ef4444' },
  ];

  const scoreData = [
    { name: '0-49', value: 12 },
    { name: '50-79', value: 25 },
    { name: '80-100', value: 85 },
  ];

  const redFlags = [
    { name: 'PEP identificado (sem EDD)', count: 23 },
    { name: 'Empresa < 1 ano com alto volume', count: 18 },
    { name: 'Inconsistência em documentos', count: 12 },
    { name: 'MCC de alto risco sem controles', count: 8 },
    { name: 'Endereço não confere com CNPJ', count: 6 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="KYC & Compliance" 
        subtitle="Dashboard de Monitoramento"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Pendente" value={metrics.pending} icon={Clock} trend="neutral" change="5 > 48h" />
        <KPICard title="Em Análise" value={metrics.analysis} icon={ShieldCheck} trend="neutral" />
        <KPICard title="Auto Aprovado" value={metrics.auto} icon={UserCheck} trend="up" change="72%" />
        <KPICard title="Manual Nec." value={metrics.manual} icon={FileText} className="border-purple-200 bg-purple-50" />
        <KPICard title="Aprovados" value={metrics.approved} icon={UserCheck} className="border-emerald-200 bg-emerald-50" />
        <KPICard title="Reprovados" value={metrics.rejected} icon={XCircle} className="border-red-200 bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Resultado das Análises</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} label>
                    {distributionData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
               {distributionData.map((d, i) => (
                   <div key={i} className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                       <span className="text-sm">{d.name}</span>
                   </div>
               ))}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Distribuição de Score HELENA</CardTitle></CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader><CardTitle>Red Flags Mais Comuns (30 dias)</CardTitle></CardHeader>
          <CardContent>
              <div className="space-y-4">
                  {redFlags.map((flag, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{idx + 1}. {flag.name}</span>
                          <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{flag.count} casos</span>
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                          </div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}