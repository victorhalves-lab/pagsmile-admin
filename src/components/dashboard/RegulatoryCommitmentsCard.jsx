import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';

export default function RegulatoryCommitmentsCard() {
  // mock — lojista atual
  const myEffects = MOCK_EFFECTS.filter((e) => e.ur?.merchant?.id === 'mer_001' && e.status === 'active');
  const totalCommitted = myEffects.reduce((s, e) => s + e.value_affected, 0);
  const judicial = myEffects.filter((e) => e.type === 'judicial_lien' || e.type === 'attachment').length;
  const cessions = myEffects.filter((e) => e.type.includes('assignment')).length;
  const anticipations = myEffects.filter((e) => e.type === 'registered_anticipation').length;

  if (myEffects.length === 0) return null;

  const parts = [];
  if (judicial > 0) parts.push(`${judicial} judicial${judicial > 1 ? 'is' : ''}`);
  if (cessions > 0) parts.push(`${cessions} cessõe${cessions > 1 ? 's' : ''}`);
  if (anticipations > 0) parts.push(`${anticipations} antecipaçõe${anticipations > 1 ? 's' : ''}`);

  return (
    <Link
      to={createPageUrl('MyContractEffects')}
      className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors text-xs"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-500 dark:text-slate-400">Compromissos sobre recebíveis:</span>
        <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
          {parts.join(' · ')}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-slate-500">{formatCurrencyShort(totalCommitted)}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
      </div>
    </Link>
  );
}