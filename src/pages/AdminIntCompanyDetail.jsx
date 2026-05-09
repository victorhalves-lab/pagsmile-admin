import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Network, Building, ExternalLink } from 'lucide-react';

const mockCompany = {
  id: 'CMP-001', legal_name: 'Holding ABC Saúde S.A.', doc: '12.345.000/0001-00',
  business_name: 'ABC Saúde', founded: '2015-08-12', state: 'SP',
  legal_representatives: [
    { name: 'José da Silva', cpf: '111.222.333-44', role: 'CEO', share_pct: 40 },
    { name: 'Maria Souza', cpf: '555.666.777-88', role: 'CFO', share_pct: 30 },
  ],
  groups: [
    { id: 'GRP-001', name: 'Rede Farmácias ABC', filiais: 47, tpv_30d: 23400000 },
    { id: 'GRP-007', name: 'Drogarias Premium ABC', filiais: 15, tpv_30d: 4200000 },
    { id: 'GRP-008', name: 'Distribuidora ABC', filiais: 5, tpv_30d: 1300000 },
  ],
};

export default function AdminIntCompanyDetail() {
  const [params] = useSearchParams();

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={mockCompany.legal_name}
        subtitle={`${mockCompany.doc} · Controladora de ${mockCompany.groups.length} grupos`}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Controladoras', page: 'AdminIntCompanies' },
          { label: mockCompany.business_name },
        ]}
        icon={Network}
      />

      <Card>
        <CardHeader><CardTitle>Dados Cadastrais</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Razão Social" value={mockCompany.legal_name} />
          <Field label="CNPJ" value={mockCompany.doc} mono />
          <Field label="Fundação" value={mockCompany.founded} />
          <Field label="UF" value={mockCompany.state} />
          <Field label="Nome Fantasia" value={mockCompany.business_name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Representantes Legais</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockCompany.legal_representatives.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-bold text-sm">{r.name}</p>
                <p className="text-[11px] text-slate-500">CPF {r.cpf} · {r.role}</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700">{r.share_pct}% participação</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Grupos sob controle ({mockCompany.groups.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {mockCompany.groups.map((g) => (
            <Link key={g.id} to={createPageUrl(`AdminIntMerchantGroupDetail?id=${g.id}`)}>
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-bold text-sm">{g.name}</p>
                    <p className="text-[11px] text-slate-500">{g.filiais} filiais</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-sm">R$ {(g.tpv_30d / 1000000).toFixed(1)}M</p>
                    <p className="text-[10px] text-slate-500">TPV 30d</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-slate-500">{label}</p>
      <p className={`text-sm ${mono ? 'font-mono' : 'font-medium'} text-slate-900 mt-1`}>{value}</p>
    </div>
  );
}