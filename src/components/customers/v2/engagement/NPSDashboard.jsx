import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Heart, Frown, Meh, Smile, Send, MessageSquare, AlertTriangle, Sparkles } from 'lucide-react';

const trendData = Array.from({ length: 12 }).map((_, i) => ({
  month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
  nps: Math.round(45 + Math.sin(i / 2) * 10 + i * 1.5),
}));

const distributionData = [
  { score: '0', count: 12, type: 'detractor' },
  { score: '1', count: 8, type: 'detractor' },
  { score: '2', count: 18, type: 'detractor' },
  { score: '3', count: 24, type: 'detractor' },
  { score: '4', count: 31, type: 'detractor' },
  { score: '5', count: 56, type: 'detractor' },
  { score: '6', count: 78, type: 'detractor' },
  { score: '7', count: 142, type: 'passive' },
  { score: '8', count: 268, type: 'passive' },
  { score: '9', count: 412, type: 'promoter' },
  { score: '10', count: 624, type: 'promoter' },
];

const recentResponses = [
  { name: 'Mariana Silva', score: 10, comment: 'Plataforma excelente! Atendimento nota 10.', date: '2h atrás', category: 'promoter' },
  { name: 'Carlos Santos', score: 6, comment: 'Funciona, mas a interface poderia ser mais intuitiva.', date: '5h atrás', category: 'detractor', followUp: 'pending' },
  { name: 'Ana Costa', score: 9, comment: 'Recomendo para outros lojistas. Suporte é diferencial.', date: '1d atrás', category: 'promoter' },
  { name: 'Roberto Lima', score: 4, comment: 'Tive problemas com chargebacks que demoraram para resolver.', date: '1d atrás', category: 'detractor', followUp: 'pending' },
  { name: 'Pedro Souza', score: 8, comment: 'Boa experiência geral.', date: '2d atrás', category: 'passive' },
];

const categoryConfig = {
  promoter: { icon: Smile, color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  passive: { icon: Meh, color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  detractor: { icon: Frown, color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

export default function NPSDashboard() {
  return (
    <div className="space-y-4">
      {/* NPS Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/30 border-emerald-200 lg:col-span-1">
          <CardContent className="p-5 text-center">
            <Heart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">NPS Score</p>
            <p className="text-6xl font-bold text-emerald-700 my-2">62</p>
            <Badge className="bg-emerald-100 text-emerald-700 border-0">
              ↑ 5 pontos vs trimestre anterior
            </Badge>
            <p className="text-xs text-slate-500 mt-3">Categoria: <strong>Excelente</strong> (50-70)</p>
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <p className="text-sm font-bold mb-3">Distribuição de Respostas</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                <Smile className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-700">71%</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">Promotores (9-10)</p>
                <p className="text-[10px] text-slate-500 mt-1">1.036 respostas</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
                <Meh className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-yellow-700">20%</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-yellow-600">Neutros (7-8)</p>
                <p className="text-[10px] text-slate-500 mt-1">410 respostas</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
                <Frown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-700">9%</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-red-600">Detratores (0-6)</p>
                <p className="text-[10px] text-slate-500 mt-1">227 respostas · 9 sem follow-up!</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="score" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#2bc196" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold">Evolução do NPS — 12 meses</p>
              <p className="text-xs text-slate-500">Tendência de satisfação dos clientes</p>
            </div>
            <Button variant="outline" size="sm"><Send className="w-3 h-3 mr-1.5" /> Disparar Pesquisa</Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip />
              <Line type="monotone" dataKey="nps" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detractor Alert */}
      <Card className="bg-gradient-to-r from-red-50 via-white to-orange-50 border-red-200">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-900">⚠️ 9 detratores aguardando follow-up</p>
            <p className="text-xs text-red-700 mt-0.5">Clientes que deram nota ≤ 6 e ainda não foram contactados. Resposta dentro de 24h converte 47% em promoters.</p>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            Ver Lista
          </Button>
        </CardContent>
      </Card>

      {/* Recent responses */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Respostas Recentes</p>
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="space-y-2">
            {recentResponses.map((r, i) => {
              const cfg = categoryConfig[r.category];
              const Icon = cfg.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
                  <div className={`w-8 h-8 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{r.name}</p>
                      <Badge className={cfg.color}>Score {r.score}</Badge>
                      {r.followUp === 'pending' && (
                        <Badge className="bg-orange-100 text-orange-700 border-0 text-[10px]">⏰ Follow-up pendente</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 mt-1 italic">"{r.comment}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">{r.date}</p>
                  </div>
                  {r.followUp === 'pending' && (
                    <Button size="sm" variant="outline" className="text-xs h-7 flex-shrink-0">
                      <MessageSquare className="w-3 h-3 mr-1" /> Contatar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}