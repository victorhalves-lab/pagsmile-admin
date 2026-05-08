import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Gem, Star, Award, Sparkles, Settings, Users, Gift, TrendingUp } from 'lucide-react';

const TIERS = [
  { name: 'Bronze', icon: Award, color: '#A16207', bg: 'from-amber-700/10 to-amber-700/5', minPoints: 0, members: 8420, multiplier: '1x', benefits: ['1 ponto por R$ 1', 'Suporte padrão'] },
  { name: 'Prata', icon: Star, color: '#64748B', bg: 'from-slate-500/10 to-slate-500/5', minPoints: 500, members: 3680, multiplier: '1.2x', benefits: ['1.2x pontos', 'Frete grátis acima R$ 100', 'Cupom aniversário'] },
  { name: 'Ouro', icon: Crown, color: '#F59E0B', bg: 'from-amber-500/10 to-amber-500/5', minPoints: 2000, members: 1240, multiplier: '1.5x', benefits: ['1.5x pontos', 'Frete grátis sempre', 'Acesso antecipado', 'Suporte prioritário'] },
  { name: 'Diamante', icon: Gem, color: '#8B5CF6', bg: 'from-purple-500/10 to-purple-500/5', minPoints: 10000, members: 142, multiplier: '2x', benefits: ['2x pontos', 'Concierge pessoal', 'Eventos exclusivos', 'Cashback 5%'] },
];

export default function LoyaltyView() {
  return (
    <div className="space-y-4">
      {/* Header card */}
      <Card className="bg-gradient-to-r from-purple-50 via-white to-amber-50 border-purple-100">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Programa de Fidelidade</p>
                <p className="text-xl font-bold">PagSmile Rewards</p>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" /> Ativo
                </Badge>
              </div>
            </div>
            <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Configurar</Button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <Users className="w-3.5 h-3.5 text-purple-600 mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Membros</p>
              <p className="text-xl font-bold text-purple-700">13.5k</p>
              <p className="text-[10px] text-slate-500">+12% MoM</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <Star className="w-3.5 h-3.5 text-amber-600 mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pontos Emitidos</p>
              <p className="text-xl font-bold text-amber-700">8.2M</p>
              <p className="text-[10px] text-slate-500">últimos 90d</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <Gift className="w-3.5 h-3.5 text-emerald-600 mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pontos Resgatados</p>
              <p className="text-xl font-bold text-emerald-700">2.1M</p>
              <p className="text-[10px] text-slate-500">25.6% redemption</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Repeat Rate Members</p>
              <p className="text-xl font-bold text-blue-700">78%</p>
              <p className="text-[10px] text-slate-500">vs 42% não-membros</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiers */}
      <div>
        <p className="text-sm font-bold text-slate-900 mb-3">Tiers do Programa</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <Card key={tier.name} className={`bg-gradient-to-br ${tier.bg}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tier.color + '25', color: tier.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">Tier {i + 1}</Badge>
                  </div>
                  <p className="font-bold text-lg" style={{ color: tier.color }}>{tier.name}</p>
                  <p className="text-xs text-slate-500 mb-3">A partir de {tier.minPoints} pontos</p>

                  <div className="bg-white/70 backdrop-blur rounded-lg p-2.5 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">Membros</span>
                      <span className="font-bold text-sm">{tier.members.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Multiplicador</span>
                      <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.multiplier}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Benefícios</p>
                    {tier.benefits.map((b, j) => (
                      <p key={j} className="text-[11px] text-slate-700">✓ {b}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-purple-50/40 to-emerald-50/40 border-purple-100">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-slate-900 mb-1">💡 Insights de Loyalty</p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>• <strong>78% repeat rate</strong> entre membros vs <strong>42%</strong> não-membros — programa está funcionando</li>
              <li>• <strong>156 clientes</strong> a 1-2 compras de subir para Diamante — campanha de upgrade pode acelerar</li>
              <li>• <strong>Bronze → Prata</strong> tem maior conversão (38%) — investir mais em retenção Bronze</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}