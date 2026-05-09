import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP = {
  active: { label: 'Ativo', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  homologation: { label: 'Em homologação', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  inactive: { label: 'Inativo', icon: XCircle, className: 'bg-slate-100 text-slate-600 border-slate-200' },
  discontinued: { label: 'Descontinuado', icon: XCircle, className: 'bg-slate-100 text-slate-600 border-slate-200' },
  in_review: { label: 'Em revisão', icon: AlertTriangle, className: 'bg-orange-50 text-orange-700 border-orange-200' },
};

export default function CatalogStatusBadge({ status, size = 'default' }) {
  const config = STATUS_MAP[status] || STATUS_MAP.active;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', config.className, size === 'sm' && 'text-[10px] py-0 h-5')}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}