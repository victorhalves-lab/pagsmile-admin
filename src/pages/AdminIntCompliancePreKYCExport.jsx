import React, { useState } from 'react';
import { FileSpreadsheet, Download, Send, CheckCircle2, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const day = 24 * 3600 * 1000;
const isoOffset = (n) => new Date(Date.now() - n * day).toISOString();

const mockExports = [
  { id: 'e_001', export_id: 'EXP-2026-0089', case_id: 'CASE-2026-001235', merchant: 'LojaExpress', partner: 'Banco Topázio', template: 'Pré-KYC Banco Topázio v2.1', status: 'submitted_to_partner', generated_at: isoOffset(0.2), submitted_at: isoOffset(0.15), partner_decision: null, file_url: '/exports/exp_0089.xlsx' },
  { id: 'e_002', export_id: 'EXP-2026-0088', case_id: 'CASE-2026-001234', merchant: 'TechMart', partner: 'KPMG Compliance', template: 'Compliance Externo KPMG v3.0', status: 'approved_by_partner', generated_at: isoOffset(2), submitted_at: isoOffset(2), partner_response_at: isoOffset(0.5), partner_decision: 'approved' },
  { id: 'e_003', export_id: 'EXP-2026-0087', case_id: 'CASE-2026-002001', merchant: 'EletroBrasil (Sub)', partner: 'Banco Topázio', template: 'Pré-KYC Banco Topázio v2.1', status: 'rejected_by_partner', generated_at: isoOffset(3), submitted_at: isoOffset(3), partner_response_at: isoOffset(1), partner_decision: 'rejected', partner_decision_reason: 'Pendência: comprovante endereço UBO' },
  { id: 'e_004', export_id: 'EXP-2026-0086', case_id: 'CASE-2026-001237', merchant: 'CloudTech', partner: 'Banco BS2', template: 'Pré-KYC Banco BS2 v1.4', status: 'exported', generated_at: isoOffset(0.05), submitted_at: null, partner_decision: null },
];

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: 'bg-slate-100 text-slate-700' },
  collected: { label: 'Coletado', color: 'bg-blue-100 text-blue-700' },
  validated: { label: 'Validado', color: 'bg-violet-100 text-violet-700' },
  exported: { label: 'Exportado', color: 'bg-amber-100 text-amber-700' },
  submitted_to_partner: { label: 'Enviado ao Parceiro', color: 'bg-indigo-100 text-indigo-700' },
  approved_by_partner: { label: 'Aprovado pelo Parceiro', color: 'bg-emerald-100 text-emerald-700' },
  rejected_by_partner: { label: 'Recusado pelo Parceiro', color: 'bg-red-100 text-red-700' },
};

export default function AdminIntCompliancePreKYCExport() {
  const [partner, setPartner] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = mockExports.filter((e) => {
    if (partner !== 'all' && e.partner !== partner) return false;
    if (activeTab === 'submitted') return e.status === 'submitted_to_partner';
    if (activeTab === 'approved') return e.status === 'approved_by_partner';
    if (activeTab === 'rejected') return e.status === 'rejected_by_partner';
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Pré-KYC Export"
        subtitle="Geração e envio de pacotes Pré-KYC aos bancos parceiros e compliance externos"
        icon={FileSpreadsheet}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Pré-KYC Export' },
        ]}
        actions={<Button><Send className="w-4 h-4 mr-1" /> Novo Export</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={FileSpreadsheet} label="Exports (30d)" value="89" accent="indigo" />
        <V4KpiCard icon={Send} label="Enviados parceiro" value="76" accent="violet" />
        <V4KpiCard icon={CheckCircle2} label="Aprovados" value="62" accent="emerald" />
        <V4KpiCard icon={Clock} label="Aguardando resp." value="9" accent="amber" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <div className="flex items-center justify-between mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="submitted">Enviados</TabsTrigger>
              <TabsTrigger value="approved">Aprovados</TabsTrigger>
              <TabsTrigger value="rejected">Recusados</TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={partner} onValueChange={setPartner}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Parceiro" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os parceiros</SelectItem>
              <SelectItem value="Banco Topázio">Banco Topázio</SelectItem>
              <SelectItem value="Banco BS2">Banco BS2</SelectItem>
              <SelectItem value="KPMG Compliance">KPMG Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filtered.map((e) => {
            const cfg = STATUS_CONFIG[e.status] || { label: e.status, color: 'bg-slate-100 text-slate-700' };
            return (
              <div key={e.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold">{e.export_id}</span>
                    <Badge className={`${cfg.color} border-0 text-[10px]`}>{cfg.label}</Badge>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{e.merchant} → {e.partner}</p>
                  <p className="text-[11px] text-slate-500">Template: {e.template} · Caso: {e.case_id}</p>
                  {e.partner_decision_reason && <p className="text-[11px] text-red-600 mt-1">⚠️ {e.partner_decision_reason}</p>}
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>Gerado: {new Date(e.generated_at).toLocaleDateString('pt-BR')}</p>
                  {e.partner_response_at && <p>Resp: {new Date(e.partner_response_at).toLocaleDateString('pt-BR')}</p>}
                </div>
                <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5" /></Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}