import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Sparkles, AlertTriangle, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';

const RULE_TYPE_LABELS = {
  percentage: { label: '% Fixo', color: 'bg-blue-100 text-blue-700' },
  fixed: { label: 'Valor Fixo', color: 'bg-emerald-100 text-emerald-700' },
  scaled: { label: 'Escalonado', color: 'bg-purple-100 text-purple-700' },
  conditional: { label: 'Condicional', color: 'bg-amber-100 text-amber-700' },
};

const STATUS_LABELS = {
  active: { label: 'Ativo', color: 'bg-emerald-100 text-emerald-700' },
  suspended: { label: 'Suspenso', color: 'bg-amber-100 text-amber-700' },
  terminated: { label: 'Encerrado', color: 'bg-slate-200 text-slate-600' },
};

export default function MentorSplitHeaderCard({ split }) {
  const ruleType = RULE_TYPE_LABELS[split.rule_type] || RULE_TYPE_LABELS.percentage;
  const status = STATUS_LABELS[split.status] || STATUS_LABELS.active;
  const isExpiringSoon = split.days_to_end !== null && split.days_to_end <= 60;

  const copy = (val) => {
    navigator.clipboard.writeText(val);
    toast.success('Copiado para a área de transferência');
  };

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 break-words">
              {split.split_name}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={ruleType.color}>{ruleType.label}</Badge>
              <Badge className={status.color}>{status.label}</Badge>
              {split.recently_modified && (
                <Badge className="bg-blue-100 text-blue-700 gap-1">
                  <Sparkles className="w-3 h-3" /> Modificado recentemente
                </Badge>
              )}
              {isExpiringSoon && (
                <Badge className="bg-red-100 text-red-700 gap-1">
                  <AlertTriangle className="w-3 h-3" /> Encerra em {split.days_to_end}d
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* IDs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">split_id</p>
            <div className="flex items-center gap-1.5 mt-1">
              <code className="text-xs font-mono text-slate-800 dark:text-slate-100 truncate">{split.split_id}</code>
              <button onClick={() => copy(split.split_id)} className="text-slate-400 hover:text-slate-700 flex-shrink-0">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
          {split.external_code && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border">
              <p className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3" /> Código externo
              </p>
              <code className="text-xs font-mono text-slate-800 dark:text-slate-100">{split.external_code}</code>
            </div>
          )}
          {split.accounting_code && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-2 border">
              <p className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3" /> Código contábil
              </p>
              <code className="text-xs font-mono text-slate-800 dark:text-slate-100">{split.accounting_code}</code>
            </div>
          )}
        </div>

        {/* Vigência */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            Vigência: <strong>{new Date(split.vigency_start).toLocaleDateString('pt-BR')}</strong>
            {split.vigency_end ? (
              <> até <strong>{new Date(split.vigency_end).toLocaleDateString('pt-BR')}</strong></>
            ) : (
              <> · <strong>Indeterminada</strong></>
            )}
          </span>
        </div>

        {/* Descrição */}
        {split.description && (
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/40 rounded-lg p-3 border border-violet-100">
            {split.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}