import React, { useState } from 'react';
import { FileSpreadsheet, Download, Plus, Edit, Layers, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const mockTemplates = [
  { id: 't_001', name: 'Pré-KYC Banco Topázio', target_partner: 'Banco Topázio', model: 'v4_pix_merchant', fields: 47, format: 'XLSX', is_active: true, version: '2.1', last_used: '2026-05-09', total_exports: 89 },
  { id: 't_002', name: 'Pré-KYC Banco BS2', target_partner: 'Banco BS2', model: 'v4_pix_merchant', fields: 42, format: 'XLSX', is_active: true, version: '1.4', last_used: '2026-05-08', total_exports: 56 },
  { id: 't_003', name: 'Compliance Externo KPMG', target_partner: 'KPMG Compliance', model: 'v4_card', fields: 86, format: 'PDF', is_active: true, version: '3.0', last_used: '2026-05-09', total_exports: 142 },
  { id: 't_004', name: 'BACEN Reporting', target_partner: 'BACEN', model: 'all', fields: 124, format: 'XLSX + JSON', is_active: true, version: '4.2', last_used: '2026-05-01', total_exports: 12 },
  { id: 't_005', name: 'COAF Automated', target_partner: 'COAF', model: 'all', fields: 98, format: 'XML', is_active: false, version: '1.0', last_used: null, total_exports: 0 },
];

const mockFieldMapping = [
  { source: 'razao_social', target: 'razao_social', required: true },
  { source: 'cnpj', target: 'numero_cnpj', required: true, format: 'XX.XXX.XXX/XXXX-XX' },
  { source: 'questionnaire_data.volume_mensal', target: 'volume_estimado_mensal', required: true },
  { source: 'risk_score', target: 'score_pagsmile_v4', required: true },
  { source: 'risk_band', target: 'banda_risco', required: true },
  { source: 'helena_analysis.narrative_summary', target: 'parecer_compliance', required: true },
  { source: 'caf_score', target: 'score_caf', required: false },
  { source: 'documents[].file_url', target: 'docs_anexos', required: true, format: 'URLs (signed)' },
];

export default function AdminIntComplianceKYCTemplate() {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Templates KYC para Parceiros"
        subtitle="Pacotes de dados padronizados para envio a bancos, compliance externos e reguladores"
        icon={FileSpreadsheet}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Templates KYC' },
        ]}
        actions={<Button><Plus className="w-4 h-4 mr-1" /> Novo Template</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={FileSpreadsheet} label="Templates" value={mockTemplates.length} accent="indigo" />
        <V4KpiCard icon={Globe} label="Parceiros suportados" value="5" accent="violet" />
        <V4KpiCard icon={Download} label="Exports (30d)" value="299" accent="emerald" />
        <V4KpiCard icon={Layers} label="Campos médios" value="79" accent="slate" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">Templates ({mockTemplates.length})</TabsTrigger>
          <TabsTrigger value="mapping">Mapeamento de Campos</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-5 space-y-3">
          {mockTemplates.map((t) => (
            <div key={t.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-4">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</span>
                  <Badge variant="outline" className="text-[10px]">v{t.version}</Badge>
                  <Badge variant="outline" className="text-[10px]">{t.format}</Badge>
                  <Badge variant="outline" className="text-[10px]">{t.model}</Badge>
                </div>
                <div className="text-xs text-slate-500">
                  Parceiro: <strong>{t.target_partner}</strong> · {t.fields} campos · {t.total_exports} exports realizados
                </div>
              </div>
              {t.is_active ? (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-700 border-0">Inativo</Badge>
              )}
              <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm">Preview</Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="mapping" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
            <p className="text-sm text-slate-500 mb-4">
              Mapeamento de campos do PagSmile → campos esperados pelos parceiros.
              Cada template usa um subset destes mapeamentos.
            </p>
            <div className="space-y-2">
              {mockFieldMapping.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                  <code className="font-mono text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 px-2 py-0.5 rounded">{m.source}</code>
                  <span className="text-slate-400">→</span>
                  <code className="font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">{m.target}</code>
                  {m.format && <span className="text-slate-500">({m.format})</span>}
                  {m.required && <Badge className="bg-red-100 text-red-700 border-0 text-[9px] ml-auto">REQUIRED</Badge>}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}