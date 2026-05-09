import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, DollarSign, Activity, Megaphone, Repeat, Store, Layers, Sparkles, Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  {
    id: 'executive',
    name: 'Executive Summary',
    description: 'Visão de CEO — KPIs estratégicos, MRR, GMV e métricas de saúde',
    icon: TrendingUp,
    color: 'from-purple-500 to-indigo-600',
    audience: 'CEO',
    widgets: 8,
    popular: true,
  },
  {
    id: 'financial',
    name: 'Financial Deep Dive',
    description: 'P&L, margem, fees, antecipações e fluxo de caixa detalhado',
    icon: DollarSign,
    color: 'from-emerald-500 to-green-600',
    audience: 'CFO',
    widgets: 12,
  },
  {
    id: 'operations',
    name: 'Operations Hub',
    description: 'Aprovação, declinos, retentativas, performance de adquirentes',
    icon: Activity,
    color: 'from-blue-500 to-cyan-600',
    audience: 'Head Ops',
    widgets: 10,
  },
  {
    id: 'marketing',
    name: 'Marketing & Acquisition',
    description: 'Funil, CAC, conversão por canal, atribuição e ROI',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-600',
    audience: 'CMO',
    widgets: 9,
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions Health',
    description: 'MRR Movement, NRR/GRR, Cohort, Churn — SaaS-specific',
    icon: Repeat,
    color: 'from-amber-500 to-orange-600',
    audience: 'SaaS',
    widgets: 11,
    popular: true,
  },
  {
    id: 'marketplace',
    name: 'Marketplace Sellers',
    description: 'Performance por seller, GMV split, payouts e disputas',
    icon: Store,
    color: 'from-teal-500 to-cyan-600',
    audience: 'Marketplace',
    widgets: 9,
  },
  {
    id: 'risk',
    name: 'Risk & Compliance',
    description: 'Chargebacks, disputas, fraude, MED e indicadores regulatórios',
    icon: Layers,
    color: 'from-red-500 to-orange-600',
    audience: 'Risk',
    widgets: 10,
  },
];

export default function TemplateGallery({ onSelect, onPreview }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#2bc196]" />
        <h2 className="text-base font-bold">Templates prontos</h2>
        <Badge variant="outline" className="text-[10px]">{TEMPLATES.length} disponíveis</Badge>
      </div>
      <p className="text-xs text-slate-500 -mt-2">
        Comece com um template pronto e customize. Cada um vem pré-configurado com 8-12 widgets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TEMPLATES.map(t => (
          <Card key={t.id} className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
            <div className={cn('h-2 bg-gradient-to-r', t.color)} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', t.color)}>
                  <t.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {t.popular && (
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Popular
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px]">{t.audience}</Badge>
                </div>
              </div>
              <h3 className="font-bold text-sm mb-1">{t.name}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2 min-h-[32px]">{t.description}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500">{t.widgets} widgets</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-xs"
                    onClick={(e) => { e.stopPropagation(); onPreview?.(t); }}
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-[#2bc196] hover:bg-[#239b7a]"
                    onClick={(e) => { e.stopPropagation(); onSelect?.(t); }}
                  >
                    Usar template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Blank card */}
        <Card
          className="border-dashed cursor-pointer hover:bg-slate-50 transition flex items-center justify-center min-h-[200px]"
          onClick={() => onSelect?.({ id: 'blank', name: 'Em Branco', widgets: [] })}
        >
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
              <Layers className="w-6 h-6 text-slate-400" />
            </div>
            <p className="font-bold text-sm">Começar do zero</p>
            <p className="text-xs text-slate-500">Dashboard em branco</p>
          </div>
        </Card>
      </div>
    </div>
  );
}