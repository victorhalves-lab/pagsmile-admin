import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const FORMATS = [
  { v: 'pdf', label: 'PDF Executivo', desc: 'Layout institucional com gráficos · Pronto para apresentação · Assinatura ICP-Brasil opcional', icon: '📄', color: 'bg-red-50 border-red-200' },
  { v: 'xlsx', label: 'XLSX Completo', desc: 'Múltiplas abas · Formatação condicional · Tabelas dinâmicas · Gráficos embedados', icon: '📊', color: 'bg-emerald-50 border-emerald-200' },
  { v: 'csv', label: 'CSV Tabular', desc: 'Estrutura simples · UTF-8 BOM · Compatível com Excel/BI', icon: '📋', color: 'bg-blue-50 border-blue-200' },
  { v: 'json', label: 'JSON Estruturado', desc: 'Hierárquico · Schema documentado · Para integrações automatizadas', icon: '🔧', color: 'bg-purple-50 border-purple-200' },
];

const RECENT_EXPORTS = [
  { id: 'exp_tpv_001', format: 'pdf', name: 'TPV Mensal Executivo Abril 2026', size: '2.4 MB', signed: true, date: '2026-05-09 14:32', status: 'completed' },
  { id: 'exp_tpv_002', format: 'xlsx', name: 'TPV por Adquirente · 12 meses', size: '8.1 MB', signed: false, date: '2026-05-08 16:15', status: 'completed' },
  { id: 'exp_tpv_003', format: 'csv', name: 'TPV diário Q1 2026', size: '124 KB', signed: false, date: '2026-05-07 09:42', status: 'completed' },
  { id: 'exp_tpv_004', format: 'json', name: 'TPV BI feed completo', size: '45 MB', signed: false, date: '2026-05-06 22:00', status: 'processing' },
];

export default function AdminIntTPVExportCenter() {
  const [format, setFormat] = useState('pdf');
  const [granularity, setGranularity] = useState('month');
  const [includeSignature, setIncludeSignature] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setCompleted(true); }, 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon={FileText}
        title="Centro de Exportação TPV"
        subtitle="Mentor API · ORIGEM 199 · Geração de arquivos exportáveis em formato executivo"
        breadcrumbs={[
          { label: 'Analytics', page: 'AdminIntTPVAnalytics' },
          { label: 'Exportação' },
        ]}
        actions={
          <Link to="/AdminIntTPVAnalytics">
            <Button variant="ghost" className="gap-1"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </Link>
        }
      />

      {!completed ? (
        <>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Escolha o formato</h3>
            <div className="grid grid-cols-2 gap-3">
              {FORMATS.map(f => (
                <button
                  key={f.v}
                  onClick={() => setFormat(f.v)}
                  className={`p-4 rounded-lg border-2 text-left transition ${format === f.v ? `${f.color} border-current shadow-md` : 'border-slate-200'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="font-semibold">{f.label}</span>
                    {format === f.v && <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />}
                  </div>
                  <p className="text-xs text-slate-600">{f.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Configurações do relatório</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Granularidade</Label>
                <Select value={granularity} onValueChange={setGranularity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Diária</SelectItem>
                    <SelectItem value="week">Semanal</SelectItem>
                    <SelectItem value="month">Mensal</SelectItem>
                    <SelectItem value="quarter">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Período</Label>
                <Select defaultValue="30d">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="qtd">Trimestre atual</SelectItem>
                    <SelectItem value="ytd">Ano até hoje</SelectItem>
                    <SelectItem value="12m">Últimos 12 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {format === 'pdf' && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <Lock className="w-4 h-4 text-purple-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Assinatura digital ICP-Brasil</div>
                  <div className="text-xs text-slate-600">Comprova autoria e integridade do documento — recomendado para auditorias regulatórias do BCB</div>
                </div>
                <input type="checkbox" checked={includeSignature} onChange={(e) => setIncludeSignature(e.target.checked)} className="w-5 h-5" />
              </div>
            )}
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleGenerate} disabled={generating} className="gap-1">
              {generating ? '⏳ Gerando...' : <><Download className="w-4 h-4" /> Gerar Relatório</>}
            </Button>
          </div>
        </>
      ) : (
        <Card className="p-8 text-center bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Relatório Gerado com Sucesso</h2>
          <p className="text-slate-600 mb-4">
            Formato: <strong>{FORMATS.find(f => f.v === format).label}</strong> · {includeSignature && format === 'pdf' && '🔒 Assinado ICP-Brasil'}
          </p>
          <div className="flex justify-center gap-2">
            <Button className="gap-1"><Download className="w-4 h-4" /> Download</Button>
            <Button variant="outline" onClick={() => setCompleted(false)}>Gerar Outro</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold">📂 Exportações Recentes</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {RECENT_EXPORTS.map(e => (
            <div key={e.id} className="p-3 flex items-center justify-between hover:bg-slate-50/60">
              <div className="flex items-center gap-3">
                <span className="text-xl">{FORMATS.find(f => f.v === e.format).icon}</span>
                <div>
                  <div className="font-medium text-sm">{e.name} {e.signed && <Badge variant="outline" className="ml-1 text-xs"><Lock className="w-3 h-3 mr-0.5" />Assinado</Badge>}</div>
                  <div className="text-xs text-slate-500">{e.size} · {e.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {e.status === 'completed' ? (
                  <Button size="sm" variant="outline" className="gap-1"><Download className="w-3 h-3" /> Baixar</Button>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700">Processando...</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}