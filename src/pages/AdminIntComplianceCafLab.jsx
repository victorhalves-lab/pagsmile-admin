import React from 'react';
import { Camera, CheckCircle2, XCircle, AlertTriangle, Eye, RefreshCcw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const day = 24 * 3600 * 1000;
const isoOffset = (n) => new Date(Date.now() - n * day).toISOString();

const mockCafChecks = [
  { id: 'caf_001', case_id: 'CASE-2026-001234', subject: 'Pedro Almeida (UBO TechMart)', liveness_score: 96, facematch_score: 94, ocr_score: 91, decision: 'approved', timestamp: isoOffset(0.1), processing_time_ms: 4200 },
  { id: 'caf_002', case_id: 'CASE-2026-002002', subject: 'João Silva (Subseller PF)', liveness_score: 78, facematch_score: 82, ocr_score: 88, decision: 'manual_review', timestamp: isoOffset(0.5), processing_time_ms: 5100 },
  { id: 'caf_003', case_id: 'CASE-2026-001236', subject: 'Roberto Santos (UBO PayCorp)', liveness_score: 45, facematch_score: 38, ocr_score: 65, decision: 'rejected', rejection_reason: 'Liveness fail — possível foto estática', timestamp: isoOffset(1), processing_time_ms: 3800 },
  { id: 'caf_004', case_id: 'CASE-2026-002005', subject: 'Maria Oliveira (Subseller PF)', liveness_score: 92, facematch_score: 89, ocr_score: 86, decision: 'approved', timestamp: isoOffset(0.05), processing_time_ms: 4500 },
];

const STATS = {
  total_24h: 287,
  auto_approved: 234,
  auto_rejected: 23,
  manual_review: 30,
  avg_processing_ms: 4380,
  liveness_avg: 87.4,
  facematch_avg: 84.9,
  ocr_avg: 82.1,
};

export default function AdminIntComplianceCafLab() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="CAF Lab"
        subtitle="Monitoramento e debugging de Liveness, Facematch e OCR via CAF"
        icon={Camera}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'CAF Lab' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={Camera} label="Verificações (24h)" value={STATS.total_24h} accent="indigo" />
        <V4KpiCard icon={CheckCircle2} label="Auto-aprovadas" value={STATS.auto_approved} accent="emerald" />
        <V4KpiCard icon={XCircle} label="Auto-recusadas" value={STATS.auto_rejected} accent="red" />
        <V4KpiCard icon={Activity} label="Tempo médio" value={`${STATS.avg_processing_ms}ms`} accent="violet" />
      </div>

      <Tabs defaultValue="checks">
        <TabsList>
          <TabsTrigger value="checks">Verificações Recentes</TabsTrigger>
          <TabsTrigger value="metrics">Métricas Globais</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
        </TabsList>

        <TabsContent value="checks" className="mt-5 space-y-2">
          {mockCafChecks.map((c) => (
            <div key={c.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4">
              <div className="flex items-center gap-3 mb-3">
                <Camera className="w-5 h-5 text-violet-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold">{c.id}</span>
                    <Badge className={
                      c.decision === 'approved' ? 'bg-emerald-100 text-emerald-700 border-0 text-[10px]' :
                      c.decision === 'rejected' ? 'bg-red-100 text-red-700 border-0 text-[10px]' :
                      'bg-amber-100 text-amber-700 border-0 text-[10px]'
                    }>{c.decision}</Badge>
                  </div>
                  <p className="text-sm font-bold">{c.subject}</p>
                  <p className="text-[11px] text-slate-500">Caso: {c.case_id} · {c.processing_time_ms}ms · {new Date(c.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                <Button variant="outline" size="sm"><Eye className="w-3.5 h-3.5 mr-1" /> Ver</Button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1"><span className="text-slate-500">Liveness</span><span className="font-bold">{c.liveness_score}</span></div>
                  <Progress value={c.liveness_score} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="text-slate-500">Facematch</span><span className="font-bold">{c.facematch_score}</span></div>
                  <Progress value={c.facematch_score} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="text-slate-500">OCR</span><span className="font-bold">{c.ocr_score}</span></div>
                  <Progress value={c.ocr_score} className="h-1.5" />
                </div>
              </div>

              {c.rejection_reason && (
                <p className="mt-3 text-[11px] text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  ⚠️ {c.rejection_reason}
                </p>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="metrics" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Liveness médio (24h)</span><span className="font-bold">{STATS.liveness_avg}%</span></div>
              <Progress value={STATS.liveness_avg} className="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Facematch médio (24h)</span><span className="font-bold">{STATS.facematch_avg}%</span></div>
              <Progress value={STATS.facematch_avg} className="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">OCR médio (24h)</span><span className="font-bold">{STATS.ocr_avg}%</span></div>
              <Progress value={STATS.ocr_avg} className="h-2.5" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-300">Auto-Aprovar</p>
              <p className="text-2xl font-black mt-1">≥ 85</p>
              <p className="text-[11px] text-emerald-600 mt-1">Em todas as 3 dimensões (Liveness + Facematch + OCR)</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <p className="text-xs uppercase font-bold text-amber-700 dark:text-amber-300">Análise Manual</p>
              <p className="text-2xl font-black mt-1">60 - 84</p>
              <p className="text-[11px] text-amber-600 mt-1">Pelo menos uma dimensão na faixa intermediária</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
              <p className="text-xs uppercase font-bold text-red-700 dark:text-red-300">Auto-Recusar</p>
              <p className="text-2xl font-black mt-1">&lt; 60</p>
              <p className="text-[11px] text-red-600 mt-1">Liveness ou Facematch abaixo do limiar</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}