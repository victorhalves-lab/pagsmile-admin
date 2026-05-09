import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Users, ShieldCheck, ShieldAlert, Filter, Download } from 'lucide-react';
import {
  mockBeneficiariesList,
  mockBeneficiaryDetail,
} from '@/components/mentor/mocks/splitBeneficiaryMock';
import MentorBeneficiaryListItem from '@/components/mentor/split/MentorBeneficiaryListItem';
import MentorBeneficiaryDetailPanel from '@/components/mentor/split/MentorBeneficiaryDetailPanel';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const KYC_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'verified', label: 'KYC OK' },
  { key: 'expired', label: 'Expirados' },
  { key: 'pending_review', label: 'Pendentes' },
  { key: 'flagged', label: 'Flagged' },
];

export default function SplitBeneficiaryHub() {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedId, setSelectedId] = useState('BEN-014892');

  const filtered = useMemo(() => {
    return mockBeneficiariesList.filter((b) => {
      if (kycFilter !== 'all' && b.kyc_status !== kycFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.document.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, kycFilter]);

  // Mostra o detalhado mockado quando o BEN-014892 está selecionado, senão usa dado da lista
  const selectedDetail = useMemo(() => {
    if (selectedId === 'BEN-014892') return mockBeneficiaryDetail;
    const found = mockBeneficiariesList.find((b) => b.beneficiary_id === selectedId);
    return found ? { ...mockBeneficiaryDetail, ...found, active_splits: mockBeneficiaryDetail.active_splits.slice(0, found.splits_count) } : null;
  }, [selectedId]);

  const stats = useMemo(() => ({
    total: mockBeneficiariesList.length,
    verified: mockBeneficiariesList.filter((b) => b.kyc_status === 'verified').length,
    issues: mockBeneficiariesList.filter((b) => b.kyc_status !== 'verified').length,
    pep: mockBeneficiariesList.filter((b) => b.is_pep).length,
  }), []);

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Beneficiários · Hub 360"
        subtitle="Visão consolidada Mentor de cada beneficiário com KYC, splits ativos e histórico"
        icon={Users}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Beneficiários' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 gap-1">
              <Sparkles className="w-3 h-3" /> Mentor · Wave H.10
            </Badge>
            <Button size="sm" variant="outline" onClick={() => toast.success('Lista de beneficiários exportada')}>
              <Download className="w-3.5 h-3.5 mr-1" /> Exportar
            </Button>
          </div>
        }
      />

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Total</p><p className="text-xl font-black">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">KYC verificado</p><p className="text-xl font-black text-emerald-700 flex items-center gap-1"><ShieldCheck className="w-4 h-4" />{stats.verified}</p></CardContent></Card>
        <Card className="border-red-200"><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">Com problemas</p><p className="text-xl font-black text-red-700 flex items-center gap-1"><ShieldAlert className="w-4 h-4" />{stats.issues}</p></CardContent></Card>
        <Card className="border-amber-200"><CardContent className="p-3"><p className="text-[10px] uppercase font-bold text-slate-500">PEP</p><p className="text-xl font-black text-amber-700">{stats.pep}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Lista */}
        <div className="lg:col-span-4 space-y-3">
          <Card>
            <CardContent className="p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Buscar nome ou documento…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <Filter className="w-3 h-3 text-slate-500" />
                {KYC_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setKycFilter(f.key)}
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-semibold border transition',
                      kycFilter === f.key
                        ? 'bg-violet-600 text-white border-violet-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500">{filtered.length} beneficiário(s)</p>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filtered.map((b) => (
              <MentorBeneficiaryListItem
                key={b.beneficiary_id}
                beneficiary={b}
                isSelected={selectedId === b.beneficiary_id}
                onClick={(ben) => setSelectedId(ben.beneficiary_id)}
              />
            ))}
          </div>
        </div>

        {/* Painel detalhado */}
        <div className="lg:col-span-8">
          <MentorBeneficiaryDetailPanel beneficiary={selectedDetail} />
        </div>
      </div>
    </div>
  );
}