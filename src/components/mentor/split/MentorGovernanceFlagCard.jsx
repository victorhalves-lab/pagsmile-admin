import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  ShieldX,
  ShieldCheck,
  FileWarning,
  Eye,
  Ban,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const SEVERITY_META = {
  critical: { label: 'Crítico', icon: ShieldX, color: 'bg-red-100 text-red-800 border-red-300', cardBorder: 'border-l-red-600' },
  high: { label: 'Alto', icon: ShieldAlert, color: 'bg-orange-100 text-orange-800 border-orange-300', cardBorder: 'border-l-orange-500' },
  medium: { label: 'Médio', icon: AlertTriangle, color: 'bg-amber-100 text-amber-800 border-amber-300', cardBorder: 'border-l-amber-500' },
  low: { label: 'Baixo', icon: FileWarning, color: 'bg-blue-100 text-blue-800 border-blue-300', cardBorder: 'border-l-blue-500' },
};

const TYPE_LABEL = {
  kyc_failure: 'KYC Falho',
  concentration_risk: 'Concentração',
  pep_unflagged: 'PEP Não-Marcado',
  config_drift: 'Drift de Configuração',
  sanctions_screening: 'OFAC/Sanções',
  fee_structure: 'MDR Indefinido',
};

export default function MentorGovernanceFlagCard({ flag, onSuspend, onAcknowledge }) {
  const meta = SEVERITY_META[flag.severity];
  const Icon = meta.icon;

  return (
    <Card className={cn('border-l-4', meta.cardBorder)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('gap-1 border', meta.color)}>
              <Icon className="w-3 h-3" />
              {meta.label}
            </Badge>
            <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[flag.type]}</Badge>
            <code className="text-[10px] font-mono text-slate-400">{flag.flag_id}</code>
          </div>
          <span className="text-[10px] text-slate-400">
            {new Date(flag.detected_at).toLocaleString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{flag.title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{flag.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
            <p className="text-slate-500 uppercase font-bold text-[9px]">Merchant</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{flag.merchant}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
            <p className="text-slate-500 uppercase font-bold text-[9px]">Beneficiário</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{flag.recipient}</p>
          </div>
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded p-2">
          <div className="flex items-start gap-2">
            <BookOpen className="w-3.5 h-3.5 text-violet-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-violet-700">Referência regulatória</p>
              <p className="text-[11px] text-violet-900 mt-0.5">{flag.regulatory_reference}</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-700">Ação recomendada Mentor</p>
              <p className="text-[11px] text-emerald-900 mt-0.5">{flag.suggested_action}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Link to={createPageUrl('SplitDetail360')} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs h-8">
              <Eye className="w-3 h-3 mr-1" /> Ver split
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAcknowledge?.(flag)}
            className="text-xs h-8"
          >
            <ExternalLink className="w-3 h-3 mr-1" /> Acionar compliance
          </Button>
          {flag.severity === 'critical' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onSuspend?.(flag)}
              className="text-xs h-8"
            >
              <Ban className="w-3 h-3 mr-1" /> Suspender
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}