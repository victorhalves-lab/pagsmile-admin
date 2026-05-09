import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Heart, AlertTriangle, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from '@/lib/utils';

const HEALTH_DISTRIBUTION = [
  { range: 'Excelente (90-100)', count: 142, color: 'bg-emerald-500', pct: 38 },
  { range: 'Bom (70-89)', count: 168, color: 'bg-emerald-300', pct: 45 },
  { range: 'Médio (50-69)', count: 42, color: 'bg-amber-400', pct: 11 },
  { range: 'Baixo (30-49)', count: 18, color: 'bg-orange-500', pct: 5 },
  { range: 'Crítico (0-29)', count: 4, color: 'bg-red-600', pct: 1 },
];

const AT_RISK = [
  { name: 'TechFail Ltda', mrr: 890, score: 18, reason: 'Sem login há 32 dias + 2 tickets abertos', initials: 'TF' },
  { name: 'StartupBeta', mrr: 450, score: 24, reason: 'Downgrade recente + queda de uso 60%', initials: 'SB' },
  { name: 'OldCorp', mrr: 1200, score: 28, reason: 'Cartão expirado + 3 falhas de cobrança', initials: 'OC' },
  { name: 'SmallShop', mrr: 320, score: 32, reason: 'Solicitou cancelamento na última call', initials: 'SS' },
  { name: 'MidsizeBiz', mrr: 780, score: 38, reason: 'Reduziu uso 45% nos últimos 30 dias', initials: 'MB' },
];

const CHAMPIONS = [
  { name: 'Acme Inc', mrr: 4500, score: 98, reason: '12 meses fiéis + indicou 3 clientes', initials: 'AI' },
  { name: 'BigCo Group', mrr: 3200, score: 96, reason: 'NPS 10 + uso intenso de features avançadas', initials: 'BG' },
  { name: 'Globex Corp', mrr: 2800, score: 94, reason: 'Upgrade recente + cliente case', initials: 'GC' },
  { name: 'TechMaster', mrr: 1900, score: 92, reason: 'Equipe inteira ativa diariamente', initials: 'TM' },
  { name: 'EnterpriseX', mrr: 5400, score: 91, reason: 'Pronto para upsell para Enterprise', initials: 'EX' },
];

export default function CustomerHealthTab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {/* Health distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-pink-500" />
            Distribuição de Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {HEALTH_DISTRIBUTION.map(h => (
              <div key={h.range} className="flex items-center gap-3">
                <div className="w-44 text-xs font-medium">{h.range}</div>
                <div className="flex-1 h-7 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className={cn('h-full flex items-center px-2 transition-all', h.color)}
                    style={{ width: `${h.pct}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">{h.pct}%</span>
                  </div>
                </div>
                <div className="w-16 text-right text-xs">
                  <span className="font-bold">{h.count}</span>
                  <span className="text-slate-500"> clientes</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-600">
              <strong>374 clientes</strong> ativos · <strong>22 em risco</strong> (6%) · <strong>Health médio: 78</strong>
            </p>
            <Badge className="bg-emerald-100 text-emerald-700">+4pts vs mês passado</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Two columns: At-risk + Champions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* At-risk */}
        <Card className="border-red-200">
          <CardHeader className="pb-3 bg-red-50 rounded-t-2xl">
            <CardTitle className="text-sm flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-3.5 h-3.5" />
              Clientes em risco (Top 5)
            </CardTitle>
            <p className="text-[10px] text-red-600">Maior probabilidade de churn nos próximos 30 dias</p>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {AT_RISK.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-red-100 text-red-700 text-xs font-bold">{c.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{c.name}</p>
                    <Badge className="bg-red-100 text-red-700 text-[10px] h-4">Score {c.score}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{c.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">R$ {c.mrr}</p>
                  <p className="text-[10px] text-slate-500">/mês</p>
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8 mt-2 text-xs gap-1.5 border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => navigate(createPageUrl('RecoveryAgent'))}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Acionar Recovery Agent
              <ArrowRight className="w-3 h-3" />
            </Button>
          </CardContent>
        </Card>

        {/* Champions */}
        <Card className="border-emerald-200">
          <CardHeader className="pb-3 bg-emerald-50 rounded-t-2xl">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-700">
              <Trophy className="w-3.5 h-3.5" />
              Champions (Top 5)
            </CardTitle>
            <p className="text-[10px] text-emerald-600">Candidatos a upsell, case study e indicação</p>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {CHAMPIONS.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">{c.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{c.name}</p>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px] h-4">Score {c.score}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{c.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">R$ {c.mrr.toLocaleString('pt-BR')}</p>
                  <p className="text-[10px] text-slate-500">/mês</p>
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8 mt-2 text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Campanha de upsell para champions
              <ArrowRight className="w-3 h-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}