import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, TrendingUp, AlertTriangle, Search, DollarSign, 
  ArrowRight, ThumbsUp, ThumbsDown, MessageSquare
} from 'lucide-react';

const InsightCard = ({ type, title, description, time, impact, actions }) => {
  const styles = {
    risk: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    opportunity: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    operational: { icon: Search, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    financial: { icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  };

  const style = styles[type] || styles.operational;
  const Icon = style.icon;

  return (
    <Card className={`border-l-4 ${type === 'risk' ? 'border-l-red-500' : type === 'opportunity' ? 'border-l-emerald-500' : type === 'financial' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${style.bg}`}>
            <Icon className={`w-6 h-6 ${style.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{type}</Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-500" /> Gerado por DIA
                </span>
              </div>
              <span className="text-xs text-slate-400">{time}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{description}</p>
            
            {impact && (
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg mb-4 text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Impacto Estimado: </span>
                <span className="text-slate-600 dark:text-slate-400">{impact}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {actions.map((action, i) => (
                <Button key={i} size="sm" variant={i === 0 ? "default" : "outline"} className={i === 0 ? "bg-slate-900 text-white hover:bg-slate-800" : ""}>
                  {action}
                </Button>
              ))}
              <div className="ml-auto flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-green-600">
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600">
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DIAInsightsView() {
  const insights = [
    {
      type: 'risk',
      title: 'Risco de VDMP: Merchant "Eletrônicos Express"',
      description: 'O merchant atingiu ratio de 0.95% com 15 chargebacks nas últimas 48h. A projeção indica entrada no programa VDMP em 15 dias se a tendência continuar.',
      time: 'Há 2 horas',
      impact: 'Possível multa de $25k e bloqueio do merchant.',
      actions: ['Ver Análise de Risco', 'Contatar Merchant', 'Suspender Temporariamente']
    },
    {
      type: 'opportunity',
      title: 'Oportunidade de Antecipação: "Mega Loja Online"',
      description: 'Cliente aumentou TPV em 40% este mês e tem recebíveis disponíveis. Padrão de saque indica necessidade de fluxo de caixa.',
      time: 'Há 4 horas',
      impact: 'Potencial receita adicional de R$ 15k/mês em taxas.',
      actions: ['Simular Proposta', 'Enviar Oferta Automática']
    },
    {
      type: 'operational',
      title: 'Gargalo em Análise de KYC',
      description: 'A fila de análise manual cresceu 300% hoje devido à campanha de marketing. O tempo médio de espera subiu para 48h (SLA é 24h).',
      time: 'Há 30 minutos',
      impact: 'Risco de churn de 15% nos novos cadastros.',
      actions: ['Alocar Mais Analistas', 'Aprovar Baixo Risco Automaticamente']
    },
    {
      type: 'financial',
      title: 'Divergência em Conciliação Pix',
      description: 'Detectada diferença de R$ 4.500,00 entre registros internos e extrato do BACEN no lote das 10:00.',
      time: 'Há 1 hora',
      impact: 'Bloqueio de liquidação do lote.',
      actions: ['Ver Relatório de Conciliação', 'Iniciar Ajuste Manual']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Central de Insights DIA
          </h2>
          <p className="text-slate-500">Análises proativas e recomendações do seu copiloto inteligente.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat com DIA
          </Button>
          <Button>
            Configurar Alertas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, i) => (
          <InsightCard key={i} {...insight} />
        ))}
      </div>

      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
        <CardContent className="p-8 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Quer insights mais específicos?</h3>
            <p className="text-slate-300 max-w-xl">
              O DIA pode analisar dados específicos sob demanda. Peça para ele analisar um merchant, 
              uma tendência de mercado ou um comportamento de fraude.
            </p>
          </div>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
            <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
            Pedir Nova Análise
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}