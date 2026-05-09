import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Building2, ShieldCheck, ShieldX, ShieldAlert, Crown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const KYC_STATUS = {
  verified: { label: 'KYC OK', color: 'bg-emerald-100 text-emerald-700', icon: ShieldCheck },
  expired: { label: 'KYC Expirado', color: 'bg-red-100 text-red-700', icon: ShieldX },
  pending_review: { label: 'KYC Pendente', color: 'bg-amber-100 text-amber-700', icon: ShieldAlert },
  flagged: { label: 'KYC Flagged', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export default function MentorBeneficiaryListItem({ beneficiary, isSelected, onClick }) {
  const TypeIcon = beneficiary.type === 'company' ? Building2 : User;
  const kyc = KYC_STATUS[beneficiary.kyc_status] || KYC_STATUS.pending_review;
  const KycIcon = kyc.icon;

  return (
    <button
      onClick={() => onClick?.(beneficiary)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg border transition text-left',
        isSelected
          ? 'bg-violet-50 border-violet-300 ring-2 ring-violet-200'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
        beneficiary.type === 'company' ? 'bg-blue-100 text-blue-600' : 'bg-violet-100 text-violet-600'
      )}>
        <TypeIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{beneficiary.name}</p>
          {beneficiary.is_pep && (
            <Badge className="bg-amber-100 text-amber-700 text-[9px] gap-0.5">
              <Crown className="w-2.5 h-2.5" /> PEP
            </Badge>
          )}
          <Badge className={cn('text-[9px] gap-0.5', kyc.color)}>
            <KycIcon className="w-2.5 h-2.5" /> {kyc.label}
          </Badge>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {beneficiary.document} · {beneficiary.splits_count} split(s) · 30d {fmtBRL(beneficiary.total_received_30d)}
        </p>
        {beneficiary.risk_flags?.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {beneficiary.risk_flags.slice(0, 2).map((f) => (
              <Badge key={f} className="bg-red-50 text-red-600 text-[9px]">{f}</Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}