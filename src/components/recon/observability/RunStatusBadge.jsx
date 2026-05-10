import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';

const CONFIG = {
  running:  { cls: 'bg-blue-50 text-blue-700 border-blue-200',       Icon: Loader2,        spin: true },
  success:  { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  partial:  { cls: 'bg-amber-50 text-amber-700 border-amber-200',     Icon: AlertTriangle },
  failed:   { cls: 'bg-red-50 text-red-700 border-red-200',           Icon: XCircle },
  timeout:  { cls: 'bg-red-50 text-red-700 border-red-200',           Icon: Clock },
};

export default function RunStatusBadge({ status }) {
  const c = CONFIG[status] || CONFIG.running;
  const Icon = c.Icon;
  return (
    <Badge variant="outline" className={`${c.cls} gap-1`}>
      <Icon className={`w-3 h-3 ${c.spin ? 'animate-spin' : ''}`} />
      {status}
    </Badge>
  );
}