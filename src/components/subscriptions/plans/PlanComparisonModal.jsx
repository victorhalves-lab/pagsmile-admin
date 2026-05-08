import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { fmtCurrency } from '@/components/subscriptions/utils';

export default function PlanComparisonModal({ open, onOpenChange, plans }) {
  if (!plans || plans.length < 2) return null;
  const allBenefits = Array.from(new Set(plans.flatMap((p) => p.benefits || [])));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader><DialogTitle>Comparar planos</DialogTitle></DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="text-left p-2"></th>
                {plans.map((p) => <th key={p.id} className="text-center p-2 min-w-[120px]">{p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b"><td className="p-2 font-bold">Preço</td>{plans.map((p) => <td key={p.id} className="text-center p-2 font-bold">{fmtCurrency(p.amount, { precise: true })}</td>)}</tr>
              <tr className="border-b"><td className="p-2 font-bold">Trial</td>{plans.map((p) => <td key={p.id} className="text-center p-2">{p.trial_days || 0}d</td>)}</tr>
              <tr className="border-b"><td className="p-2 font-bold">Subscribers</td>{plans.map((p) => <td key={p.id} className="text-center p-2">{p.current_subscribers}</td>)}</tr>
              <tr className="border-b"><td className="p-2 font-bold">MRR</td>{plans.map((p) => <td key={p.id} className="text-center p-2 font-bold text-emerald-600">{fmtCurrency(p.mrr, { short: true })}</td>)}</tr>
              <tr className="border-b"><td className="p-2 font-bold">Churn</td>{plans.map((p) => <td key={p.id} className="text-center p-2">{p.churn_rate}%</td>)}</tr>
              <tr className="border-b"><td className="p-2 font-bold">LTV</td>{plans.map((p) => <td key={p.id} className="text-center p-2">{fmtCurrency(p.ltv, { short: true })}</td>)}</tr>
              {allBenefits.map((b, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 text-slate-600">{b}</td>
                  {plans.map((p) => <td key={p.id} className="text-center p-2">{(p.benefits || []).includes(b) ? '✓' : '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}