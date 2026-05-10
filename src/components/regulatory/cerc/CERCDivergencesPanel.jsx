import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { DIVERGENCE_TYPES, DIVERGENCE_SEVERITY, formatCurrency } from '../mocks/urMock';
import { toast } from 'sonner';

export default function CERCDivergencesPanel({ divergences }) {
  const grouped = {
    critical: divergences.filter((d) => d.severity === 'critical' && d.status !== 'resolved'),
    medium: divergences.filter((d) => d.severity === 'medium' && d.status !== 'resolved'),
    minor: divergences.filter((d) => d.severity === 'minor' && d.status !== 'resolved'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Divergências pendentes de tratativa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {['critical', 'medium', 'minor'].map((sev) => {
          const items = grouped[sev];
          if (items.length === 0) return null;
          const sevConfig = DIVERGENCE_SEVERITY[sev];
          return (
            <div key={sev}>
              <div className="flex items-center justify-between mb-1.5">
                <Badge className={`${sevConfig.color} border text-[10px]`}>
                  {sevConfig.label} ({items.length}) · SLA {sevConfig.sla_hours}h
                </Badge>
              </div>
              <div className="space-y-1.5">
                {items.slice(0, 5).map((d) => {
                  const type = DIVERGENCE_TYPES[d.type];
                  const slaUrgent = d.sla_hours_remaining < 8;
                  return (
                    <div key={d.id} className={`flex items-center justify-between p-2 border rounded text-xs ${slaUrgent ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge className={`${type?.color} text-[9px]`}>{type?.label}</Badge>
                          <span className="font-mono text-[10px]">{d.id}</span>
                          {slaUrgent && <Badge className="bg-red-100 text-red-700 text-[9px]"><Clock className="w-2.5 h-2.5 mr-0.5" />{d.sla_hours_remaining}h</Badge>}
                        </div>
                        <p className="text-[10px] text-slate-600 mt-0.5">UR: {d.ur_id} · Δ {formatCurrency(Math.abs(d.cerc_value - d.internal_value))}</p>
                        {d.assigned_to && <p className="text-[9px] text-slate-500">Atribuído: {d.assigned_to}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Link to={`${createPageUrl('AdminIntURDetail360')}?id=${d.ur_id}`}>
                          <Button size="sm" variant="outline" className="h-6 text-[9px]">
                            <ExternalLink className="w-2.5 h-2.5 mr-0.5" /> UR
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="h-6 text-[9px]" onClick={() => toast.success(`Divergência ${d.id} marcada como resolvida`)}>
                          Resolver
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {divergences.filter((d) => d.status !== 'resolved').length === 0 && (
          <p className="text-center py-4 text-emerald-600 text-sm">✓ Nenhuma divergência pendente</p>
        )}
      </CardContent>
    </Card>
  );
}