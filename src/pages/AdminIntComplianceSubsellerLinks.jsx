import React, { useMemo } from 'react';
import { Link as LinkIcon, Users, Building2, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import V4LinksTable from '@/components/admin-interno/compliance/v4/V4LinksTable';
import { mockOnboardingLinks } from '@/components/admin-interno/compliance/v4/mocks/onboardingLinksV4Mock';

export default function AdminIntComplianceSubsellerLinks() {
  const subsellerLinks = useMemo(() => mockOnboardingLinks.filter((l) => l.scope === 'subseller'), []);

  const byMerchant = useMemo(() => {
    const map = {};
    subsellerLinks.forEach((l) => {
      const key = l.merchant_pai_id || 'unknown';
      if (!map[key]) map[key] = { name: l.merchant_pai_name, links: [], totalUses: 0, totalCompletions: 0 };
      map[key].links.push(l);
      map[key].totalUses += l.uses_count || 0;
      map[key].totalCompletions += l.completions_count || 0;
    });
    return Object.entries(map).map(([id, v]) => ({ id, ...v }));
  }, [subsellerLinks]);

  const stats = useMemo(() => ({
    total: subsellerLinks.length,
    merchants: byMerchant.length,
    completions: subsellerLinks.reduce((s, l) => s + (l.completions_count || 0), 0),
    avgConv: subsellerLinks.length ? (subsellerLinks.reduce((s, l) => s + (l.conversion_rate || 0), 0) / subsellerLinks.length).toFixed(1) : 0,
  }), [subsellerLinks, byMerchant]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Links de Subsellers"
        subtitle="Acompanhe os links de onboarding que merchants criaram para captar seus subsellers"
        icon={Users}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Links de Subsellers' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={LinkIcon} label="Links de Subseller" value={stats.total} accent="violet" />
        <V4KpiCard icon={Building2} label="Merchants criadores" value={stats.merchants} accent="indigo" />
        <V4KpiCard icon={Users} label="Subsellers cadastrados" value={stats.completions} accent="emerald" />
        <V4KpiCard icon={TrendingUp} label="Conversão média" value={`${stats.avgConv}%`} accent="emerald" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5 space-y-5">
        <h3 className="font-bold text-slate-900 dark:text-white">Links Agrupados por Merchant</h3>
        {byMerchant.map((m) => (
          <div key={m.id} className="rounded-xl border border-slate-100 dark:border-[#004D73] overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-purple-600" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">{m.name}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>{m.links.length} links</span>
                <span>{m.totalUses} usos</span>
                <span className="text-emerald-600 font-bold">{m.totalCompletions} completions</span>
              </div>
            </div>
            <div className="p-3">
              <V4LinksTable links={m.links} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}