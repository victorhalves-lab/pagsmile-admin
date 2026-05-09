import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, X, ArrowRight, Users, Shield, Globe, Building2 } from 'lucide-react';

const INSIGHTS = [
  { id: 'backup-admin', icon: Users, title: 'Você só tem 1 admin ativo', desc: 'Recomendamos adicionar um backup admin para resilience operacional', cta: 'Convidar admin', section: 'users', color: 'amber' },
  { id: 'webauthn', icon: Shield, title: 'Habilite WebAuthn / Passkeys', desc: 'Mais seguro que TOTP/SMS. Compatível com Face ID, Touch ID e YubiKey.', cta: 'Habilitar', section: 'security', color: 'blue' },
  { id: 'ip-allowlist', icon: Globe, title: '5 logins de IPs novos nos últimos 7d', desc: 'Configure IP Allowlist para reduzir superfície de ataque', cta: 'Configurar', section: 'security', color: 'red' },
  { id: 'fiscal', icon: Building2, title: 'Regime tributário não declarado', desc: 'Necessário para emissão de NF-e e compliance fiscal BR', cta: 'Declarar', section: 'fiscal', color: 'purple' },
];

const COLORS = {
  amber: { bg: 'bg-amber-50 border-amber-200', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-900', cta: 'text-amber-700' },
  blue: { bg: 'bg-blue-50 border-blue-200', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-900', cta: 'text-blue-700' },
  red: { bg: 'bg-red-50 border-red-200', icon: 'bg-red-100 text-red-600', text: 'text-red-900', cta: 'text-red-700' },
  purple: { bg: 'bg-purple-50 border-purple-200', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-900', cta: 'text-purple-700' },
};

export default function HelenaSettingsRecommendations({ onSelect }) {
  const [dismissed, setDismissed] = useState([]);
  const visible = INSIGHTS.filter((i) => !dismissed.includes(i.id));
  if (visible.length === 0) return null;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/40 to-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-sm font-bold text-slate-800">Helena IA · Recomendações</p>
          <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px]">{visible.length} insights</Badge>
        </div>

        <div className="space-y-2">
          {visible.map((insight) => {
            const c = COLORS[insight.color];
            const Icon = insight.icon;
            return (
              <div key={insight.id} className={`flex items-center justify-between p-3 rounded-lg border ${c.bg}`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg ${c.icon} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${c.text}`}>{insight.title}</p>
                    <p className="text-[11px] text-slate-600 truncate">{insight.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" className={`h-7 text-[10px] ${c.cta}`} onClick={() => onSelect?.(insight.section)}>
                    {insight.cta} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDismissed([...dismissed, insight.id])}>
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}