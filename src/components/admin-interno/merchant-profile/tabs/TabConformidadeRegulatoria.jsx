import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_URS, MOCK_DIVERGENCES } from '@/components/regulatory/mocks/urMock';

export default function TabConformidadeRegulatoria({ merchant }) {
  const urs = useMemo(() => MOCK_URS.filter((u) => u.merchant.id === 'mer_001'), []);
  const merchantDivergences = useMemo(() => MOCK_DIVERGENCES.filter((d) => d.ur?.merchant?.id === 'mer_001'), []);

  const metrics = useMemo(() => {
    const total = urs.length;
    const registered = urs.filter((u) => u.registration_status === 'registered').length;
    const failed = urs.filter((u) => u.registration_status === 'failed').length;
    const pending = urs.filter((u) => u.registration_status === 'pending').length;
    const concordance_rate = total > 0 ? ((registered / total) * 100).toFixed(1) : '0';
    const avg_health_score = total > 0 ? Math.round(urs.reduce((s, u) => s + u.health_score, 0) / total) : 0;
    return { total, registered, failed, pending, concordance_rate, avg_health_score };
  }, [urs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Conformidade Regulatória
          </h2>
          <p className="text-xs text-slate-500">Métricas de conformidade BCB e qualidade da integração com registradoras</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Score saúde regulatória</p>
            <p className="text-3xl font-black text-emerald-700">{metrics.avg_health_score}</p>
            <p className="text-[10px] text-slate-500">de 100</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Taxa registro OK</p>
            <p className="text-2xl font-bold">{metrics.concordance_rate}%</p>
            <p className="text-[10px] text-slate-500">{metrics.registered} de {metrics.total} URs</p>
          </CardContent>
        </Card>
        <Card className={metrics.failed > 0 ? 'bg-red-50 border-red-200' : ''}>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Registros falhados</p>
            <p className="text-2xl font-bold text-red-700">{metrics.failed}</p>
          </CardContent>
        </Card>
        <Card className={merchantDivergences.length > 0 ? 'bg-amber-50 border-amber-200' : ''}>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Divergências CERC</p>
            <p className="text-2xl font-bold text-amber-700">{merchantDivergences.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Checklist regulatório</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: 'URs registradas no prazo regulatório (1 dia útil)', value: metrics.concordance_rate >= 99, detail: `${metrics.concordance_rate}% (meta ≥ 99%)` },
            { label: 'Sem divergências críticas em conciliação CERC', value: merchantDivergences.filter((d) => d.severity === 'critical').length === 0, detail: `${merchantDivergences.filter((d) => d.severity === 'critical').length} críticas` },
            { label: 'Sem registros falhados pendentes', value: metrics.failed === 0, detail: `${metrics.failed} falhados` },
            { label: 'Sem efeitos em conflito não resolvidos', value: true, detail: '0 conflitos' },
            { label: 'Documentação de cessões completa', value: true, detail: 'Todas com contrato anexado' },
          ].map((c, i) => (
            <div key={i} className={`flex items-center justify-between p-2 rounded border ${c.value ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-2">
                {c.value ? <span className="text-emerald-600">✓</span> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                <span className="text-xs">{c.label}</span>
              </div>
              <span className="text-[10px] text-slate-500">{c.detail}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {merchantDivergences.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Divergências CERC deste lojista</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {merchantDivergences.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-2 border rounded text-xs">
                <div className="flex items-center gap-2">
                  <Badge className={d.severity === 'critical' ? 'bg-red-100 text-red-700' : d.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}>
                    {d.severity}
                  </Badge>
                  <span>{d.description}</span>
                </div>
                <Link to={`${createPageUrl('AdminIntCERCConciliationHub')}`}>
                  <Button size="sm" variant="outline" className="h-6 text-[9px]"><ExternalLink className="w-2.5 h-2.5 mr-0.5" />Tratar</Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}