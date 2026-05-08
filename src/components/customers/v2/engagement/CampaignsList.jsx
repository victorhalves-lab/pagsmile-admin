import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Mail, MessageSquare, Phone, Bell, Play, Pause, Copy, MoreVertical, Sparkles, TrendingUp, Eye, MousePointerClick, DollarSign } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const SAMPLE_CAMPAIGNS = [
  {
    id: '1', name: 'Recovery — Cartões expirando', status: 'running', goal: 'recovery',
    channels: ['email', 'whatsapp'], audience: 234, sent: 234, opened: 187, clicked: 92, converted: 41,
    revenue: 18900, openRate: 79.9, clickRate: 39.3, conversionRate: 17.5, roi: 980
  },
  {
    id: '2', name: 'Win-back VIPs Dormentes', status: 'running', goal: 'winback',
    channels: ['email'], audience: 89, sent: 89, opened: 56, clicked: 23, converted: 12,
    revenue: 8400, openRate: 62.9, clickRate: 25.8, conversionRate: 13.5, roi: 750
  },
  {
    id: '3', name: 'Welcome Sequence — Novos', status: 'running', goal: 'welcome',
    channels: ['email', 'whatsapp', 'push'], audience: 1240, sent: 1240, opened: 824, clicked: 312, converted: 156,
    revenue: 21600, openRate: 66.5, clickRate: 25.2, conversionRate: 12.6, roi: 540
  },
  {
    id: '4', name: 'A/B Test — Black Friday Teaser', status: 'scheduled', goal: 'engagement',
    channels: ['email'], audience: 8400, sent: 0, opened: 0, clicked: 0, converted: 0,
    revenue: 0, openRate: 0, clickRate: 0, conversionRate: 0, roi: 0
  },
  {
    id: '5', name: 'NPS Survey Q2', status: 'completed', goal: 'nps',
    channels: ['email'], audience: 3200, sent: 3200, opened: 1856, clicked: 768, converted: 0,
    revenue: 0, openRate: 58.0, clickRate: 24.0, conversionRate: 0, roi: 0
  },
  {
    id: '6', name: 'Upsell Premium — Top 100', status: 'paused', goal: 'upsell',
    channels: ['whatsapp'], audience: 100, sent: 67, opened: 54, clicked: 28, converted: 11,
    revenue: 11000, openRate: 80.6, clickRate: 41.8, conversionRate: 16.4, roi: 1100
  },
];

const goalConfig = {
  recovery: { label: 'Recovery', color: 'bg-orange-100 text-orange-700' },
  retention: { label: 'Retention', color: 'bg-purple-100 text-purple-700' },
  upsell: { label: 'Upsell', color: 'bg-emerald-100 text-emerald-700' },
  cross_sell: { label: 'Cross-sell', color: 'bg-blue-100 text-blue-700' },
  winback: { label: 'Win-back', color: 'bg-pink-100 text-pink-700' },
  welcome: { label: 'Welcome', color: 'bg-indigo-100 text-indigo-700' },
  engagement: { label: 'Engagement', color: 'bg-yellow-100 text-yellow-700' },
  nps: { label: 'NPS', color: 'bg-slate-100 text-slate-700' },
};

const statusConfig = {
  running: { label: 'Rodando', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500 animate-pulse' },
  scheduled: { label: 'Agendada', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  paused: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  completed: { label: 'Concluída', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
};

const channelIcons = { email: Mail, whatsapp: MessageSquare, sms: Phone, push: Bell };

export default function CampaignsList({ onCreate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = SAMPLE_CAMPAIGNS.filter(c =>
    (statusFilter === 'all' || c.status === statusFilter) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* AI Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-emerald-50 border border-purple-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">
            🚀 IA detectou: <span className="text-purple-700">3 oportunidades de campanha não exploradas</span>
          </p>
          <p className="text-xs text-slate-600">
            "Carrinho abandonado +24h" (1.2k clientes · ROI estimado 8x) · "Aniversariantes do mês" · "VIPs sem compra há 60d"
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-purple-200 text-purple-700">
          Ver sugestões IA
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar campanhas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          {['all', 'running', 'scheduled', 'paused', 'completed'].map(s => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={cn('h-9', statusFilter === s && 'bg-[#2bc196] hover:bg-[#239b7a]')}
            >
              {s === 'all' ? 'Todas' : statusConfig[s]?.label}
            </Button>
          ))}
        </div>
        <Button onClick={onCreate} className="bg-[#2bc196] hover:bg-[#239b7a]">
          <Plus className="w-4 h-4 mr-2" /> Nova Campanha
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(c => {
          const goal = goalConfig[c.goal];
          const status = statusConfig[c.status];
          return (
            <Card key={c.id} className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-sm">{c.name}</p>
                      <Badge className={cn('gap-1.5', status.color)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
                        {status.label}
                      </Badge>
                      <Badge className={goal.color}>{goal.label}</Badge>
                      <div className="flex items-center gap-1">
                        {c.channels.map(ch => {
                          const Icon = channelIcons[ch];
                          return <Icon key={ch} className="w-3.5 h-3.5 text-slate-400" />;
                        })}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      {c.audience.toLocaleString('pt-BR')} clientes na audiência
                    </p>
                  </div>

                  {/* Mini metrics */}
                  {c.status !== 'draft' && c.status !== 'scheduled' && (
                    <div className="hidden md:flex items-center gap-5 text-xs">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-500"><Eye className="w-3 h-3" /> Open</div>
                        <p className="font-bold text-blue-700">{c.openRate.toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-500"><MousePointerClick className="w-3 h-3" /> Click</div>
                        <p className="font-bold text-purple-700">{c.clickRate.toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-500"><TrendingUp className="w-3 h-3" /> Conv</div>
                        <p className="font-bold text-emerald-700">{c.conversionRate.toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-slate-500"><DollarSign className="w-3 h-3" /> Revenue</div>
                        <p className="font-bold text-emerald-700">{formatCurrency(c.revenue)}</p>
                      </div>
                      {c.roi > 0 && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                          ROI {c.roi}%
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {c.status === 'running' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info('Campanha pausada')}>
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    {(c.status === 'paused' || c.status === 'draft') && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => toast.success('Campanha iniciada')}>
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cancelar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}