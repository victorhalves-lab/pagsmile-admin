import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function ComplianceHealthCard({ subaccounts = [] }) {
  const total = subaccounts.length;
  const compliant = subaccounts.filter(s => s.compliance_status === 'compliant').length;
  const underReview = subaccounts.filter(s => s.compliance_status === 'under_review').length;
  const pendingDocs = subaccounts.filter(s => s.compliance_status === 'pending_docs').length;
  const nonCompliant = subaccounts.filter(s => s.compliance_status === 'non_compliant').length;

  const compliantPct = total > 0 ? (compliant / total) * 100 : 0;
  const underReviewPct = total > 0 ? (underReview / total) * 100 : 0;
  const pendingPct = total > 0 ? (pendingDocs / total) * 100 : 0;
  const nonCompliantPct = total > 0 ? (nonCompliant / total) * 100 : 0;

  const items = [
    { label: 'Conformes', count: compliant, pct: compliantPct, color: 'bg-emerald-500', icon: ShieldCheck, textColor: 'text-emerald-700' },
    { label: 'Em Revisão', count: underReview, pct: underReviewPct, color: 'bg-blue-500', icon: Shield, textColor: 'text-blue-700' },
    { label: 'Docs Pendentes', count: pendingDocs, pct: pendingPct, color: 'bg-amber-500', icon: Shield, textColor: 'text-amber-700' },
    { label: 'Não Conforme', count: nonCompliant, pct: nonCompliantPct, color: 'bg-red-500', icon: ShieldAlert, textColor: 'text-red-700' },
  ];

  const overallHealth = compliantPct >= 80 ? 'success' : compliantPct >= 50 ? 'warning' : 'danger';
  const healthBadge = {
    success: { label: 'Saudável', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    warning: { label: 'Atenção', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    danger: { label: 'Crítico', class: 'bg-red-100 text-red-700 border-red-200' },
  }[overallHealth];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Compliance Health
          </CardTitle>
          <Badge className={healthBadge.class}>{healthBadge.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stacked bar */}
        <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 mb-4">
          {items.map((item, idx) => (
            item.pct > 0 && (
              <div 
                key={idx}
                className={item.color}
                style={{ width: `${item.pct}%` }}
                title={`${item.label}: ${item.count} (${item.pct.toFixed(1)}%)`}
              />
            )
          ))}
        </div>

        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <item.icon className={`w-3.5 h-3.5 ${item.textColor}`} />
                <span className="text-sm text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{item.count}</span>
                <span className="text-xs text-slate-500 w-12 text-right">{item.pct.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
          <span className="text-slate-500">Total de subcontas</span>
          <span className="font-bold text-slate-900">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}