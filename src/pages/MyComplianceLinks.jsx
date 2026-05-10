import React, { useMemo, useState } from 'react';
import { Link as LinkIcon, MousePointer, FileCheck, TrendingUp, Plus, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockOnboardingLinks, LINK_TYPE_CONFIG } from '@/components/admin-interno/compliance/v4/mocks/onboardingLinksV4Mock';
import { myMerchantInfo } from '@/components/my-compliance/mocks/mySubsellersMock';

export default function MyComplianceLinks() {
  const [copiedId, setCopiedId] = useState(null);

  // Filtra apenas os links criados POR este merchant (created_by_type=merchant + merchant_pai_id=meu)
  const myLinks = useMemo(
    () => mockOnboardingLinks.filter((l) => l.created_by_type === 'merchant' && l.merchant_pai_id === myMerchantInfo.id),
    []
  );

  const stats = useMemo(() => ({
    total: myLinks.length,
    clicks: myLinks.reduce((s, l) => s + (l.clicks_count || 0), 0),
    submissions: myLinks.reduce((s, l) => s + (l.submissions_count || 0), 0),
    completions: myLinks.reduce((s, l) => s + (l.completions_count || 0), 0),
    avgConv: myLinks.length ? (myLinks.reduce((s, l) => s + (l.conversion_rate || 0), 0) / myLinks.length).toFixed(1) : 0,
  }), [myLinks]);

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Link copiado!');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Meus Links de Compliance"
        subtitle="Links que você criou para captar subsellers — todos com sua marca aplicada"
        icon={LinkIcon}
        breadcrumbs={[{ label: 'Compliance', page: 'MyComplianceCenter' }, { label: 'Meus Links' }]}
        actions={<Button onClick={() => window.location.href = '/MySubsellerInvite'}><Plus className="w-4 h-4 mr-1" /> Criar Link</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <V4KpiCard icon={LinkIcon} label="Links" value={stats.total} accent="violet" />
        <V4KpiCard icon={MousePointer} label="Cliques" value={stats.clicks} accent="indigo" />
        <V4KpiCard icon={FileCheck} label="Submissões" value={stats.submissions} accent="amber" />
        <V4KpiCard icon={Check} label="Completions" value={stats.completions} accent="emerald" />
        <V4KpiCard icon={TrendingUp} label="Conversão" value={`${stats.avgConv}%`} accent="emerald" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        {myLinks.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 mb-4">Você ainda não criou nenhum link de subseller</p>
            <Button onClick={() => window.location.href = '/MySubsellerInvite'}>
              <Plus className="w-4 h-4 mr-1" /> Criar Primeiro Link
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {myLinks.map((l) => {
              const cfg = LINK_TYPE_CONFIG[l.type] || { label: l.type, icon: '🔗', color: '#94A3B8' };
              return (
                <div key={l.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border"
                          style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}10` }}
                        >
                          {cfg.label}
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">{l.status}</Badge>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{l.name}</p>
                      <code className="text-[10px] text-slate-500 font-mono break-all">{l.url}</code>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(l.url, l.id)} className="h-7 px-2">
                        {copiedId === l.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => window.open(l.url, '_blank')} className="h-7 px-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Cliques</p>
                      <p className="font-bold text-sm">{l.clicks_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Submissões</p>
                      <p className="font-bold text-sm">{l.submissions_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Completions</p>
                      <p className="font-bold text-sm text-emerald-600">{l.completions_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">Conversão</p>
                      <p className="font-bold text-sm">{(l.conversion_rate || 0).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}