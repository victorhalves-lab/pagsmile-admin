import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Store, Crown, BookOpen, Building2, Code, Heart, ShieldCheck, TrendingUp, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP = { Store, Crown, BookOpen, Building2, Code, Heart };

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: 'bg-violet-100 text-violet-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'bg-cyan-100 text-cyan-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'bg-rose-100 text-rose-600' },
};

export default function MentorSplitTemplateCard({ template, isSelected, onSelect, onPreview }) {
  const Icon = ICON_MAP[template.icon] || Store;
  const colors = COLOR_MAP[template.color] || COLOR_MAP.blue;

  return (
    <Card
      className={cn(
        'transition cursor-pointer hover:shadow-md',
        isSelected ? 'ring-2 ring-violet-500 border-violet-300 shadow-md' : ''
      )}
      onClick={() => onSelect?.(template)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.icon)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1 items-end">
            {template.category === 'recommended' && (
              <Badge className="bg-violet-100 text-violet-700 text-[9px]">⭐ Recomendado</Badge>
            )}
            {template.regulatory_compliant && (
              <Badge className="bg-emerald-100 text-emerald-700 text-[9px] gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Compliant
              </Badge>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{template.name}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 rounded p-2 text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Owner</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{template.config.owner_share}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Merchant</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{template.config.merchant_share}%</span>
          </div>
          {template.config.additional_share > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-500">{template.config.additional_label}</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{template.config.additional_share}%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center gap-1 text-slate-600">
            <Users className="w-3 h-3" />
            {template.used_by_count} merchants
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <TrendingUp className="w-3 h-3" />
            health {template.benchmark.avg_health_score}
          </div>
        </div>

        <div className="flex gap-1.5 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[11px]"
            onClick={(e) => { e.stopPropagation(); onPreview?.(template); }}
          >
            Detalhes
          </Button>
          <Button
            size="sm"
            className={cn(
              'flex-1 h-7 text-[11px]',
              isSelected ? 'bg-violet-600 hover:bg-violet-700' : ''
            )}
            onClick={(e) => { e.stopPropagation(); onSelect?.(template); }}
          >
            {isSelected ? '✓ Selecionado' : 'Usar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}