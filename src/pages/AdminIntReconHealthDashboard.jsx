import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity, RefreshCw, Loader2, CheckCircle2, AlertTriangle, Receipt,
  FileText, TrendingUp, Clock, Award,
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import HealthKpiTile from '@/components/recon/health/HealthKpiTile';
import BucketBreakdown from '@/components/recon/health/BucketBreakdown';

const formatBRL = (cents) =>
  ((cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AdminIntReconHealthDashboard() {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['recon.health.snapshot'],
    queryFn: async () => {
      const res = await base44.functions.invoke('recon/computeHealthStats', {});
      return res.data;
    },
  });

  const matchRate = data?.transactions?.match_rate_pct ?? 0;
  const matchColor = matchRate >= 95 ? 'emerald' : matchRate >= 80 ? 'amber' : 'red';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Health Dashboard · Reconciliação"
        description="Visão executiva da saúde do pipeline e dos agentes."
        icon={Activity}
      />

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {data?.generated_at && `Snapshot: ${new Date(data.generated_at).toLocaleString('pt-BR')}`}
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
          Atualizar
        </Button>
      </div>

      {!data && isFetching && (
        <div className="text-center py-12 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </div>
      )}

      {data && (
        <>
          {/* KPIs principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <HealthKpiTile
              label="Taxa de match"
              value={`${matchRate}%`}
              sub={`${data.transactions.matched}/${data.transactions.total} transações`}
              color={matchColor}
              icon={CheckCircle2}
            />
            <HealthKpiTile
              label="Divergências abertas"
              value={data.divergences.total - data.divergences.resolved}
              sub={`${formatBRL(data.divergences.open_value_cents)} em aberto`}
              color="amber"
              icon={AlertTriangle}
            />
            <HealthKpiTile
              label="Avg reviewer score"
              value={data.quality.avg_reviewer_score != null ? `${data.quality.avg_reviewer_score}/100` : '—'}
              sub={`${data.quality.reviewed_count} revisados`}
              color="purple"
              icon={Award}
            />
            <HealthKpiTile
              label="Travadas > 24h"
              value={data.divergences.stuck_24h}
              sub="Auditor 4h reaciona"
              color={data.divergences.stuck_24h > 0 ? 'red' : 'emerald'}
              icon={Clock}
            />
          </div>

          {/* Resolução */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <HealthKpiTile label="Ajustes pendentes" value={data.resolution.adjustments_pending} color="slate" icon={Receipt} />
            <HealthKpiTile label="Ajustes aprovados" value={data.resolution.adjustments_approved} color="emerald" icon={CheckCircle2} />
            <HealthKpiTile label="Disputas abertas" value={data.resolution.disputes_open} color="blue" icon={FileText} />
            <HealthKpiTile label="Disputas resolvidas" value={data.resolution.disputes_resolved} color="emerald" icon={TrendingUp} />
          </div>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Divergências por bucket</CardTitle>
              </CardHeader>
              <CardContent>
                <BucketBreakdown byBucket={data.divergences.by_bucket} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Severidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(data.divergences.by_severity).map(([sev, count]) => (
                  <div key={sev} className="flex items-center justify-between text-xs">
                    <span className="capitalize">{sev}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tipos de match</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {Object.entries(data.matches.by_type).map(([type, count]) => (
                  <div key={type} className="border rounded p-2 bg-slate-50">
                    <div className="text-slate-500 text-[11px]">{type}</div>
                    <div className="text-lg font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}