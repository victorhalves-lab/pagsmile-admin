import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

/**
 * Mentor F0395–F0404 — Cronograma automático de revisão de bloqueios temporários.
 * Garante governança: bloqueio sem fim definido vira pendência de revisão em 90 dias.
 */
const mockReviews = [
  { id: 'BLK-001', merchant_id: '12345', merchant_name: 'E-commerce XYZ', type: 'antifraud', applied_at: '2026-02-12', review_at: '2026-05-12', days_remaining: 3, status: 'overdue' },
  { id: 'BLK-002', merchant_id: '12348', merchant_name: 'Fashion Online', type: 'judicial', applied_at: '2025-08-22', review_at: '2026-05-22', days_remaining: 13, status: 'due_soon' },
  { id: 'BLK-003', merchant_id: '12352', merchant_name: 'Saúde Total', type: 'financial', applied_at: '2026-02-28', review_at: '2026-05-28', days_remaining: 19, status: 'due_soon' },
  { id: 'BLK-004', merchant_id: '12347', merchant_name: 'Tech Store', type: 'regulatory', applied_at: '2026-04-10', review_at: '2026-07-10', days_remaining: 62, status: 'scheduled' },
  { id: 'BLK-005', merchant_id: '12351', merchant_name: 'Marketplace Pro', type: 'antifraud', applied_at: '2026-03-15', review_at: '2026-06-15', days_remaining: 37, status: 'scheduled' },
];

const STATUS_CFG = {
  overdue: { label: 'Atrasado', color: 'bg-red-100 text-red-700 border-red-300', icon: AlertTriangle },
  due_soon: { label: 'Próximo (≤30d)', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
  scheduled: { label: 'Programado', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Calendar },
};

const TYPE_LABEL = {
  antifraud: 'Antifraude',
  judicial: 'Judicial',
  financial: 'Financeiro',
  regulatory: 'Regulatório',
  operational: 'Operacional',
};

export default function AdminIntBlockageReviewSchedule() {
  const overdue = mockReviews.filter(r => r.status === 'overdue');
  const dueSoon = mockReviews.filter(r => r.status === 'due_soon');
  const scheduled = mockReviews.filter(r => r.status === 'scheduled');

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Cronograma de Revisão de Bloqueios"
        subtitle="Bloqueios temporários sem fim definido são automaticamente agendados para revisão em 90 dias"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Bloqueios', page: 'AdminIntBlockages' },
          { label: 'Cronograma de Revisão' },
        ]}
        icon={Calendar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="border-red-200">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold uppercase text-red-700">Atrasados</p>
            <p className="text-3xl font-black text-red-700 mt-1">{overdue.length}</p>
            <p className="text-xs text-red-600 mt-1">Revisão vencida — agir agora</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold uppercase text-amber-700">Próximos (≤30d)</p>
            <p className="text-3xl font-black text-amber-700 mt-1">{dueSoon.length}</p>
            <p className="text-xs text-amber-600 mt-1">Programar análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] font-bold uppercase text-slate-700">Programados</p>
            <p className="text-3xl font-black text-slate-700 mt-1">{scheduled.length}</p>
            <p className="text-xs text-slate-500 mt-1">Aguardando data</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {mockReviews.map((r) => {
          const cfg = STATUS_CFG[r.status];
          const TypeIcon = cfg.icon;
          return (
            <Card key={r.id} className={cn('border', cfg.color.split(' ').find(c => c.startsWith('border-')))}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${cfg.color} flex items-center justify-center`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <Link to={createPageUrl(`AdminIntMerchantProfile?id=${r.merchant_id}&tab=bloqueios`)} className="font-bold text-sm hover:text-[#2bc196] flex items-center gap-1">
                      {r.merchant_name}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <code>{r.id}</code>
                      <span>·</span>
                      <span>{TYPE_LABEL[r.type]}</span>
                      <span>·</span>
                      <span>aplicado em {r.applied_at}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Revisar em</p>
                    <p className="font-bold text-sm">{r.review_at}</p>
                    <p className={cn('text-[11px] font-bold', r.days_remaining <= 0 ? 'text-red-600' : r.days_remaining <= 30 ? 'text-amber-600' : 'text-slate-500')}>
                      {r.days_remaining <= 0 ? `${Math.abs(r.days_remaining)} dias atrasado` : `em ${r.days_remaining} dias`}
                    </p>
                  </div>
                  <Badge className={cfg.color}>{cfg.label}</Badge>
                  <Button size="sm" variant="outline">Revisar agora</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}