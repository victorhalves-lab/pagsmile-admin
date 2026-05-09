import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Key, AlertTriangle, ShieldX, Clock, Ghost } from 'lucide-react';

export default function SupplierCredentialsKPIBar({ credentials = [] }) {
  const active = credentials.filter((c) => c.status === 'active').length;
  const expiringSoon = credentials.filter((c) => c.status === 'expiring_soon').length;
  const expired = credentials.filter((c) => c.status === 'expired').length;
  const unused = credentials.filter((c) => c.status === 'unused').length;
  const orphans = credentials.filter((c) => {
    if (!c.last_used_at) return true;
    const daysIdle = (Date.now() - new Date(c.last_used_at).getTime()) / 86400000;
    return daysIdle > 60 && c.status !== 'revoked';
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card className="border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Ativas</p>
            <Key className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{active}</p>
          <p className="text-[10px] text-slate-500 mt-1">de {credentials.length} totais</p>
        </CardContent>
      </Card>
      <Card className={expiringSoon > 0 ? 'border-amber-300 bg-amber-50/30' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Expirando</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className={`text-2xl font-bold mt-1 ${expiringSoon > 0 ? 'text-amber-600' : ''}`}>{expiringSoon}</p>
          <p className="text-[10px] text-slate-500 mt-1">próximos 90 dias</p>
        </CardContent>
      </Card>
      <Card className={expired > 0 ? 'border-red-300 bg-red-50/30' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Expiradas</p>
            <ShieldX className="w-4 h-4 text-red-500" />
          </div>
          <p className={`text-2xl font-bold mt-1 ${expired > 0 ? 'text-red-600' : ''}`}>{expired}</p>
          <p className="text-[10px] text-slate-500 mt-1">requerem revogação</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Nunca usadas</p>
            <Ghost className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold mt-1">{unused}</p>
          <p className="text-[10px] text-slate-500 mt-1">candidatas remoção</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Órfãs</p>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-1">{orphans}</p>
          <p className="text-[10px] text-slate-500 mt-1">sem uso 60+ dias</p>
        </CardContent>
      </Card>
    </div>
  );
}