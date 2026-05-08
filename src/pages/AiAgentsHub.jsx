import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Sparkles, Bot, TrendingUp, ShoppingCart, ShieldAlert, UserCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';

const agents = [
  { id: 'dia', name: 'DIA Copilot', role: 'Copiloto inteligente', description: 'Aprende com sua operação. Responde em linguagem natural, gera insights cruzados e executa ações repetitivas.', Icon: Sparkles, page: 'DIACopilot', settingsPage: 'SettingsPage', color: 'from-violet-500 to-fuchsia-600', metrics: [{ label: 'Insights', value: '184' }, { label: 'Ações', value: '47' }, { label: 'Tempo', value: '12h' }], capabilities: ['Análise cross-tela', 'Sugestões proativas', 'Ações automáticas'] },
  { id: 'recovery', name: 'Recovery Agent', role: 'Recuperador de pagamentos', description: 'Detecta cobranças falhas, otimiza retentativa, dispara dunning multi-canal e reduz churn.', Icon: TrendingUp, page: 'RecoveryAgent', settingsPage: 'DunningSettings', color: 'from-emerald-500 to-cyan-600', metrics: [{ label: 'MRR rec.', value: 'R$ 18.4k' }, { label: 'Taxa', value: '34%' }, { label: 'Salvos', value: '127' }], capabilities: ['Retentativa otimizada', 'Dunning auto', 'Multi-canal'] },
  { id: 'converter', name: 'Converter Agent', role: 'Otimizador de checkout', description: 'Analisa abandono, sugere ajustes, executa A/B tests e aumenta conversão.', Icon: ShoppingCart, page: 'ConverterAgent', settingsPage: 'ConverterAgentSettings', color: 'from-orange-500 to-red-600', metrics: [{ label: 'Conv.', value: '4.2%' }, { label: 'Lift', value: '+12%' }, { label: 'Testes', value: '3' }], capabilities: ['Análise abandono', 'A/B test auto', 'Sugestões UX'] },
  { id: 'dispute', name: 'Dispute Manager', role: 'Gestor de disputas', description: 'Avalia probabilidade de ganho, gera narrativa, monta evidências e aplica auto-reembolso.', Icon: ShieldAlert, page: 'DisputeManager', settingsPage: 'DisputeManagerSettings', color: 'from-blue-500 to-indigo-600', metrics: [{ label: 'Win rate', value: '68%' }, { label: 'Geridas', value: '42' }, { label: 'Protegido', value: 'R$ 24k' }], capabilities: ['Win-prob.', 'Narrativa', 'Pré-CB'] },
  { id: 'origination', name: 'Origination Agent', role: 'Onboarding inteligente', description: 'Conduz onboarding via chat, valida documentos em tempo real e reduz tempo de ativação.', Icon: UserCheck, page: 'OriginationAgent', settingsPage: 'OriginationAgentSettings', color: 'from-pink-500 to-rose-600', metrics: [{ label: 'Tempo', value: '14 min' }, { label: 'Conv.', value: '78%' }, { label: 'KYC', value: '92%' }], capabilities: ['Chat', 'Validação docs', 'Liveness'] },
];

export default function AiAgentsHub() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hub de Agentes IA" subtitle="5 agentes especializados trabalhando 24/7" icon={Bot} sparkles
        actions={<Button size="sm" className="bg-gradient-to-r from-[#2bc196] to-emerald-600 gap-2"><Zap className="w-4 h-4" /> Configurar todos</Button>} />

      <div className="rounded-2xl border border-[#2bc196]/30 bg-gradient-to-r from-[#2bc196]/10 via-violet-500/5 to-blue-500/5 p-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gradient-to-br from-[#2bc196]/20 to-violet-500/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-[#2bc196] text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3" /> Família PagSmile AI
          </div>
          <h2 className="text-2xl font-bold mb-2">Cinco agentes. Uma operação inteligente.</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mb-4">
            Cada agente é especialista em um domínio crítico. Trabalhando juntos cobrem 80% das decisões repetitivas.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            {['Auditável', 'Escalonamento humano', 'Configurável', 'Aprende'].map((t) => (
              <div key={t} className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2bc196]" /> {t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {agents.map((a) => {
          const Icon = a.Icon;
          return (
            <div key={a.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg hover:border-[#2bc196]/40 transition-all">
              <div className={cn('h-1.5 bg-gradient-to-r', a.color)} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', a.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo
                  </Badge>
                </div>
                <h3 className="text-lg font-bold">{a.name}</h3>
                <p className="text-xs text-[#2bc196] font-semibold uppercase tracking-wider mb-2">{a.role}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 min-h-[60px]">{a.description}</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {a.metrics.map((m, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
                      <p className="text-base font-bold">{m.value}</p>
                      <p className="text-[9px] text-slate-500">{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {a.capabilities.map((c, i) => (<Badge key={i} variant="secondary" className="text-[10px]">{c}</Badge>))}
                </div>
                <div className="flex gap-2">
                  <Link to={createPageUrl(a.page)} className="flex-1">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                      Abrir <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl(a.settingsPage)}><Button variant="outline">Config</Button></Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}