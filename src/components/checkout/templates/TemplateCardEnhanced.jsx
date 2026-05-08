import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout, Monitor, Smartphone, TrendingUp, Users, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Template card enriquecido com performance histórica + "Adaptar com meu branding".
 */
export default function TemplateCardEnhanced({ template, onPreview, onUse }) {
  const styleIcon = {
    default: Layout,
    dark: Monitor,
    minimal: Smartphone,
  }[template.style] || Layout;
  const Icon = styleIcon;

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Preview thumbnail */}
      <div className={cn(
        "h-48 relative p-5 flex items-center justify-center overflow-hidden",
        template.style === 'dark' ? "bg-slate-900" : "bg-slate-50 dark:bg-slate-900"
      )}>
        <div className={cn(
          "w-full max-w-[240px] rounded-lg shadow-lg p-3 flex flex-col gap-2 transform group-hover:scale-105 transition-transform duration-500",
          template.style === 'dark' ? "bg-slate-800" : "bg-white"
        )}>
          <div className={cn("h-2 w-1/3 rounded", template.style === 'dark' ? "bg-slate-600" : "bg-slate-200")} />
          <div className={cn("h-6 rounded", template.style === 'dark' ? "bg-slate-700" : "bg-slate-100")} />
          <div className={cn("h-6 rounded", template.style === 'dark' ? "bg-slate-700" : "bg-slate-100")} />
          <div className="grid grid-cols-2 gap-1">
            <div className={cn("h-5 rounded", template.style === 'dark' ? "bg-slate-700" : "bg-slate-100")} />
            <div className={cn("h-5 rounded", template.style === 'dark' ? "bg-slate-700" : "bg-slate-100")} />
          </div>
          <div className="h-7 rounded bg-[#2bc196]" />
        </div>

        {/* Top performance badge */}
        {template.topPercent && (
          <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-0 text-[10px] gap-1">
            <TrendingUp className="w-2.5 h-2.5" /> Top {template.topPercent}%
          </Badge>
        )}
        {template.recommended && (
          <Badge className="absolute top-3 left-3 bg-purple-500 text-white border-0 text-[10px] gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Para você
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{template.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="secondary" className="text-[10px] font-normal">{template.type}</Badge>
              {template.vertical && <Badge variant="outline" className="text-[10px]">{template.vertical}</Badge>}
            </div>
          </div>
          <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 flex-shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Performance histórica REAL */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-slate-500">
              <TrendingUp className="w-2.5 h-2.5" /> Conversão
            </div>
            <p className="text-sm font-bold text-emerald-600">{template.avgConversion}%</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-slate-500">
              <Users className="w-2.5 h-2.5" /> Em uso
            </div>
            <p className="text-sm font-bold">{template.usedBy}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-slate-500">
              <DollarSign className="w-2.5 h-2.5" /> Ticket
            </div>
            <p className="text-sm font-bold">R$ {template.avgTicket}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-[#2bc196] hover:bg-[#25a880] text-white"
            onClick={() => onUse?.(template)}
          >
            Usar Template
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => onPreview?.(template)}>
              Pré-visualizar
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => toast.success(`Aplicando seu branding ao template "${template.name}"...`)}
            >
              <Sparkles className="w-3 h-3 mr-1" /> Adaptar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}