import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ban, Pause, ShieldAlert, FileText, ChevronRight, Calendar, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

/**
 * Aba "Bloqueios e Suspensões" — Mentor F0288–F0337.
 * Timeline cronológica, tipo, documento anexo, alçada, revisão programada.
 */
export default function TabBloqueiosSuspensoes({ merchant }) {
  // Mock
  const current = [
    {
      id: 'BLK-001',
      kind: 'block',
      type: 'antifraud',
      label: 'Bloqueio antifraude',
      reason: 'Padrão de transações suspeito detectado pelo agente DIA',
      applied_by: 'risco@pagsmile.com',
      applied_at: '2026-04-12 14:32',
      review_at: '2026-07-12',
      doc_attached: false,
      cnj: null,
    },
  ];

  const history = [
    { id: 'BLK-prev-1', kind: 'unblock', type: 'antifraud', label: 'Desbloqueio', reason: 'Causa resolvida — análise concluída', date: '2026-02-08 10:00', by: 'compliance@pagsmile.com' },
    { id: 'SUS-001', kind: 'suspend', type: 'voluntary', label: 'Suspensão voluntária', reason: 'Solicitação do lojista — pausa sazonal', date: '2025-12-15 16:00', by: 'lojista (self-service)' },
    { id: 'BLK-002', kind: 'block', type: 'judicial', label: 'Bloqueio judicial', reason: 'Ordem judicial nº 0012345-67.2025.8.26.0100 (1ª Vara Cível SP)', date: '2025-08-22 09:00', by: 'juridico@pagsmile.com', doc_attached: true, cnj: '0012345-67.2025.8.26.0100' },
    { id: 'BLK-prev-2', kind: 'unblock', type: 'judicial', label: 'Desbloqueio', reason: 'Decisão liminar revogada', date: '2025-09-30 11:30', by: 'juridico@pagsmile.com' },
  ];

  const typeLabel = {
    regulatory: { label: 'Regulatório', color: 'bg-purple-100 text-purple-700' },
    financial: { label: 'Financeiro', color: 'bg-blue-100 text-blue-700' },
    antifraud: { label: 'Antifraude', color: 'bg-red-100 text-red-700' },
    operational: { label: 'Operacional', color: 'bg-slate-100 text-slate-700' },
    commercial: { label: 'Comercial', color: 'bg-emerald-100 text-emerald-700' },
    judicial: { label: 'Judicial', color: 'bg-amber-100 text-amber-700' },
    voluntary: { label: 'Voluntária', color: 'bg-cyan-100 text-cyan-700' },
  };

  const kindIcon = { block: Ban, suspend: Pause, unblock: ShieldAlert };

  return (
    <div className="space-y-6">
      {/* Ações no header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Bloqueios ativos: <strong>{current.length}</strong> · Histórico: <strong>{history.length}</strong></p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl(`AdminIntSuspensionFlow?id=${merchant?.id}`)}>
            <Button variant="outline" size="sm"><Pause className="w-4 h-4 mr-1" /> Suspender</Button>
          </Link>
          <Link to={createPageUrl(`AdminIntBlockageFlow?id=${merchant?.id}`)}>
            <Button variant="destructive" size="sm"><Ban className="w-4 h-4 mr-1" /> Bloquear</Button>
          </Link>
        </div>
      </div>

      {/* Atuais */}
      {current.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-700">
              <Ban className="w-5 h-5" /> Bloqueios e Suspensões Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {current.map((b) => {
              const Icon = kindIcon[b.kind];
              const t = typeLabel[b.type] || typeLabel.operational;
              return (
                <div key={b.id} className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900">{b.label}</p>
                          <Badge className={t.color}>{t.label}</Badge>
                          <code className="text-[10px] text-slate-500">{b.id}</code>
                        </div>
                        <p className="text-sm text-slate-700 mt-1">{b.reason}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Aplicado por <strong>{b.applied_by}</strong> em {b.applied_at}
                        </p>
                        {b.review_at && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-amber-700">
                            <Calendar className="w-3 h-3" />
                            Revisão programada: <strong>{b.review_at}</strong>
                          </div>
                        )}
                        {b.cnj && (
                          <p className="text-xs text-slate-500 mt-1">CNJ: <code className="text-xs">{b.cnj}</code></p>
                        )}
                      </div>
                    </div>
                    <Link to={createPageUrl(`AdminIntUnblockFlow?id=${merchant?.id}&blockage_id=${b.id}`)}>
                      <Button variant="outline" size="sm">Desbloquear <ChevronRight className="w-3 h-3 ml-1" /></Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Timeline histórica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="w-5 h-5 text-slate-500" /> Histórico Cronológico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-4">
              {history.map((h) => {
                const Icon = kindIcon[h.kind];
                const t = typeLabel[h.type] || typeLabel.operational;
                return (
                  <div key={h.id} className="relative pl-12">
                    <div className={cn(
                      "absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center",
                      h.kind === 'unblock' ? 'bg-emerald-500' : h.kind === 'suspend' ? 'bg-amber-500' : 'bg-slate-500'
                    )}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900 text-sm">{h.label}</p>
                        <Badge className={t.color}>{t.label}</Badge>
                        {h.doc_attached && (
                          <Badge variant="outline" className="text-[10px]"><FileText className="w-2.5 h-2.5 mr-0.5" /> Documento anexo</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 mt-1">{h.reason}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {h.date} · por <strong>{h.by}</strong>
                      </p>
                      {h.cnj && <p className="text-[11px] text-slate-500">CNJ: <code className="text-[11px]">{h.cnj}</code></p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}