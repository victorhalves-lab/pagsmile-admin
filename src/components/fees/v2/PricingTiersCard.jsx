import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

const TIERS = [
  { id: 'standard', name: 'Standard', range: 'até R$ 100k/mês', mdrCard: 2.99, mdrPix: 0.99, features: ['MDR padrão', 'Suporte email', 'Webhooks', 'Antifraude básico'], color: 'slate', current: true },
  { id: 'pro', name: 'Pro', range: 'R$ 100k – R$ 1M/mês', mdrCard: 2.79, mdrPix: 0.79, features: ['MDR -0.20pp', 'Suporte priorizado', 'Webhooks ilimitados', 'Antifraude avançado', 'Account Updater'], color: 'blue', next: true },
  { id: 'enterprise', name: 'Enterprise', range: 'acima R$ 1M/mês', mdrCard: 2.49, mdrPix: 0.59, features: ['MDR -0.50pp', 'CSM dedicado', 'SLA 99.99%', 'SSO/SAML', 'Multi-tenant', 'Custom routing'], color: 'purple' },
];

const COLOR_MAP = {
  slate: { border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-600' },
  blue: { border: 'border-blue-300', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-600' },
  purple: { border: 'border-purple-300', bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-600' },
};

export default function PricingTiersCard() {
  const currentVolume = 95000;
  const proThreshold = 100000;
  const progressToPro = (currentVolume / proThreshold) * 100;

  return (
    <div className="space-y-3">
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Você está perto do próximo Tier</p>
                <p className="text-[11px] text-amber-700">Volume mensal: R$ {currentVolume.toLocaleString('pt-BR')} de R$ {proThreshold.toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-700">{progressToPro.toFixed(0)}%</p>
          </div>
          <Progress value={progressToPro} className="h-2 mb-2" />
          <p className="text-[11px] text-amber-700">
            ⚡ Faltam <span className="font-bold">R$ {(proThreshold - currentVolume).toLocaleString('pt-BR')}</span> para desbloquear Tier Pro · economia estimada <span className="font-bold">R$ 1.900/mês</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" /> Pricing Tiers · Trajetória de Upgrade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {TIERS.map((t) => {
              const c = COLOR_MAP[t.color];
              return (
                <div
                  key={t.id}
                  className={`relative rounded-xl border-2 p-3 ${c.border} ${c.bg} ${t.current ? 'ring-2 ring-[#2bc196] ring-offset-2' : ''}`}
                >
                  {t.current && (
                    <Badge className="absolute -top-2 left-3 bg-[#2bc196] text-white text-[9px] border-0">Seu plano</Badge>
                  )}
                  {t.next && (
                    <Badge className="absolute -top-2 left-3 bg-amber-500 text-white text-[9px] border-0">Próximo</Badge>
                  )}

                  <div className="text-center mb-3">
                    <p className={`text-base font-bold ${c.text}`}>{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.range}</p>
                  </div>

                  <div className="text-center mb-3 py-2 bg-white rounded-lg">
                    <p className="text-[10px] text-slate-500">MDR Crédito Vista</p>
                    <p className={`text-2xl font-bold ${c.text}`}>{t.mdrCard.toFixed(2)}%</p>
                    <p className="text-[10px] text-slate-500">PIX: {t.mdrPix.toFixed(2)}%</p>
                  </div>

                  <ul className="space-y-1 mb-3">
                    {t.features.map((f, i) => (
                      <li key={i} className="text-[10px] text-slate-700 flex items-start gap-1">
                        <CheckCircle2 className={`w-3 h-3 ${c.text} flex-shrink-0 mt-0.5`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {!t.current && (
                    <Button size="sm" className={`w-full text-[10px] h-7 ${c.badge} hover:opacity-90 text-white`}>
                      {t.next ? 'Ver elegibilidade' : 'Solicitar contato'} <ArrowRight className="w-3 h-3 ml-1" />
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