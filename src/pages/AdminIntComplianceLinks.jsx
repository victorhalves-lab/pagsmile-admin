import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Link as LinkIcon, Copy, Check, ExternalLink, RefreshCw,
  Shield, ShoppingCart, Cloud, CreditCard, Globe, Briefcase, BookOpen, Store,
  TrendingUp, MousePointer, FileCheck, Trash2, BarChart3, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import QuickLinkCard from '@/components/admin-interno/compliance/onboarding/QuickLinkCard';
import LinkAnalyticsDashboard from '@/components/admin-interno/compliance/onboarding/LinkAnalyticsDashboard';
import { mockComplianceLinks } from '@/components/admin-interno/compliance/onboarding/mocks/complianceLinksMock';

export default function AdminIntComplianceLinks() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [expandedLinkId, setExpandedLinkId] = useState(null);
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState(mockComplianceLinks);

  const base = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); } catch (e) { /* ignore */ }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success('Link copiado!');
  };

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success('Link excluído');
  };

  const quickLinksPixV4 = [
    { key: 'PIX_MERCHANT_V4', label: 'PIX Merchant v4', desc: '40 perguntas em 8 blocos. Compliance PIX + Conta para merchants. Foco em volume, natureza, PLD/FT e UBOs. Pré-preenchimento Lead.', icon: CreditCard, color: '#2bc196', url: `${base}/ComplianceDinamico?model=CompliancePixMerchantV4` },
    { key: 'PIX_INTERMEDIARIO_V4', label: 'PIX Intermediário v4', desc: '47 perguntas em 8 blocos. Compliance PIX + Conta para intermediários (Gateway/PSP, Marketplace, Plataforma). Foco em split, anti-bolção, MED e regulatório BCB.', icon: Globe, color: '#4f46e5', url: `${base}/ComplianceDinamico?model=CompliancePixIntermediarioV4` },
    { key: 'PIX_API_ENTERPRISE', label: 'PIX API Enterprise', desc: '~30 perguntas em 6 passos. Fluxo simplificado para grandes contas — autocomplete BDC massivo + enriquecimento automático de 40+ datasets. Liveness/Facematch + PLD/FT obrigatórios.', icon: Shield, color: '#2563eb', url: `${base}/ComplianceDinamico?model=pix_api_enterprise` },
  ];

  const quickLinksV4 = [
    { key: 'GATEWAY_V4', label: 'Gateway v4', desc: '85 perguntas em 12 blocos. Pré-preenchimento automático do Lead v5. Cobertura regulatória ~98%.', icon: Globe, color: '#4f46e5', url: `${base}/ComplianceDinamico?model=ComplianceGatewayV4` },
    { key: 'MARKETPLACE_V4', label: 'Marketplace v4', desc: '75 perguntas em 11 blocos. Foco em sellers, split e anti-bolsão. Pré-preenchimento Lead v5.', icon: ShoppingCart, color: '#d97706', url: `${base}/ComplianceDinamico?model=ComplianceMarketplaceV4` },
    { key: 'PLATAFORMA_VERTICAL_V4', label: 'Plataforma Vertical v4', desc: '52 perguntas em 9 blocos. Verticais de nicho (food, saúde, eventos). Pré-preenchimento Lead v5.', icon: Briefcase, color: '#7c3aed', url: `${base}/ComplianceDinamico?model=CompliancePlataformaVerticalV4` },
    { key: 'ECOMMERCE_V4', label: 'E-commerce v4', desc: '44 perguntas em 8 blocos. Foco em produtos, logística e entrega. Pré-preenchimento Lead v5.', icon: ShoppingCart, color: '#e11d48', url: `${base}/ComplianceDinamico?model=ComplianceEcommerceV4` },
    { key: 'INFOPRODUTOS_V4', label: 'Infoprodutos v4', desc: '56 perguntas em 11 blocos. Foco em produto digital, afiliados e práticas de vendas. Pré-preenchimento Lead v5.', icon: BookOpen, color: '#d97706', url: `${base}/ComplianceDinamico?model=ComplianceInfoprodutosV4` },
    { key: 'EDUCACAO_V4', label: 'Educação v4', desc: '37 perguntas em 8 blocos. Foco em reconhecimento MEC, modalidade de ensino e perfil de alunos. Pré-preenchimento Lead v5.', icon: BookOpen, color: '#0284c7', url: `${base}/ComplianceDinamico?model=ComplianceEducacaoV4` },
    { key: 'SAAS_V4', label: 'SaaS v4', desc: '40 perguntas em 9 blocos. Foco em modelo de negócio, recorrência, segurança de dados e triagem fintech. Pré-preenchimento Lead v5.', icon: Cloud, color: '#0891b2', url: `${base}/ComplianceDinamico?model=ComplianceSaaSV4` },
    { key: 'MERCHANT_LINK_V4', label: 'Merchant Link Pagamento v4', desc: '41 perguntas em 9 blocos. Foco em micro-merchants (MEI/SLU), canais social, entrega presencial e triagem de reclassificação. Pré-preenchimento Lead v5.', icon: Store, color: '#16a34a', url: `${base}/ComplianceDinamico?model=ComplianceMerchantLinkV4` },
    { key: 'MPE_V4', label: 'Micro e Pequenas Empresas v4', desc: '38 perguntas em 9 blocos. Foco em MEI/ME, ponto físico, atividade local e triagem de reclassificação. Pré-preenchimento Lead v5.', icon: Briefcase, color: '#d97706', url: `${base}/ComplianceDinamico?model=ComplianceMPEV4` },
    { key: 'DROPSHIPPING_V4', label: 'Dropshipping v4', desc: '52 perguntas em 11 blocos. Foco em fornecedor/logística, prazo de entrega, rastreamento, afiliados e risco de chargeback. Pré-preenchimento Lead v5.', icon: ShoppingCart, color: '#ea580c', url: `${base}/ComplianceDinamico?model=ComplianceDropshippingV4` },
  ];

  const stats = useMemo(() => {
    const tc = links.reduce((s, l) => s + (l.clickCount || 0), 0);
    const ts = links.reduce((s, l) => s + (l.submissionCount || 0), 0);
    const tco = links.reduce((s, l) => s + (l.completedCount || 0), 0);
    return { total: links.length, clicks: tc, submissions: ts, completed: tco, conv: tc > 0 ? ((ts / tc) * 100).toFixed(1) : 0 };
  }, [links]);

  const getLinkLabel = (link) => {
    const ct = link.complianceType;
    if (ct === 'PIX') return '💳 Pix';
    if (ct === 'FULL') return '🔒 Full';
    if (ct === 'LITE') return '⚡ Lite';
    if (ct === 'ECOMMERCE') return '🛒 E-comm';
    if (ct === 'SAAS') return '☁️ SaaS';
    return '🌐 Genérico';
  };

  const getV4ModelByComplianceType = (type) => {
    switch (type) {
      case 'PIX': return 'CompliancePixMerchantV4';
      case 'FULL': return 'ComplianceEcommerceV4';
      case 'LITE': return 'ComplianceSaaSV4';
      case 'ECOMMERCE': return 'ComplianceEcommerceV4';
      case 'SAAS': return 'ComplianceSaaSV4';
      default: return 'ComplianceEcommerceV4';
    }
  };

  const generateLinkUrl = (link) => {
    const model = getV4ModelByComplianceType(link.complianceType);
    let url = `${base}/ComplianceDinamico?model=${model}&ref=${link.uniqueCode}`;
    if (link.utmSource) url += `&utm_source=${link.utmSource}`;
    return url;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Links de Compliance"
        subtitle="Gere e compartilhe links de questionários de compliance por segmento"
        icon={LinkIcon}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Links de Compliance' },
        ]}
        actions={
          <Button variant="outline" onClick={() => toast.success('Atualizado')}>
            <RefreshCw className="w-4 h-4" /> Atualizar
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Links criados', value: stats.total, icon: LinkIcon, color: '#002443' },
          { label: 'Cliques', value: stats.clicks, icon: MousePointer, color: '#36706c' },
          { label: 'Submissões', value: stats.submissions, icon: FileCheck, color: '#2bc196' },
          { label: 'Concluídos', value: stats.completed, icon: Check, color: '#2bc196' },
          { label: 'Conversão', value: `${stats.conv}%`, icon: TrendingUp, color: '#36706c' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}15`, color: s.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 max-w-md">
        {[
          { id: 'links', label: 'Links Rápidos' },
          { id: 'historico', label: `Histórico (${links.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#003459] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'links' && (
        <div className="space-y-8">
          {/* PIX v4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">PIX v4 — Merchants & Intermediários</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Questionários específicos para operação PIX + Conta de pagamento. Conformidade Res. BCB 80/494/501/518.
                </p>
              </div>
              <Badge className="bg-[#2bc196] text-white border-0">NOVO</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinksPixV4.map((item) => (
                <QuickLinkCard key={item.key} item={item} copied={copiedKey === item.key} onCopy={handleCopy} />
              ))}
            </div>
          </div>

          {/* Por Segmento */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Por Segmento v4 — Pré-preenchimento Lead</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Questionários específicos por segmento com dados pré-preenchidos do questionário de lead
                </p>
              </div>
              <Badge className="bg-[#2bc196] text-white border-0">NOVO</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinksV4.map((item) => (
                <QuickLinkCard key={item.key} item={item} copied={copiedKey === item.key} onCopy={handleCopy} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'historico' && (
        <div className="space-y-2">
          {links.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73]">
              <LinkIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-700 dark:text-slate-200 font-semibold">Nenhum link criado ainda</p>
              <p className="text-sm text-slate-500 mt-1">Use os Links Rápidos acima para começar.</p>
            </div>
          ) : (
            links.map((link) => {
              const isExpanded = expandedLinkId === link.id;
              const conversion = link.clickCount > 0 ? ((link.submissionCount / link.clickCount) * 100).toFixed(1) : 0;
              return (
                <div
                  key={link.id}
                  className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] overflow-hidden"
                >
                  <div
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => setExpandedLinkId(isExpanded ? null : link.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{link.uniqueCode}</span>
                          <Badge variant="outline" className="text-xs">{getLinkLabel(link)}</Badge>
                          {link.commercialAgentName && (
                            <span className="text-xs text-slate-500">👤 {link.commercialAgentName}</span>
                          )}
                          {link.utmSource && (
                            <Badge variant="outline" className="text-xs">utm: {link.utmSource}</Badge>
                          )}
                          <span className="text-xs text-slate-400">
                            {new Date(link.created_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span><MousePointer className="w-3 h-3 inline mr-1" />{link.clickCount || 0} cliques</span>
                          <span><FileCheck className="w-3 h-3 inline mr-1" />{link.submissionCount || 0} subs</span>
                          <span className="text-emerald-600 font-semibold">
                            <TrendingUp className="w-3 h-3 inline mr-1" />{conversion}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleCopy(generateLinkUrl(link), link.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Copiar link"
                        >
                          {copiedKey === link.id ? <Check className="w-4 h-4 text-[#2bc196]" /> : <Copy className="w-4 h-4 text-slate-500" />}
                        </button>
                        <button
                          onClick={() => window.open(generateLinkUrl(link), '_blank')}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Abrir link"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors text-slate-500"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && <LinkAnalyticsDashboard link={link} />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}