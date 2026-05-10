import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Link as LinkIcon, Copy, Check, RefreshCw, Shield, ShoppingCart, Cloud,
  CreditCard, Globe, Briefcase, BookOpen, Store, TrendingUp, MousePointer,
  FileCheck, Building2, Plus, Search, Camera, FileText, Users, UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import QuickLinkCard from '@/components/admin-interno/compliance/onboarding/QuickLinkCard';
import V4LinksTable from '@/components/admin-interno/compliance/v4/V4LinksTable';
import { mockOnboardingLinks } from '@/components/admin-interno/compliance/v4/mocks/onboardingLinksV4Mock';

export default function AdminIntComplianceLinks() {
  const [activeTab, setActiveTab] = useState('quick');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [links, setLinks] = useState(mockOnboardingLinks);
  const [copiedKey, setCopiedKey] = useState(null);

  const base = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); } catch (e) { /* ignore */ }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success('Link copiado!');
  };

  // Quick Links — V4 Cartão por segmento
  const quickLinksV4Card = [
    { key: 'GATEWAY_V4', label: 'Gateway v4', desc: '85 perguntas em 12 blocos. Cobertura regulatória ~98%.', icon: Globe, color: '#4f46e5', url: `${base}/ComplianceFullKYC?model=v4_gateway` },
    { key: 'MARKETPLACE_V4', label: 'Marketplace v4', desc: '75 perguntas. Foco em sellers, split, anti-bolsão.', icon: ShoppingCart, color: '#d97706', url: `${base}/ComplianceFullKYC?model=v4_marketplace` },
    { key: 'ECOMMERCE_V4', label: 'E-commerce v4', desc: '44 perguntas. Foco em produtos e logística.', icon: ShoppingCart, color: '#e11d48', url: `${base}/ComplianceFullKYC?model=v4_ecommerce` },
    { key: 'INFOPRODUTOS_V4', label: 'Infoprodutos v4', desc: '56 perguntas. Foco em produto digital, afiliados.', icon: BookOpen, color: '#d97706', url: `${base}/ComplianceFullKYC?model=v4_infoprodutos` },
    { key: 'EDUCACAO_V4', label: 'Educação v4', desc: '37 perguntas. MEC, modalidade, alunos.', icon: BookOpen, color: '#0284c7', url: `${base}/ComplianceFullKYC?model=v4_educacao` },
    { key: 'SAAS_V4', label: 'SaaS v4', desc: '40 perguntas. Recorrência, dados, fintech.', icon: Cloud, color: '#0891b2', url: `${base}/ComplianceFullKYC?model=v4_saas` },
    { key: 'MERCHANT_LINK_V4', label: 'Merchant Link v4', desc: '41 perguntas. MEI/SLU, social, presencial.', icon: Store, color: '#16a34a', url: `${base}/ComplianceFullKYC?model=v4_merchant_link` },
    { key: 'MPE_V4', label: 'MPE v4', desc: '38 perguntas. MEI/ME, ponto físico, atividade local.', icon: Briefcase, color: '#d97706', url: `${base}/ComplianceFullKYC?model=v4_mpe` },
    { key: 'DROPSHIPPING_V4', label: 'Dropshipping v4', desc: '52 perguntas. Logística, prazo, afiliados.', icon: ShoppingCart, color: '#ea580c', url: `${base}/ComplianceFullKYC?model=v4_dropshipping` },
    { key: 'PLATAFORMA_V4', label: 'Plataforma Vertical v4', desc: '52 perguntas. Verticais de nicho (food, saúde).', icon: Briefcase, color: '#7c3aed', url: `${base}/ComplianceFullKYC?model=v4_plataforma_vertical` },
  ];

  const quickLinksPixV4 = [
    { key: 'PIX_MERCHANT_V4', label: 'PIX Merchant v4', desc: '40 perguntas em 8 blocos. Volume, natureza, PLD/FT, UBOs.', icon: CreditCard, color: '#2bc196', url: `${base}/CompliancePixOnly?model=v4_pix_merchant` },
    { key: 'PIX_INTERMEDIARIO_V4', label: 'PIX Intermediário v4', desc: '47 perguntas. Gateway/PSP, Marketplace, Plataforma.', icon: Globe, color: '#4f46e5', url: `${base}/CompliancePixOnly?model=v4_pix_intermediario` },
    { key: 'PIX_API_ENTERPRISE', label: 'PIX API Enterprise', desc: '~30 perguntas. Autocomplete BDC + Liveness.', icon: Shield, color: '#2563eb', url: `${base}/CompliancePixOnly?model=v4_pix_api_enterprise` },
  ];

  const quickLinksSubseller = [
    { key: 'SUBSELLER_PJ', label: 'Subseller PJ', desc: 'Questionário V4 simplificado para subsellers PJ. Modelo focado em revenda/marketplace.', icon: Building2, color: '#7c3aed', url: `${base}/AccountCreationStep1?type=subseller&kind=pj` },
    { key: 'SUBSELLER_PF', label: 'Subseller PF', desc: 'Questionário V4 para pessoa física. Foco em CAF + score Serasa + endereço.', icon: Users, color: '#db2777', url: `${base}/AccountCreationStep1?type=subseller&kind=pf` },
  ];

  const quickLinksAdvanced = [
    { key: 'DOC_ONLY', label: 'Doc-Only (Reenvio)', desc: 'Para casos onde só faltam documentos. Não refaz questionário.', icon: FileText, color: '#d97706', url: `${base}/ComplianceDocOnly` },
    { key: 'CAF_ONLY', label: 'Só CAF / Liveness', desc: 'Apenas biometria + facematch. Para refazer KYC visual.', icon: Camera, color: '#7c3aed', url: `${base}/LivenessFacematchStep` },
    { key: 'CAF_DOCS', label: 'CAF + Documentos', desc: 'Biometria CAF + upload de documentos no mesmo fluxo.', icon: UserCheck, color: '#0891b2', url: `${base}/ComplianceFullKYC?caf_docs=true` },
    { key: 'PRE_FILLED', label: 'Pré-preenchido', desc: 'Inicia o caso com dados pré-preenchidos pelo time interno.', icon: FileCheck, color: '#16a34a', url: `${base}/ComplianceOnboardingStart?prefill=true` },
  ];

  // Filtros
  const filteredLinks = useMemo(() => {
    let list = [...links];
    if (scopeFilter !== 'all') list = list.filter((l) => l.scope === scopeFilter);
    if (creatorFilter !== 'all') list = list.filter((l) => l.created_by_type === creatorFilter);
    if (typeFilter !== 'all') list = list.filter((l) => l.type === typeFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((l) =>
        l.name.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        (l.merchant_pai_name || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  }, [links, scopeFilter, creatorFilter, typeFilter, searchTerm]);

  const stats = useMemo(() => {
    const totalClicks = links.reduce((s, l) => s + (l.clicks_count || 0), 0);
    const totalSubs = links.reduce((s, l) => s + (l.submissions_count || 0), 0);
    const totalCompletions = links.reduce((s, l) => s + (l.completions_count || 0), 0);
    const conv = totalClicks ? ((totalSubs / totalClicks) * 100).toFixed(1) : 0;
    return {
      total: links.length,
      pagsmile: links.filter((l) => l.created_by_type === 'pagsmile_admin').length,
      merchant: links.filter((l) => l.created_by_type === 'merchant').length,
      subseller: links.filter((l) => l.scope === 'subseller').length,
      clicks: totalClicks,
      subs: totalSubs,
      completions: totalCompletions,
      conv,
    };
  }, [links]);

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success('Link removido');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Links de Compliance"
        subtitle="Gere e gerencie links de compliance — Self, Doc-Only, CAF, Subsellers e por segmento"
        icon={LinkIcon}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Links de Compliance' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><RefreshCw className="w-4 h-4 mr-1" /> Atualizar</Button>
            <Button><Plus className="w-4 h-4 mr-1" /> Novo Link</Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <V4KpiCard icon={LinkIcon} label="Total" value={stats.total} accent="blue" />
        <V4KpiCard icon={Shield} label="PagSmile" value={stats.pagsmile} accent="indigo" />
        <V4KpiCard icon={Building2} label="Merchants" value={stats.merchant} accent="violet" />
        <V4KpiCard icon={Users} label="Subsellers" value={stats.subseller} accent="violet" />
        <V4KpiCard icon={MousePointer} label="Cliques" value={stats.clicks} accent="slate" />
        <V4KpiCard icon={FileCheck} label="Submissões" value={stats.subs} accent="emerald" />
        <V4KpiCard icon={TrendingUp} label="Conversão" value={`${stats.conv}%`} accent="emerald" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="quick">Links Rápidos</TabsTrigger>
            <TabsTrigger value="history">Histórico ({stats.total})</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'quick' && (
          <div className="mt-6 space-y-8">
            {/* Avançados (Doc-Only / CAF / Pré-preenchido) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Links Avançados (Excepcionais)</h2>
                <Badge className="bg-amber-100 text-amber-700 border-0">Uso Pontual</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Esses links são usados em situações específicas (reenvio de docs, refazer biometria, completar caso pré-preenchido).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinksAdvanced.map((item) => (
                  <QuickLinkCard key={item.key} item={item} copied={copiedKey === item.key} onCopy={handleCopy} />
                ))}
              </div>
            </div>

            {/* PIX V4 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">PIX V4 — Merchants & Intermediários</h2>
                <Badge className="bg-[#2bc196] text-white border-0">PIX</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinksPixV4.map((item) => (
                  <QuickLinkCard key={item.key} item={item} copied={copiedKey === item.key} onCopy={handleCopy} />
                ))}
              </div>
            </div>

            {/* Card V4 por Segmento */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Cartão V4 — Por Segmento</h2>
                <Badge className="bg-indigo-500 text-white border-0">Card</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinksV4Card.map((item) => (
                  <QuickLinkCard key={item.key} item={item} copied={copiedKey === item.key} onCopy={handleCopy} />
                ))}
              </div>
            </div>

            {/* Subseller */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Subsellers</h2>
                <Badge className="bg-purple-500 text-white border-0">Multi-tenant</Badge>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Links que podem ser gerados pelo time interno OU pelo merchant (com white-label da marca dele).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickLinksSubseller.map((item) => (
                  <QuickLinkCard key={item.key} item={item} copied={copiedKey === item.key} onCopy={handleCopy} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="mt-6 space-y-4">
            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar links..."
                  className="pl-9 w-64"
                />
              </div>
              <Select value={scopeFilter} onValueChange={setScopeFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Escopo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os escopos</SelectItem>
                  <SelectItem value="merchant">Merchants</SelectItem>
                  <SelectItem value="subseller">Subsellers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={creatorFilter} onValueChange={setCreatorFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Criador" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pagsmile_admin">PagSmile (Admin)</SelectItem>
                  <SelectItem value="merchant">Merchants</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="self_compliance_subseller">Compliance Self</SelectItem>
                  <SelectItem value="doc_only">Doc-Only</SelectItem>
                  <SelectItem value="caf_only">Só CAF</SelectItem>
                  <SelectItem value="caf_docs">CAF + Docs</SelectItem>
                  <SelectItem value="pre_filled">Pré-preenchido</SelectItem>
                  <SelectItem value="subseller_pj">Subseller PJ</SelectItem>
                  <SelectItem value="subseller_pf">Subseller PF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <V4LinksTable links={filteredLinks} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
}