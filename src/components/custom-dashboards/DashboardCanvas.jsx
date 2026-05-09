import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, LineChart, BarChart3, PieChart, Table, Activity, Layers, TrendingUp, Grid3x3, AlignLeft, X, GripVertical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  kpi: Hash, sparkline: TrendingUp, line: LineChart, bar: BarChart3,
  pie: PieChart, area: Activity, heatmap: Grid3x3, funnel: Layers,
  table: Table, text: AlignLeft,
};

const SIZE_CLASSES = {
  '1x1': 'col-span-3 row-span-1',
  '2x1': 'col-span-6 row-span-1',
  '3x1': 'col-span-9 row-span-1',
  '4x1': 'col-span-12 row-span-1',
  '2x2': 'col-span-6 row-span-2',
  '3x2': 'col-span-9 row-span-2',
};

export default function DashboardCanvas({ widgets = [], onWidgetsChange, isPreview = false, onSelectWidget, selectedId }) {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const widget = JSON.parse(e.dataTransfer.getData('widget'));
      const newWidget = {
        ...widget,
        instanceId: `w_${Date.now()}`,
        title: widget.name,
        size: '2x1',
      };
      onWidgetsChange?.([...widgets, newWidget]);
    } catch {}
  };

  const removeWidget = (id) => {
    onWidgetsChange?.(widgets.filter(w => w.instanceId !== id));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        'min-h-[600px] p-4 rounded-xl border-2 border-dashed transition-all',
        dragOver
          ? 'border-[#2bc196] bg-[#2bc196]/5'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
      )}
    >
      {widgets.length === 0 ? (
        <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
            <Layers className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-base font-bold text-slate-700">Arraste widgets para começar</p>
          <p className="text-sm text-slate-500 mt-1">Use a biblioteca à esquerda ou clique para adicionar</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 auto-rows-[140px] gap-3">
          {widgets.map(w => {
            const Icon = ICON_MAP[w.id] || Hash;
            const sizeClass = SIZE_CLASSES[w.size] || SIZE_CLASSES['2x1'];
            return (
              <Card
                key={w.instanceId}
                className={cn(
                  sizeClass,
                  'group relative bg-white dark:bg-slate-800 transition-all cursor-pointer',
                  selectedId === w.instanceId && 'ring-2 ring-[#2bc196]',
                  isPreview ? 'cursor-default' : 'hover:shadow-md'
                )}
                onClick={() => !isPreview && onSelectWidget?.(w.instanceId)}
              >
                {!isPreview && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1 z-10">
                    <button
                      className="p-1 rounded-md bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 cursor-grab"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-3 h-3 text-slate-500" />
                    </button>
                    <button
                      className="p-1 rounded-md bg-red-100 hover:bg-red-200"
                      onClick={(e) => { e.stopPropagation(); removeWidget(w.instanceId); }}
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                )}
                <div className="p-3 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#2bc196]/10 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-[#2bc196]" />
                    </div>
                    <p className="text-xs font-semibold truncate flex-1">{w.title}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-md">
                    <Badge variant="outline" className="text-[10px]">{w.id}</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}