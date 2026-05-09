import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Hash, LineChart, BarChart3, PieChart, Table, Activity, Layers,
  TrendingUp, Grid3x3, AlignLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const WIDGETS = [
  { id: 'kpi', name: 'KPI Card', icon: Hash, desc: 'Número + delta', category: 'Básico' },
  { id: 'sparkline', name: 'Sparkline', icon: TrendingUp, desc: 'Tendência mini', category: 'Básico' },
  { id: 'line', name: 'Linha', icon: LineChart, desc: 'Série temporal', category: 'Gráficos' },
  { id: 'bar', name: 'Barras', icon: BarChart3, desc: 'Comparativo', category: 'Gráficos' },
  { id: 'pie', name: 'Pizza', icon: PieChart, desc: 'Distribuição', category: 'Gráficos' },
  { id: 'area', name: 'Área', icon: Activity, desc: 'Volume', category: 'Gráficos' },
  { id: 'heatmap', name: 'Heatmap', icon: Grid3x3, desc: 'Matriz cor', category: 'Avançado' },
  { id: 'funnel', name: 'Funil', icon: Layers, desc: 'Etapas', category: 'Avançado' },
  { id: 'table', name: 'Tabela', icon: Table, desc: 'Dados detalhados', category: 'Dados' },
  { id: 'text', name: 'Texto', icon: AlignLeft, desc: 'Markdown', category: 'Dados' },
];

const CATEGORIES = ['Básico', 'Gráficos', 'Avançado', 'Dados'];

export default function WidgetLibrary({ onAddWidget }) {
  const onDragStart = (e, widget) => {
    e.dataTransfer.setData('widget', JSON.stringify(widget));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card className="p-3 h-full">
      <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Biblioteca</h3>
      <p className="text-[10px] text-slate-400 mb-3">Arraste para o canvas ou clique para adicionar</p>

      {CATEGORIES.map(cat => (
        <div key={cat} className="mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">{cat}</p>
          <div className="space-y-1">
            {WIDGETS.filter(w => w.category === cat).map(w => (
              <div
                key={w.id}
                draggable
                onDragStart={(e) => onDragStart(e, w)}
                onClick={() => onAddWidget?.(w)}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700',
                  'hover:border-[#2bc196] hover:bg-[#2bc196]/5 cursor-grab active:cursor-grabbing transition-all'
                )}
              >
                <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <w.icon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{w.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}