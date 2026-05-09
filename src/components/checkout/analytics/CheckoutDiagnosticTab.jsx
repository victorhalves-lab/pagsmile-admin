import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp, Target, Wand2, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

const TOP_OPPORTUNITIES = [
  {
    severity: 'critical',
    title: 'Drop-off de 47% no campo CPF',
    impact: '+R$ 12.400 / mês',
    description: 'Validação inline está rejeitando CPFs válidos com mascaramento incorreto. Ajustar regex resolveria 78% dos abandonos neste passo.',
    confidence: 92,
  },
  {
    severity: 'high',
    title: 'Tempo de carregamento PIX > 8s',
    impact: '+R$ 8.200 / mês',
    description: 'QR Code está sendo gerado server-side de forma síncrona. Pré-gerar reduziria de 8s para 1.2s e diminuiria timeout de 11% para 2%.',
    confidence: 88,
  },
  {
    severity: 'medium',
    title: 'Falta de selo de segurança visível',
    impact: '+R$ 4.100 / mês',
    description: 'Heatmap mostra usuários hesitando antes de inserir cartão. Adicionar selos de SSL/PCI próximo ao formulário aumenta confiança em ~6pp.',
    confidence: 75,
  },
];

const DROPOFF_BY_FIELD = [
  { field: 'CPF/CNPJ', dropRate: 47, sessions: 1240 },
  { field: 'Endereço (CEP)', dropRate: 22, sessions: 580 },
  { field: 'Cartão - Número', dropRate: 18, sessions: 470 },
  { field: 'Cartão - CVV', dropRate: 12, sessions: 310 },
  { field: 'Email', dropRate: 8, sessions: 210 },
  { field: 'Nome', dropRate: 4, sessions: 100 },
];

const SEVERITY_STYLES = {
  critical: { bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', icon: AlertTriangle, iconColor: 'text-red-600' },
  high: { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: TrendingUp, iconColor: 'text-amber-600' },
  medium: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: Target, iconColor: 'text-blue-600' },
};

export default function CheckoutDiagnosticTab() {
  const navigate = useNavigate();

  const totalImpact = TOP_OPPORTUNITIES.reduce((sum, op) => {
    const num = parseInt(op.impact.replace(/[^\d]/g, ''));
    return sum + num;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Hero summary */}
      <Card className="bg-gradient-to-br from-[#2bc196]/10 via-white to-blue-50 border-[#2bc196]/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-500 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-slate-500">Diagnóstico Helena IA</p>
                <h2 className="text-xl font-black text-slate-900">Potencial de receita não capturada</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Identifiquei <strong>3 oportunidades críticas</strong> no seu funil de checkout
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-slate-500">Impacto estimado</p>
              <p className="text-3xl font-black text-emerald-600">+R$ {totalImpact.toLocaleString('pt-BR')}</p>
              <p className="text-xs text-slate-500">/mês se aplicar todas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 opportunities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2bc196]" />
            Top 3 Oportunidades
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {TOP_OPPORTUNITIES.map((op, i) => {
            const cfg = SEVERITY_STYLES[op.severity];
            const Icon = cfg.icon;
            return (
              <div key={i} className={cn('rounded-xl border p-4', cfg.bg)}>
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 bg-white rounded-lg', cfg.iconColor)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-slate-900">{op.title}</h3>
                      <Badge className={cfg.badge}>{op.severity === 'critical' ? 'Crítico' : op.severity === 'high' ? 'Alto' : 'Médio'}</Badge>
                      <Badge variant="outline" className="gap-1 bg-white">
                        <Sparkles className="w-2.5 h-2.5 text-[#2bc196]" />
                        {op.confidence}% confiança
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{op.description}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-emerald-600">{op.impact}</p>
                      <Button
                        size="sm"
                        className="h-7 gap-1 bg-[#2bc196] hover:bg-[#239b7a]"
                        onClick={() => navigate(createPageUrl('ConverterAgent'))}
                      >
                        <Zap className="w-3.5 h-3.5" /> Aplicar correção
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Before/After simulator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Simulador Antes / Depois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Hoje</p>
              <p className="text-3xl font-black text-slate-700 mt-1">12.4%</p>
              <p className="text-xs text-slate-500 mt-1">Conversão atual</p>
            </div>
            <div className="text-center">
              <ArrowRight className="w-8 h-8 text-[#2bc196] mx-auto" />
              <p className="text-xs font-semibold text-[#2bc196] mt-1">Após correções</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center border-2 border-emerald-200">
              <p className="text-[10px] uppercase font-bold text-emerald-600">Projetado</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">17.2%</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">+4.8pp · +R$ 24.700/mês</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop-off por elemento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Drop-off por elemento do checkout</CardTitle>
          <p className="text-xs text-slate-500">Quais campos do formulário causam mais abandono</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {DROPOFF_BY_FIELD.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium truncate">{row.field}</div>
              <div className="flex-1 h-6 bg-slate-100 rounded-md overflow-hidden relative">
                <div
                  className={cn(
                    'h-full flex items-center justify-end pr-2 text-[10px] font-bold text-white',
                    row.dropRate > 30 ? 'bg-red-500' : row.dropRate > 15 ? 'bg-amber-500' : 'bg-blue-500'
                  )}
                  style={{ width: `${row.dropRate}%` }}
                >
                  {row.dropRate}%
                </div>
              </div>
              <div className="w-20 text-right text-xs text-slate-500">{row.sessions} sessões</div>
            </div>
          ))}
          <div className="pt-2 border-t mt-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(createPageUrl('ConverterAgent'))}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2bc196]" />
              Otimizar com Converter Agent
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}