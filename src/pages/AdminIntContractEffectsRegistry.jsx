import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Lock, Scale, Search, Plus, ExternalLink, Calendar, FileText, Building2, AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Mentor F0224–F0227 — Registry central de cessões CIP/B3 e gravames judiciais.
 * Visão consolidada de TODAS as cessões/gravames ativos da carteira para Compliance/Jurídico.
 */
const mockEffects = [
  { id: 'CES-001', merchant_id: '12345', merchant_name: 'E-commerce XYZ', type: 'cession', registry: 'CIP', counterparty: 'Banco XYZ S.A.', counterparty_doc: '11.222.333/0001-44', contract_id: 'BCO-XYZ-2025-0145', amount_committed_pct: 25, amount_committed_value: 145000, start_date: '2026-01-15', end_date: '2027-01-15', operation_type: 'Garantia capital de giro' },
  { id: 'CES-002', merchant_id: '12345', merchant_name: 'E-commerce XYZ', type: 'cession', registry: 'B3', counterparty: 'FIDC ABC', counterparty_doc: '99.888.777/0001-66', contract_id: 'FIDC-ABC-2025-0098', amount_committed_pct: 8, amount_committed_value: 47000, start_date: '2026-03-01', end_date: '2026-12-31', operation_type: 'Antecipação descontada' },
  { id: 'GRA-001', merchant_id: '12345', merchant_name: 'E-commerce XYZ', type: 'gravame', registry: 'Judicial', counterparty: 'União Federal', counterparty_doc: '00.394.460/0001-41', cnj: '0012345-67.2025.4.03.6100', amount_committed_pct: 2, amount_committed_value: 12500, start_date: '2026-04-08', end_date: null, operation_type: 'Bloqueio fiscal' },
  { id: 'CES-003', merchant_id: '12349', merchant_name: 'SaaS Cloud', type: 'cession', registry: 'CIP', counterparty: 'Banco DEF S.A.', counterparty_doc: '22.333.444/0001-55', contract_id: 'BCO-DEF-2026-0007', amount_committed_pct: 40, amount_committed_value: 356000, start_date: '2026-02-01', end_date: '2028-02-01', operation_type: 'Empréstimo' },
  { id: 'GRA-002', merchant_id: '12348', merchant_name: 'Fashion Online', type: 'gravame', registry: 'Judicial', counterparty: 'Estado de SP - SEFAZ', counterparty_doc: '46.377.222/0001-29', cnj: '5567890-12.2026.8.26.0053', amount_committed_pct: 15, amount_committed_value: 85000, start_date: '2026-04-22', end_date: null, operation_type: 'ICMS — penhora' },
];

const TYPE_CFG = {
  cession: { icon: Lock, label: 'Cessão Fiduciária', color: 'bg-purple-100 text-purple-700', borderColor: 'border-purple-200' },
  gravame: { icon: Scale, label: 'Gravame Judicial', color: 'bg-amber-100 text-amber-700', borderColor: 'border-amber-200' },
};

export default function AdminIntContractEffectsRegistry() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [registryFilter, setRegistryFilter] = useState('all');

  const filtered = mockEffects.filter((e) => {
    if (search && !`${e.merchant_name} ${e.counterparty} ${e.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    if (registryFilter !== 'all' && e.registry !== registryFilter) return false;
    return true;
  });

  const totalValue = filtered.reduce((s, e) => s + e.amount_committed_value, 0);
  const cessionCount = filtered.filter(e => e.type === 'cession').length;
  const gravameCount = filtered.filter(e => e.type === 'gravame').length;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Registry de Efeitos de Contrato"
        subtitle="Cessões fiduciárias (CIP/B3) e gravames judiciais sobre fluxo de lojistas"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Registry de Efeitos' },
        ]}
        icon={Lock}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Registrar novo efeito
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Total de efeitos</p>
          <p className="text-3xl font-black mt-1">{filtered.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Cessões CIP/B3</p>
          <p className="text-3xl font-black mt-1 text-purple-600">{cessionCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Gravames judiciais</p>
          <p className="text-3xl font-black mt-1 text-amber-600">{gravameCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Valor comprometido (mensal)</p>
          <p className="text-2xl font-black mt-1">R$ {totalValue.toLocaleString('pt-BR')}</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar por lojista, contraparte, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="cession">Cessões</SelectItem>
              <SelectItem value="gravame">Gravames</SelectItem>
            </SelectContent>
          </Select>
          <Select value={registryFilter} onValueChange={setRegistryFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os registros</SelectItem>
              <SelectItem value="CIP">CIP</SelectItem>
              <SelectItem value="B3">B3</SelectItem>
              <SelectItem value="Judicial">Judicial</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map((e) => {
          const cfg = TYPE_CFG[e.type];
          const Icon = cfg.icon;
          return (
            <Card key={e.id} className={cfg.borderColor}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-[280px]">
                    <div className={`w-9 h-9 rounded-lg ${cfg.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{e.registry}</Badge>
                        <Badge className={cfg.color}>{cfg.label}</Badge>
                        <code className="text-[10px] text-slate-500">{e.id}</code>
                      </div>
                      <Link to={createPageUrl(`AdminIntMerchantProfile?id=${e.merchant_id}&tab=efeitos`)} className="font-bold text-slate-900 hover:text-[#2bc196] flex items-center gap-1 mt-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {e.merchant_name}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                      <p className="text-xs text-slate-700 mt-1">
                        Contraparte: <strong>{e.counterparty}</strong> ({e.counterparty_doc})
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{e.operation_type}</p>
                      {e.contract_id && <p className="text-xs text-slate-500 mt-0.5">Contrato: <code>{e.contract_id}</code></p>}
                      {e.cnj && <p className="text-xs text-slate-500 mt-0.5">CNJ: <code>{e.cnj}</code></p>}
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {e.start_date} {e.end_date ? `→ ${e.end_date}` : '(indeterminada)'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">{e.amount_committed_pct}%</p>
                    <p className="text-xs text-slate-500">R$ {e.amount_committed_value.toLocaleString('pt-BR')}/mês</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-xs h-7">
                      <FileText className="w-3 h-3 mr-1" /> Documento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card><CardContent className="p-10 text-center text-slate-500"><AlertTriangle className="w-8 h-8 mx-auto mb-2" />Nenhum efeito encontrado</CardContent></Card>
      )}
    </div>
  );
}