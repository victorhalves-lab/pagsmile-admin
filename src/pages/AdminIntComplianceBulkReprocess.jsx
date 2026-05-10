import React, { useState } from 'react';
import { RefreshCcw, Play, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const mockJobs = [
  { id: 'j_001', name: 'Reprocessar Marketplace V3 → V4', target: 'Casos com modelo V3 do segmento marketplace', total: 142, processed: 142, failed: 3, status: 'completed', started_at: '2026-05-08 14:20', completed_at: '2026-05-08 14:32' },
  { id: 'j_002', name: 'Recalcular Score após mudança de pesos', target: 'Todos os 87 casos com score 75-85', total: 87, processed: 67, failed: 1, status: 'running', started_at: '2026-05-10 09:15', progress: 77 },
  { id: 'j_003', name: 'Re-rodar BDC para casos com falha', target: '12 casos com BDC parcial', total: 12, processed: 0, failed: 0, status: 'queued', scheduled_for: '2026-05-10 18:00' },
];

export default function AdminIntComplianceBulkReprocess() {
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterModelo, setFilterModelo] = useState('all');

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Reprocessamento em Massa"
        subtitle="Re-rodar pipeline V4 em casos antigos após mudanças de modelo, pesos ou regras"
        icon={RefreshCcw}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Bulk Reprocess' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={RefreshCcw} label="Jobs ativos" value="1" accent="violet" />
        <V4KpiCard icon={CheckCircle2} label="Concluídos (30d)" value="14" accent="emerald" />
        <V4KpiCard icon={FileText} label="Casos reprocessados" value="3.247" accent="indigo" />
        <V4KpiCard icon={Play} label="Casos elegíveis" value="487" accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white">Novo Reprocessamento</h3>

          <div>
            <Label>Nome do Job</Label>
            <Input placeholder="Ex: Recalcular após v4.0.8" className="mt-1" />
          </div>

          <div>
            <Label>Tipo de Caso</Label>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="merchant">Apenas Merchants</SelectItem>
                <SelectItem value="subseller_pj">Apenas Subsellers PJ</SelectItem>
                <SelectItem value="subseller_pf">Apenas Subsellers PF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Modelo V4</Label>
            <Select value={filterModelo} onValueChange={setFilterModelo}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os modelos</SelectItem>
                <SelectItem value="v4_card">V4 Cartão</SelectItem>
                <SelectItem value="v4_pix_merchant">V4 PIX Merchant</SelectItem>
                <SelectItem value="v4_pix_intermediario">V4 PIX Intermediário</SelectItem>
                <SelectItem value="v4_subseller_pj">V4 Sub PJ</SelectItem>
                <SelectItem value="v4_subseller_pf">V4 Sub PF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Etapas a rodar</Label>
            <div className="space-y-1.5 mt-2 text-sm">
              {['BDC retry', 'Helena Sentinel V4', 'Score V4', 'Decisão automática'].map((step) => (
                <label key={step} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" /> {step}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500">Casos elegíveis com filtros atuais:</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">142</p>
          </div>

          <Button className="w-full"><Play className="w-4 h-4 mr-1" /> Iniciar Reprocessamento</Button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Histórico de Jobs</h3>
          <div className="space-y-3">
            {mockJobs.map((j) => (
              <div key={j.id} className="rounded-xl border border-slate-100 dark:border-slate-700 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{j.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{j.target}</p>
                  </div>
                  <Badge className={
                    j.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-0' :
                    j.status === 'running' ? 'bg-violet-100 text-violet-700 border-0' :
                    'bg-slate-100 text-slate-700 border-0'
                  }>{j.status}</Badge>
                </div>
                {j.status === 'running' && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">Progresso</span>
                      <span className="font-bold">{j.processed}/{j.total} ({j.progress}%)</span>
                    </div>
                    <Progress value={j.progress} className="h-2" />
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                  {j.started_at && <span>Início: {j.started_at}</span>}
                  {j.completed_at && <span>· Fim: {j.completed_at}</span>}
                  {j.scheduled_for && <span>Agendado: {j.scheduled_for}</span>}
                  {j.failed > 0 && <span className="text-red-600 font-bold">· {j.failed} falhas</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}