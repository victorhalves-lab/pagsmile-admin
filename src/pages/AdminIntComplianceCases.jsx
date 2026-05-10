import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Filter, Download, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import V4CasesFilters from '@/components/admin-interno/compliance/v4/V4CasesFilters';
import V4CasesTable from '@/components/admin-interno/compliance/v4/V4CasesTable';
import { mockAllCases } from '@/components/admin-interno/compliance/v4/mocks/onboardingCasesV4Mock';

export default function AdminIntComplianceCases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('all');
  const [origem, setOrigem] = useState('all');
  const [modelo, setModelo] = useState('all');
  const [merchantPai, setMerchantPai] = useState('all');

  const merchantPais = useMemo(() => {
    const map = {};
    mockAllCases.forEach((c) => {
      if (c.merchant_pai_id) map[c.merchant_pai_id] = c.merchant_pai_name;
    });
    return Object.entries(map).map(([id, name]) => ({ id, name }));
  }, []);

  const filtered = useMemo(() => {
    let list = [...mockAllCases];
    if (tipo !== 'all') list = list.filter((c) => c.tipo === tipo);
    if (origem !== 'all') list = list.filter((c) => c.origem === origem);
    if (modelo !== 'all') list = list.filter((c) => c.modelo_compliance === modelo);
    if (merchantPai !== 'all') list = list.filter((c) => c.merchant_pai_id === merchantPai);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        (c.case_id || '').toLowerCase().includes(q) ||
        (c.razao_social || '').toLowerCase().includes(q) ||
        (c.nome_completo || '').toLowerCase().includes(q) ||
        (c.cnpj || '').includes(q) ||
        (c.cpf || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [search, tipo, origem, modelo, merchantPai]);

  const stats = useMemo(() => ({
    total: mockAllCases.length,
    merchants: mockAllCases.filter((c) => c.tipo === 'merchant').length,
    subPj: mockAllCases.filter((c) => c.tipo === 'subseller_pj').length,
    subPf: mockAllCases.filter((c) => c.tipo === 'subseller_pf').length,
    autoApproved: mockAllCases.filter((c) => c.status === 'auto_approved').length,
    autoRejected: mockAllCases.filter((c) => c.status === 'auto_rejected').length,
    manualReview: mockAllCases.filter((c) => c.status === 'manual_review').length,
  }), []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Casos de Compliance"
        subtitle="Visão consolidada — todos os casos (Merchants + Subsellers) com filtros V4"
        icon={Briefcase}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Todos os Casos' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar CSV</Button>
            <Button variant="outline"><FileSpreadsheet className="w-4 h-4 mr-1" /> Bulk Actions</Button>
            <Button variant="outline"><RefreshCw className="w-4 h-4 mr-1" /> Atualizar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <V4KpiCard icon={Briefcase} label="Total casos" value={stats.total} accent="blue" />
        <V4KpiCard icon={Filter} label="Merchants" value={stats.merchants} accent="indigo" />
        <V4KpiCard icon={Filter} label="Sub PJ" value={stats.subPj} accent="violet" />
        <V4KpiCard icon={Filter} label="Sub PF" value={stats.subPf} accent="violet" />
        <V4KpiCard icon={Filter} label="Auto-Aprov." value={stats.autoApproved} accent="emerald" />
        <V4KpiCard icon={Filter} label="Auto-Rec." value={stats.autoRejected} accent="red" />
        <V4KpiCard icon={Filter} label="Manual" value={stats.manualReview} accent="amber" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <V4CasesFilters
          search={search} setSearch={setSearch}
          tipo={tipo} setTipo={setTipo}
          origem={origem} setOrigem={setOrigem}
          modelo={modelo} setModelo={setModelo}
          merchantPai={merchantPai} setMerchantPai={setMerchantPai}
          merchantPais={merchantPais}
        />
        <div className="mt-4">
          <V4CasesTable cases={filtered} onRowClick={(c) => navigate(`/AdminIntComplianceCaseDetail?id=${c.id}`)} />
        </div>
      </div>
    </div>
  );
}