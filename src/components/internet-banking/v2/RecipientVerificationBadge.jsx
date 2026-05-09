import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Badge de verificação do recipient — ✓ Verificado / ⚠ Atenção / 🚨 Bloqueada.
 * Aparece dentro do card "Chave encontrada" no Step 1.
 */
export default function RecipientVerificationBadge({ status = 'verified', registeredDays = 380 }) {
  const variants = {
    verified: {
      icon: ShieldCheck,
      label: 'Chave verificada',
      sub: `Cadastrada há ${Math.round(registeredDays / 30)} meses · Sem reportes`,
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-700',
    },
    attention: {
      icon: AlertTriangle,
      label: 'Atenção — chave nova',
      sub: `Cadastrada há ${registeredDays} dias · Confira se é o destinatário correto`,
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      badgeBg: 'bg-amber-100 text-amber-700',
    },
    blocked: {
      icon: ShieldAlert,
      label: 'Chave reportada por fraude',
      sub: 'Não recomendamos prosseguir',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      badgeBg: 'bg-red-100 text-red-700',
    },
  };

  const v = variants[status] || variants.verified;
  const Icon = v.icon;

  return (
    <div className={`mt-3 p-3 rounded-xl border ${v.border} ${v.bg} flex items-start gap-3`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.text}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-bold text-sm ${v.text}`}>{v.label}</p>
          <Badge className={`${v.badgeBg} border-0 text-[10px] h-5`}>
            <Clock className="w-2.5 h-2.5 mr-1" />
            {registeredDays}d
          </Badge>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{v.sub}</p>
      </div>
    </div>
  );
}