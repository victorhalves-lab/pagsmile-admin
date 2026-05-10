import React from 'react';
import { Badge } from '@/components/ui/badge';

const COLORS = {
  pending: 'bg-slate-100 text-slate-700',
  draft: 'bg-slate-100 text-slate-700',
  reviewed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending_senior_review: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-50 text-red-700',
  posted: 'bg-blue-50 text-blue-700',
  submitted: 'bg-blue-50 text-blue-700',
  in_review: 'bg-purple-50 text-purple-700',
  resolved: 'bg-emerald-100 text-emerald-800',
  escalated: 'bg-amber-100 text-amber-800',
};

export default function InboxStatusBadge({ status }) {
  const cls = COLORS[status] || 'bg-slate-100 text-slate-700';
  return <Badge variant="outline" className={cls}>{status}</Badge>;
}