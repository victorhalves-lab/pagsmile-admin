import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHECKS = [
  { id: '2fa', label: '2FA habilitado', done: true, weight: 15 },
  { id: 'webauthn', label: 'WebAuthn / Passkeys', done: false, weight: 10, action: 'Habilitar' },
  { id: 'ip-allow', label: 'IP Allowlist configurado', done: false, weight: 10, action: 'Configurar' },
  { id: 'backup-admin', label: 'Backup admin (≥2 admins)', done: false, weight: 10, action: 'Adicionar' },
  { id: 'sso', label: 'SSO/SAML ativo', done: false, weight: 10, action: 'Configurar' },
  { id: 'bank', label: 'Conta bancária verificada', done: true, weight: 10 },
  { id: 'fiscal', label: 'Regime tributário declarado', done: false, weight: 10, action: 'Declarar' },
  { id: 'lgpd', label: 'LGPD: Privacy policy ativa', done: true, weight: 10 },
  { id: 'webhooks', label: 'Webhook secret configurado', done: true, weight: 5 },
  { id: 'notif', label: 'Notificações críticas ativas', done: true, weight: 5 },
  { id: 'session', label: 'Sessão timeout ≤ 30min', done: true, weight: 5 },
];

export default function SettingsHealthScore({ onAction }) {
  const total = CHECKS.reduce((s, c) => s + c.weight, 0);
  const done = CHECKS.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((done / total) * 100);
  const pending = CHECKS.filter((c) => !c.done);

  const colorClass = score >= 85 ? 'text-emerald-600' : score >= 65 ? 'text-amber-600' : 'text-red-600';
  const bgClass = score >= 85 ? 'from-emerald-50' : score >= 65 ? 'from-amber-50' : 'from-red-50';

  return (
    <Card className={cn('border-2 bg-gradient-to-br to-white', bgClass, score >= 85 ? 'border-emerald-200' : score >= 65 ? 'border-amber-200' : 'border-red-200')}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center',
              score >= 85 ? 'bg-emerald-100' : score >= 65 ? 'bg-amber-100' : 'bg-red-100'
            )}>
              <ShieldCheck className={cn('w-6 h-6', colorClass)} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Settings Health Score</p>
              <div className="flex items-baseline gap-2">
                <p className={cn('text-3xl font-bold', colorClass)}>{score}</p>
                <p className="text-sm text-slate-400">/ 100</p>
              </div>
            </div>
          </div>
          <Badge className={cn('text-[10px]',
            score >= 85 ? 'bg-emerald-100 text-emerald-700' : score >= 65 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          )}>
            {score >= 85 ? '✓ Excelente' : score >= 65 ? '⚠ Atenção' : '⚠ Crítico'}
          </Badge>
        </div>

        <Progress value={score} className="h-2 mb-4" />

        {pending.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              {pending.length} ações pendentes para chegar a 100
            </p>
            <div className="space-y-1.5">
              {pending.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    <p className="text-xs font-medium text-slate-700">{c.label}</p>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">+{c.weight}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-[10px] text-[#2bc196]" onClick={() => onAction?.(c.id)}>
                    {c.action} <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && (
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-medium text-emerald-800">Todas as configurações de segurança estão em conformidade.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}