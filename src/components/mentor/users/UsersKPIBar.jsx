import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShieldCheck, AlertTriangle, UserPlus, Lock, Ghost } from 'lucide-react';

export default function UsersKPIBar({ users = [] }) {
  const total = users.length;
  const active = users.filter((u) => u.status === 'active').length;
  const invited = users.filter((u) => u.status === 'invited').length;
  const suspended = users.filter((u) => u.status === 'suspended').length;
  const locked = users.filter((u) => u.status === 'locked').length;
  const noMfa = users.filter((u) => u.status === 'active' && !u.mfa_enabled && u.role !== 'api_consumer').length;
  const dormant = users.filter((u) => {
    if (u.status !== 'active' || !u.last_login) return false;
    const days = (Date.now() - new Date(u.last_login).getTime()) / 86400000;
    return days > 30;
  }).length;

  const items = [
    { icon: Users, label: 'Total', value: total, color: 'text-slate-600', desc: `${active} ativos` },
    { icon: ShieldCheck, label: 'Ativos', value: active, color: 'text-emerald-600', desc: `${((active / Math.max(total, 1)) * 100).toFixed(0)}% da base` },
    { icon: UserPlus, label: 'Convidados', value: invited, color: 'text-blue-600', desc: 'pendentes aceite' },
    { icon: AlertTriangle, label: 'Suspensos', value: suspended, color: 'text-amber-600', desc: 'em revisão' },
    { icon: Lock, label: 'Bloqueados', value: locked, color: 'text-red-600', desc: 'requerem reset' },
    { icon: Ghost, label: 'Sem MFA', value: noMfa, color: 'text-amber-600', desc: 'risco de segurança' },
    { icon: Ghost, label: 'Dormentes', value: dormant, color: 'text-slate-600', desc: '30+ dias sem login' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {items.map((it, i) => (
        <Card key={i}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">{it.label}</p>
              <it.icon className={`w-4 h-4 ${it.color}`} />
            </div>
            <p className={`text-2xl font-bold mt-0.5 ${it.color}`}>{it.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{it.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}