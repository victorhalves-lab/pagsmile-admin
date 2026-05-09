import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Sparkles, FileWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export default function MentorBulkRolloutValidator({ template, selectedMerchants = [] }) {
  if (!template || selectedMerchants.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-slate-500">
          Selecione um template e ao menos 1 merchant para ver a validação Mentor.
        </CardContent>
      </Card>
    );
  }

  const totalTPV = selectedMerchants.reduce((sum, m) => sum + m.tpv_30d, 0);
  const merchantsWithExisting = selectedMerchants.filter((m) => m.has_active_split).length;
  const totalNew = selectedMerchants.length - merchantsWithExisting;

  // Check Mentor-style: simulações de validação
  const checks = [
    {
      ok: template.regulatory_compliant,
      label: 'Template é regulatoriamente compliant',
      detail: `Última validação ${new Date(template.last_validated).toLocaleDateString('pt-BR')}`,
    },
    {
      ok: selectedMerchants.every((m) => m.compliance_status === 'compliant'),
      label: 'Todos os merchants têm compliance OK',
      detail: 'KYC, KYB e documentação dos sócios validados',
    },
    {
      ok: merchantsWithExisting === 0,
      label: merchantsWithExisting === 0
        ? 'Nenhum merchant tem split ativo'
        : `${merchantsWithExisting} merchant(s) já possuem split`,
      detail: merchantsWithExisting === 0
        ? 'Aplicação limpa sem conflitos'
        : 'Splits existentes serão substituídos · aviso prévio será aplicado quando necessário',
      warning: merchantsWithExisting > 0,
    },
    {
      ok: selectedMerchants.length <= 50,
      label: `Lote de ${selectedMerchants.length} merchant(s) ${selectedMerchants.length <= 50 ? 'dentro do limite' : 'excede limite recomendado de 50'}`,
      detail: 'Lotes maiores serão divididos automaticamente em batches',
      warning: selectedMerchants.length > 50,
    },
  ];

  const allOk = checks.every((c) => c.ok && !c.warning);
  const hasErrors = checks.some((c) => !c.ok);

  return (
    <Card className={cn('border-2', allOk ? 'border-emerald-300 bg-emerald-50/30' : hasErrors ? 'border-red-300 bg-red-50/30' : 'border-amber-300 bg-amber-50/30')}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
          <ShieldCheck className="w-4 h-4 text-violet-600" />
          Validador Mentor de Rollout em Massa
          <Badge className="bg-violet-100 text-violet-700 text-[9px] gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> H.8
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {/* Resumo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="bg-white dark:bg-slate-800 rounded p-2 border">
            <p className="text-[9px] uppercase font-bold text-slate-500">Template</p>
            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{template.name}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded p-2 border">
            <p className="text-[9px] uppercase font-bold text-slate-500">Merchants</p>
            <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedMerchants.length}</p>
            <p className="text-[9px] text-slate-500">{totalNew} novos · {merchantsWithExisting} substituições</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded p-2 border">
            <p className="text-[9px] uppercase font-bold text-slate-500">TPV impactado</p>
            <p className="text-xs font-bold text-slate-800 dark:text-white">{fmtBRL(totalTPV)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded p-2 border">
            <p className="text-[9px] uppercase font-bold text-slate-500">Receita owner est.</p>
            <p className="text-xs font-bold text-emerald-700">
              {fmtBRL((totalTPV * (template.config.owner_share / 100)))}
            </p>
            <p className="text-[9px] text-slate-500">/mês com {template.config.owner_share}%</p>
          </div>
        </div>

        {/* Checks */}
        <div className="space-y-1.5">
          {checks.map((c, i) => {
            const Icon = !c.ok ? XCircle : c.warning ? AlertTriangle : CheckCircle2;
            const color = !c.ok ? 'text-red-600' : c.warning ? 'text-amber-600' : 'text-emerald-600';
            return (
              <div key={i} className="flex items-start gap-2 bg-white dark:bg-slate-800 rounded p-2 border">
                <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', color)} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{c.label}</p>
                  <p className="text-[10px] text-slate-500">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decisão Mentor */}
        <div className={cn(
          'rounded-lg p-3 border-l-4 flex items-start gap-2',
          allOk
            ? 'bg-emerald-100 border-emerald-500'
            : hasErrors
              ? 'bg-red-100 border-red-500'
              : 'bg-amber-100 border-amber-500'
        )}>
          {allOk ? (
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
          ) : (
            <FileWarning className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={cn(
              'text-xs font-bold uppercase',
              allOk ? 'text-emerald-800' : hasErrors ? 'text-red-800' : 'text-amber-800'
            )}>
              {allOk
                ? '✅ Rollout aprovado — pronto para aplicar'
                : hasErrors
                  ? '🚫 Rollout bloqueado — corrija problemas críticos'
                  : '⚠️ Rollout com avisos — revise antes de aplicar'}
            </p>
            <p className="text-[11px] mt-0.5 opacity-90">
              {allOk
                ? 'Todas as validações Mentor passaram. Pode prosseguir com confiança.'
                : 'Mentor recomenda revisar os pontos sinalizados acima antes de continuar.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}