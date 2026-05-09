import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building, Plus, Search, Users, MapPin, TrendingUp, ExternalLink } from 'lucide-react';

/**
 * Mentor F0503–F0540 — Listagem de grupos de lojistas (matriz/filiais).
 * Atende redes de varejo (farmácias, fast-food, conveniência).
 */
const mockGroups = [
  { id: 'GRP-001', name: 'Rede Farmácias ABC', radical_doc: '12.345.678', filiais_count: 47, tpv_30d: 23400000, holding: 'Holding ABC Saúde S.A.', cities_count: 12, status: 'active' },
  { id: 'GRP-002', name: 'Fast Food XYZ', radical_doc: '98.765.432', filiais_count: 23, tpv_30d: 8900000, holding: 'XYZ Brands LTDA', cities_count: 8, status: 'active' },
  { id: 'GRP-003', name: 'Conveniências Plus', radical_doc: '11.222.333', filiais_count: 156, tpv_30d: 67800000, holding: 'Plus Retail Group', cities_count: 34, status: 'active' },
  { id: 'GRP-004', name: 'Postos Combustível Sul', radical_doc: '44.555.666', filiais_count: 18, tpv_30d: 12300000, holding: null, cities_count: 5, status: 'active' },
  { id: 'GRP-005', name: 'Boutiques Fashion', radical_doc: '77.888.999', filiais_count: 9, tpv_30d: 1800000, holding: null, cities_count: 3, status: 'active' },
];

export default function AdminIntMerchantGroups() {
  const [search, setSearch] = useState('');

  const filtered = mockGroups.filter(g =>
    !search || `${g.name} ${g.holding || ''} ${g.radical_doc}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiliais = filtered.reduce((s, g) => s + g.filiais_count, 0);
  const totalTpv = filtered.reduce((s, g) => s + g.tpv_30d, 0);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Grupos de Lojistas"
        subtitle="Redes de varejo (matriz/filiais) — gestão consolidada"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Grupos de Lojistas' },
        ]}
        icon={Building}
        actions={
          <div className="flex gap-2">
            <Link to={createPageUrl('AdminIntCompanies')}>
              <Button variant="outline">Empresas Controladoras</Button>
            </Link>
            <Link to={createPageUrl('AdminIntMerchantGroupCreate')}>
              <Button><Plus className="w-4 h-4 mr-2" /> Novo Grupo</Button>
            </Link>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Total de grupos</p>
          <p className="text-3xl font-black mt-1">{filtered.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Total de filiais</p>
          <p className="text-3xl font-black mt-1 text-purple-600">{totalFiliais.toLocaleString('pt-BR')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">TPV agregado (30d)</p>
          <p className="text-2xl font-black mt-1">R$ {(totalTpv / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Ticket médio por filial</p>
          <p className="text-2xl font-black mt-1">R$ {(totalTpv / totalFiliais / 1000).toFixed(0)}k</p>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar grupo, holding, documento..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((g) => (
          <Link key={g.id} to={createPageUrl(`AdminIntMerchantGroupDetail?id=${g.id}`)}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{g.name}</p>
                      <p className="text-[11px] text-slate-500">Radical {g.radical_doc} · {g.id}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>

                {g.holding && (
                  <p className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                    <Building className="w-3 h-3" /> Controladora: <strong>{g.holding}</strong>
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Filiais</p>
                    <p className="font-black text-lg flex items-center gap-1"><Users className="w-3 h-3" />{g.filiais_count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Cidades</p>
                    <p className="font-black text-lg flex items-center gap-1"><MapPin className="w-3 h-3" />{g.cities_count}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-bold">TPV 30d</p>
                    <p className="font-black text-lg flex items-center gap-1"><TrendingUp className="w-3 h-3" />R$ {(g.tpv_30d / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}