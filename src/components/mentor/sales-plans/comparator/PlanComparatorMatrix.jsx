import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { PLAN_STATUS, REGULATORY_PROGRAMS } from '@/components/mentor/mocks/salesPlansMock';

const COMPARISON_GROUPS = [
  {
    title: 'Identificação',
    rows: [
      { key: 'code', label: 'Código', type: 'text' },
      { key: 'project_name', label: 'Projeto', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'version', label: 'Versão atual', type: 'badge' },
    ],
  },
  {
    title: 'Tarifas base',
    rows: [
      { key: 'base_mdr_credit', label: 'MDR Crédito', type: 'percent', better: 'lower' },
      { key: 'base_mdr_debit', label: 'MDR Débito', type: 'percent', better: 'lower' },
      { key: 'base_mdr_pix', label: 'MDR Pix', type: 'percent', better: 'lower' },
      { key: 'spread_avg', label: 'Spread médio', type: 'percent', better: 'higher' },
      { key: 'anticipation_rate', label: 'Antecipação', type: 'percent', better: 'lower' },
    ],
  },
  {
    title: 'Aplicabilidade',
    rows: [
      { key: 'terminal_count', label: 'Estabelecimentos', type: 'number' },
      { key: 'channels', label: 'Canais', type: 'array' },
      { key: 'card_brands', label: 'Bandeiras', type: 'array' },
      { key: 'mcc_restrictions', label: 'Restrições MCC', type: 'array' },
    ],
  },
  {
    title: 'Performance',
    rows: [
      { key: 'monthly_tpv', label: 'TPV/mês', type: 'currency_m', better: 'higher' },
      { key: 'monthly_revenue', label: 'Receita/mês', type: 'currency_m', better: 'higher' },
      { key: 'avg_margin', label: 'Margem média', type: 'percent', better: 'higher' },
      { key: 'drift_pct', label: 'Drift operacional', type: 'percent', better: 'lower' },
      { key: 'health_score', label: 'Health score', type: 'score', better: 'higher' },
    ],
  },
  {
    title: 'Regulatório & risco',
    rows: [
      { key: 'regulatory_programs', label: 'Programas', type: 'programs' },
      { key: 'program_compliance_score', label: 'Score compliance', type: 'score', better: 'higher' },
      { key: 'exceptions_count', label: 'Exceções ativas', type: 'number', better: 'lower' },
    ],
  },
];

const renderCell = (row, value, allValues) => {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    if (row.type === 'array') return <span className="text-[10px] text-slate-400 italic">sem restrições</span>;
    return <Minus className="w-3 h-3 text-slate-400" />;
  }

  let isBest = false;
  let isWorst = false;
  if (row.better && allValues.length > 1) {
    const numeric = allValues.filter((v) => typeof v === 'number');
    if (numeric.length === allValues.length) {
      const max = Math.max(...numeric);
      const min = Math.min(...numeric);
      if (row.better === 'lower') {
        isBest = value === min && max !== min;
        isWorst = value === max && max !== min;
      } else {
        isBest = value === max && max !== min;
        isWorst = value === min && max !== min;
      }
    }
  }

  const wrap = (content) => (
    <div className={`inline-flex items-center gap-1 ${isBest ? 'text-emerald-700 font-bold' : isWorst ? 'text-red-700 font-bold' : ''}`}>
      {content}
      {isBest && <TrendingUp className="w-3 h-3" />}
      {isWorst && <TrendingDown className="w-3 h-3" />}
    </div>
  );

  switch (row.type) {
    case 'percent':
      return wrap(<span className="font-mono">{value.toFixed(2)}%</span>);
    case 'number':
      return wrap(<span className="font-mono">{value.toLocaleString('pt-BR')}</span>);
    case 'score':
      return wrap(<span className="font-mono">{value}/100</span>);
    case 'currency_m':
      return wrap(<span className="font-mono">{value > 0 ? `R$ ${(value / 1_000_000).toFixed(1)}M` : '—'}</span>);
    case 'status':
      return <Badge className={`text-[9px] ${PLAN_STATUS[value]?.color}`}>{PLAN_STATUS[value]?.label}</Badge>;
    case 'badge':
      return <Badge variant="outline" className="text-[9px]">v{value}</Badge>;
    case 'array':
      return <div className="flex flex-wrap gap-1">{value.map((v) => <Badge key={v} variant="outline" className="text-[9px]">{v}</Badge>)}</div>;
    case 'programs':
      return <div className="flex gap-1">{value.map((p) => <span key={p} title={REGULATORY_PROGRAMS[p]?.label}>{REGULATORY_PROGRAMS[p]?.icon}</span>)}</div>;
    case 'text':
    default:
      return <span className="text-[11px]">{value}</span>;
  }
};

export default function PlanComparatorMatrix({ plans = [] }) {
  if (plans.length === 0) return null;

  return (
    <div className="space-y-4">
      {COMPARISON_GROUPS.map((group) => (
        <Card key={group.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-y">
                  <tr>
                    <th className="text-left p-2 font-bold w-44">Atributo</th>
                    {plans.map((p) => (
                      <th key={p.id} className="text-left p-2 font-bold min-w-[180px]">
                        <p className="text-[11px] truncate">{p.name}</p>
                        <p className="text-[9px] font-mono text-slate-500">{p.code}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => {
                    const values = plans.map((p) => p[row.key]);
                    return (
                      <tr key={row.key} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                        <td className="p-2 font-semibold text-slate-600 dark:text-slate-400">{row.label}</td>
                        {plans.map((p, i) => (
                          <td key={p.id} className="p-2">{renderCell(row, values[i], values)}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200">
        <CardContent className="p-3 text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5" />
          <div className="text-emerald-900 dark:text-emerald-200">
            <p className="font-bold">Como interpretar</p>
            <p className="mt-0.5">
              Valores em <strong className="text-emerald-700">verde com ↑</strong> indicam melhor desempenho na linha ·
              <strong className="text-red-700"> vermelho com ↓</strong> indica pior · campos sem polaridade clara são apenas referência.
              Use esta visão para decidir migrações em massa, descontinuação de planos redundantes e identificação de oportunidades de unificação.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}