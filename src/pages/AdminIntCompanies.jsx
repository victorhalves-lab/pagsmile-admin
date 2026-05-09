import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Plus, Search, ExternalLink, Network } from 'lucide-react';

/**
 * Mentor F0568–F0580 — Empresas controladoras (entidades contratuais B2B).
 * Holdings que englobam múltiplos grupos.
 */
const mockCompanies = [
  { id: 'CMP-001', legal_name: 'Holding ABC Saúde S.A.', doc: '12.345.000/0001-00', groups_count: 3, total_filiais: 67, total_tpv_30d: 28900000 },
  { id: 'CMP-002', legal_name: 'XYZ Brands LTDA', doc: '98.765.000/0001-00', groups_count: 5, total_filiais: 89, total_tpv_30d: 41200000 },
  { id: 'CMP-003', legal_name: 'Plus Retail Group', doc: '11.222.000/0001-00', groups_count: 2, total_filiais: 156, total_tpv_30d: 67800000 },
];

export default function AdminIntCompanies() {
  const [search, setSearch] = useState('');
  const filtered = mockCompanies.filter(c => !search || `${c.legal_name} ${c.doc}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Empresas Controladoras"
        subtitle="Holdings que controlam múltiplos grupos / lojistas"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Grupos', page: 'AdminIntMerchantGroups' },
          { label: 'Controladoras' },
        ]}
        icon={Network}
        actions={<Button><Plus className="w-4 h-4 mr-2" /> Nova Controladora</Button>}
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar holding..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Link key={c.id} to={createPageUrl(`AdminIntCompanyDetail?id=${c.id}`)}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{c.legal_name}</p>
                    <p className="text-xs text-slate-500">{c.doc} · {c.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div><p className="text-[10px] uppercase text-slate-500 font-bold">Grupos</p><p className="font-black text-lg">{c.groups_count}</p></div>
                  <div><p className="text-[10px] uppercase text-slate-500 font-bold">Filiais</p><p className="font-black text-lg">{c.total_filiais}</p></div>
                  <div><p className="text-[10px] uppercase text-slate-500 font-bold">TPV 30d</p><p className="font-black text-lg">R$ {(c.total_tpv_30d / 1000000).toFixed(1)}M</p></div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}