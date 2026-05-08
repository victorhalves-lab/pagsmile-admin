import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, Mail, Clock, Users, GitBranch, Play, Pause, Edit, Sparkles, MessageSquare, ArrowRight, CheckCircle2, MoreVertical, Phone } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SAMPLE_FLOWS = [
  {
    id: '1', name: 'Recovery — Carrinho abandonado', isActive: true, runs: 1240, conversions: 187, conversionRate: 15.1,
    nodes: [
      { type: 'trigger', label: 'Carrinho abandonado', icon: Zap, color: 'purple' },
      { type: 'wait', label: 'Esperar 1h', icon: Clock, color: 'slate' },
      { type: 'action', label: 'Email lembrete', icon: Mail, color: 'blue' },
      { type: 'condition', label: 'Abriu?', icon: GitBranch, color: 'yellow' },
      { type: 'action', label: 'WhatsApp + 5% off', icon: MessageSquare, color: 'emerald' },
    ]
  },
  {
    id: '2', name: 'Welcome Series — 7 dias', isActive: true, runs: 423, conversions: 89, conversionRate: 21.0,
    nodes: [
      { type: 'trigger', label: 'Cliente cadastrado', icon: Users, color: 'purple' },
      { type: 'action', label: 'Welcome email', icon: Mail, color: 'blue' },
      { type: 'wait', label: 'Esperar 2 dias', icon: Clock, color: 'slate' },
      { type: 'action', label: 'Tutorial WhatsApp', icon: MessageSquare, color: 'emerald' },
      { type: 'wait', label: 'Esperar 5 dias', icon: Clock, color: 'slate' },
      { type: 'action', label: 'Cupom 1ª compra', icon: Mail, color: 'blue' },
    ]
  },
  {
    id: '3', name: 'Cartão expirando — Auto-update', isActive: true, runs: 156, conversions: 134, conversionRate: 85.9,
    nodes: [
      { type: 'trigger', label: 'Cartão expira em 30d', icon: Zap, color: 'purple' },
      { type: 'action', label: 'Account Updater', icon: CheckCircle2, color: 'emerald' },
      { type: 'condition', label: 'Atualizou?', icon: GitBranch, color: 'yellow' },
      { type: 'action', label: 'Email solicitando', icon: Mail, color: 'blue' },
      { type: 'wait', label: 'Esperar 3d', icon: Clock, color: 'slate' },
      { type: 'action', label: 'WhatsApp lembrete', icon: MessageSquare, color: 'emerald' },
    ]
  },
  {
    id: '4', name: 'NPS Pós-Compra', isActive: false, runs: 0, conversions: 0, conversionRate: 0,
    nodes: [
      { type: 'trigger', label: 'Compra concluída', icon: Zap, color: 'purple' },
      { type: 'wait', label: 'Esperar 7 dias', icon: Clock, color: 'slate' },
      { type: 'action', label: 'NPS Survey', icon: Mail, color: 'blue' },
      { type: 'condition', label: 'Score?', icon: GitBranch, color: 'yellow' },
    ]
  },
];

const colorMap = {
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

function FlowVisualization({ nodes }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
      {nodes.map((n, i) => {
        const Icon = n.icon;
        return (
          <React.Fragment key={i}>
            <div className={cn('flex flex-col items-center gap-1 min-w-[80px]')}>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center border', colorMap[n.color])}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[9px] text-slate-600 text-center font-medium leading-tight">{n.label}</p>
            </div>
            {i < nodes.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 flex-shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function AutomationsBuilder() {
  const [builderOpen, setBuilderOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 via-white to-purple-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">⚡ 4 automações ativas · Recuperaram <span className="text-emerald-700">R$ 12.4k</span> nos últimos 7 dias</p>
          <p className="text-xs text-slate-600">Workflows executam 24/7 sem ação manual</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{SAMPLE_FLOWS.length} workflows configurados</p>
        <Button onClick={() => setBuilderOpen(true)} className="bg-[#2bc196] hover:bg-[#239b7a]">
          <Plus className="w-4 h-4 mr-2" /> Novo Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {SAMPLE_FLOWS.map(flow => (
          <Card key={flow.id} className={cn('hover:shadow-md transition-all', !flow.isActive && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{flow.name}</p>
                    <Badge className={flow.isActive ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-100 text-slate-600 border-0'}>
                      <span className={cn('w-1.5 h-1.5 rounded-full mr-1', flow.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400')} />
                      {flow.isActive ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span><strong className="text-slate-700">{flow.runs.toLocaleString('pt-BR')}</strong> execuções</span>
                    <span><strong className="text-emerald-700">{flow.conversions}</strong> conversões</span>
                    <span><strong className="text-purple-700">{flow.conversionRate}%</strong> taxa</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(flow.isActive ? 'Pausado' : 'Ativado')}>
                    {flow.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-3.5 h-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3">
                <FlowVisualization nodes={flow.nodes} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Builder Dialog (simplified) */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> Visual Workflow Builder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="flex flex-col h-20"><Zap className="w-5 h-5 mb-1 text-purple-600" /><span className="text-xs">Trigger</span></Button>
              <Button variant="outline" className="flex flex-col h-20"><Mail className="w-5 h-5 mb-1 text-blue-600" /><span className="text-xs">Email</span></Button>
              <Button variant="outline" className="flex flex-col h-20"><MessageSquare className="w-5 h-5 mb-1 text-emerald-600" /><span className="text-xs">WhatsApp</span></Button>
              <Button variant="outline" className="flex flex-col h-20"><Phone className="w-5 h-5 mb-1 text-purple-600" /><span className="text-xs">SMS</span></Button>
              <Button variant="outline" className="flex flex-col h-20"><Clock className="w-5 h-5 mb-1 text-slate-600" /><span className="text-xs">Esperar</span></Button>
              <Button variant="outline" className="flex flex-col h-20"><GitBranch className="w-5 h-5 mb-1 text-yellow-600" /><span className="text-xs">Condição</span></Button>
            </div>
            <div className="bg-slate-50 rounded-xl p-8 border-2 border-dashed border-slate-300 text-center">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700 mb-1">Arraste blocos para construir seu workflow</p>
              <p className="text-xs text-slate-500">Ou descreva em linguagem natural — IA monta para você</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}