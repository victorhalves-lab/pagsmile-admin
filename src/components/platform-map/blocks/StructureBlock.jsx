import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Mapeamento de tipos de bloco → cor + ícone label
const BLOCK_TYPES = {
  header: { label: 'Header', color: 'slate', emoji: '🎩' },
  topbar: { label: 'Topbar', color: 'slate', emoji: '🎩' },
  tabs: { label: 'Abas', color: 'blue', emoji: '📑' },
  tab: { label: 'Aba', color: 'blue', emoji: '📑' },
  'wizard-step': { label: 'Passo do Wizard', color: 'purple', emoji: '🧭' },
  step: { label: 'Passo', color: 'purple', emoji: '🧭' },
  section: { label: 'Seção', color: 'slate', emoji: '📦' },
  card: { label: 'Card', color: 'emerald', emoji: '🪪' },
  modal: { label: 'Modal', color: 'violet', emoji: '🪟' },
  dialog: { label: 'Dialog', color: 'violet', emoji: '🪟' },
  drawer: { label: 'Drawer', color: 'violet', emoji: '📤' },
  sidebar: { label: 'Sidebar', color: 'indigo', emoji: '📚' },
  'filter-bar': { label: 'Filtros', color: 'amber', emoji: '🔍' },
  filters: { label: 'Filtros', color: 'amber', emoji: '🔍' },
  'kpi-row': { label: 'Linha de KPIs', color: 'teal', emoji: '📊' },
  kpi: { label: 'KPI', color: 'teal', emoji: '📊' },
  table: { label: 'Tabela', color: 'sky', emoji: '🗂️' },
  list: { label: 'Lista', color: 'sky', emoji: '📋' },
  form: { label: 'Formulário', color: 'rose', emoji: '✍️' },
  chart: { label: 'Gráfico', color: 'cyan', emoji: '📈' },
  empty: { label: 'Estado Vazio', color: 'slate', emoji: '🫥' },
  loading: { label: 'Loading', color: 'slate', emoji: '⏳' },
  error: { label: 'Erro', color: 'red', emoji: '⚠️' },
  banner: { label: 'Banner', color: 'amber', emoji: '🔔' },
  alert: { label: 'Alerta', color: 'amber', emoji: '🚨' },
  button: { label: 'Botão', color: 'emerald', emoji: '🔘' },
  field: { label: 'Campo', color: 'rose', emoji: '✏️' },
};

const COLOR_CLASSES = {
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  purple: 'border-purple-200 bg-purple-50 text-purple-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  teal: 'border-teal-200 bg-teal-50 text-teal-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  red: 'border-red-200 bg-red-50 text-red-700',
};

export default function StructureBlock({ block, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);

  const typeConfig = BLOCK_TYPES[block.type] || BLOCK_TYPES.section;
  const colorClass = COLOR_CLASSES[typeConfig.color] || COLOR_CLASSES.slate;
  const hasChildren = Array.isArray(block.items) && block.items.length > 0;

  return (
    <div className={cn('rounded-xl border', colorClass, depth === 0 && 'shadow-sm')}>
      {/* Header do bloco */}
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={cn(
          'w-full flex items-start gap-3 p-4 text-left',
          hasChildren && 'cursor-pointer hover:bg-black/5 rounded-xl transition-colors',
          !hasChildren && 'cursor-default'
        )}
      >
        {hasChildren && (
          <div className="mt-0.5 flex-shrink-0">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}
        <span className="text-lg flex-shrink-0">{typeConfig.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant="outline" className="text-[10px] py-0 h-5 bg-white">
              {typeConfig.label}
            </Badge>
            {block.layout && (
              <span className="text-[11px] text-slate-500 font-mono">
                {block.layout}
              </span>
            )}
          </div>
          <h4 className="font-bold text-slate-900 leading-tight">
            {block.name}
          </h4>
          {block.description && (
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {block.description}
            </p>
          )}
        </div>
      </button>

      {/* Children: sub-blocos OU lista de elementos */}
      {hasChildren && expanded && (
        <div className="px-4 pb-4 space-y-2.5">
          {block.items.map((item, idx) => {
            // Se for string, renderiza como bullet simples
            if (typeof item === 'string') {
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 pl-2 py-1 text-sm text-slate-700"
                >
                  <span className="text-slate-400 mt-0.5">→</span>
                  <span className="flex-1">{item}</span>
                </div>
              );
            }
            // Se tiver type, é sub-bloco recursivo
            if (item.type) {
              return <StructureBlock key={idx} block={item} depth={depth + 1} />;
            }
            // Senão, é um item simples com name/description
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-3 text-sm"
              >
                <div className="font-semibold text-slate-900">{item.name}</div>
                {item.description && (
                  <div className="text-slate-600 mt-1 text-xs leading-relaxed">
                    {item.description}
                  </div>
                )}
                {item.value && (
                  <div className="text-slate-500 mt-1 text-xs font-mono">
                    {item.value}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}