import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Scale, Building2, AlertTriangle, ExternalLink, FileText } from 'lucide-react';

/**
 * Aba "Efeitos de Contrato" — Mentor F0224–F0227.
 * Cessões fiduciárias (CIP/B3), gravames judiciais, travas operacionais.
 * Gauge "% do fluxo comprometido com terceiros".
 */
export default function TabEfeitosContrato({ merchant }) {
  // Mock
  const effects = [
    {
      id: 'CES-001',
      type: 'cession',
      registry: 'CIP',
      label: 'Cessão Fiduciária CIP',
      counterparty: 'Banco XYZ S.A.',
      counterparty_doc: '11.222.333/0001-44',
      contract_id: 'BCO-XYZ-2025-0145',
      amount_committed_pct: 25,
      amount_committed_value: 145000,
      start_date: '2026-01-15',
      end_date: '2027-01-15',
      operation_type: 'Garantia de capital de giro',
    },
    {
      id: 'CES-002',
      type: 'cession',
      registry: 'B3',
      label: 'Cessão Fiduciária B3',
      counterparty: 'Fundo de Investimento ABC FIDC',
      counterparty_doc: '99.888.777/0001-66',
      contract_id: 'FIDC-ABC-2025-0098',
      amount_committed_pct: 8,
      amount_committed_value: 47000,
      start_date: '2026-03-01',
      end_date: '2026-12-31',
      operation_type: 'Antecipação descontada',
    },
    {
      id: 'GRA-001',
      type: 'gravame',
      registry: 'Judicial',
      label: 'Penhora judicial',
      counterparty: 'União Federal',
      counterparty_doc: '00.394.460/0001-41',
      cnj: '0012345-67.2025.4.03.6100',
      amount_committed_pct: 2,
      amount_committed_value: 12500,
      start_date: '2026-04-08',
      end_date: null,
      operation_type: 'Bloqueio fiscal',
    },
  ];

  const totalCommittedPct = effects.reduce((sum, e) => sum + e.amount_committed_pct, 0);
  const totalCommittedValue = effects.reduce((sum, e) => sum + e.amount_committed_value, 0);

  const TYPE_CONFIG = {
    cession: { icon: Lock, color: 'bg-purple-100 text-purple-700', borderColor: 'border-purple-200' },
    gravame: { icon: Scale, color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-200' },
    operational_lock: { icon: AlertTriangle, color: 'bg-red-100 text-red-700', borderColor: 'border-red-200' },
  };

  return (
    <div className="space-y-6">
      {/* Gauge — % do fluxo comprometido */}
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-900">% do fluxo comprometido com terceiros</p>
              <p className="text-5xl font-black text-amber-700 mt-2">{totalCommittedPct}%</p>
              <p className="text-sm text-amber-800 mt-1">
                Aproximadamente <strong>R$ {totalCommittedValue.toLocaleString('pt-BR')}</strong>/mês comprometidos
              </p>
            </div>
            <div className="flex-1 max-w-md min-w-[200px]">
              <div className="space-y-2">
                {effects.map((e) => {
                  const cfg = TYPE_CONFIG[e.type];
                  return (
                    <div key={e.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{e.counterparty}</span>
                        <span className="font-bold">{e.amount_committed_pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{ width: `${e.amount_committed_pct * 4}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de efeitos */}
      <div className="space-y-3">
        {effects.map((e) => {
          const cfg = TYPE_CONFIG[e.type];
          const Icon = cfg.icon;
          return (
            <Card key={e.id} className={cfg.borderColor}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-[280px]">
                    <div className={`w-10 h-10 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-900">{e.label}</p>
                        <Badge variant="outline" className="text-[10px]">{e.registry}</Badge>
                        <code className="text-[10px] text-slate-500">{e.id}</code>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">
                        Contraparte: <strong>{e.counterparty}</strong> ({e.counterparty_doc})
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{e.operation_type}</p>
                      {e.contract_id && <p className="text-xs text-slate-500 mt-0.5">Contrato: <code>{e.contract_id}</code></p>}
                      {e.cnj && <p className="text-xs text-slate-500 mt-0.5">CNJ: <code>{e.cnj}</code></p>}
                      <p className="text-xs text-slate-500 mt-1">
                        Vigência: <strong>{e.start_date}</strong> {e.end_date ? `→ ${e.end_date}` : '(indeterminada)'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{e.amount_committed_pct}%</p>
                    <p className="text-xs text-slate-500">R$ {e.amount_committed_value.toLocaleString('pt-BR')}</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-xs h-7">
                      <FileText className="w-3 h-3 mr-1" /> Ver contrato
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Aviso operacional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-bold">Implicação operacional</p>
            <p className="text-xs mt-1 text-blue-800">
              Antecipação solicitada por este lojista deve descontar primeiramente os valores
              comprometidos com terceiros antes de calcular o saldo disponível para antecipar.
              Saques, transferências e pagamentos a partir desta conta também respeitam essa hierarquia.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}