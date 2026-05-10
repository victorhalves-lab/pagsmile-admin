import React from 'react';
import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG } from './mocks/onboardingCasesV4Mock';

export default function CaseStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  );
}