import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, Search, RefreshCw, CheckCircle2, XCircle, Clock, Eye,
  Download, Filter, Users, Building2, User,
} from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockDocuments, DOC_TYPE_CONFIG, DOC_STATUS_CONFIG } from '@/components/admin-interno/compliance/v4/mocks/documentsV4Mock';

export default function AdminIntComplianceDocs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const docs = mockDocuments;

  const stats = useMemo(() => ({
    total: docs.length,
    valid: docs.filter((d) => d.status === 'valid').length,
    pending: docs.filter((d) => d.status === 'pending').length,
    rejected: docs.filter((d) => d.status === 'rejected').length,
    expired: docs.filter((d) => d.status === 'expired').length,
    merchant: docs.filter((d) => d.tipo === 'merchant').length,
    subseller: docs.filter((d) => d.tipo?.startsWith('subseller')).length,
  }), [docs]);

  const filtered = useMemo(() => {
    let list = [...docs];
    if (activeTab === 'merchants') list = list.filter((d) => d.tipo === 'merchant');
    else if (activeTab === 'subsellers') list = list.filter((d) => d.tipo?.startsWith('subseller'));
    else if (activeTab === 'pending') list = list.filter((d) => d.status === 'pending');
    if (statusFilter !== 'all') list = list.filter((d) => d.status === statusFilter);
    if (typeFilter !== 'all') list = list.filter((d) => d.document_type === typeFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((d) =>
        (d.document_name || '').toLowerCase().includes(q) ||
        (d.merchantName || '').toLowerCase().includes(q) ||
        (d.merchant_pai_name || '').toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
  }, [docs, activeTab, statusFilter, typeFilter, searchTerm]);

  // Agrupado por caso/merchant
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((d) => {
      const key = d.onboarding_case_id;
      if (!map[key]) {
        map[key] = {
          case_id: key,
          merchantName: d.merchantName,
          merchant_pai_name: d.merchant_pai_name,
          tipo: d.tipo,
          docs: [],
        };
      }
      map[key].docs.push(d);
    });
    return Object.values(map);
  }, [filtered]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Gestão de Documentos"
        subtitle="Repositório central de documentos KYC/KYB — Merchants e Subsellers"
        icon={FileText}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Documentos' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
            <Button variant="outline"><RefreshCw className="w-4 h-4 mr-1" /> Atualizar</Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <V4KpiCard icon={FileText} label="Total Docs" value={stats.total} accent="blue" />
        <V4KpiCard icon={CheckCircle2} label="Válidos" value={stats.valid} accent="emerald" />
        <V4KpiCard icon={Clock} label="Pendentes" value={stats.pending} accent="amber" />
        <V4KpiCard icon={XCircle} label="Rejeitados" value={stats.rejected} accent="red" />
        <V4KpiCard icon={Filter} label="Expirados" value={stats.expired} accent="violet" />
        <V4KpiCard icon={Building2} label="Merchants" value={stats.merchant} accent="indigo" />
        <V4KpiCard icon={Users} label="Subsellers" value={stats.subseller} accent="violet" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
            <TabsTrigger value="merchants">Merchants ({stats.merchant})</TabsTrigger>
            <TabsTrigger value="subsellers">Subsellers ({stats.subseller})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-5 mb-4 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar documento, merchant..."
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="valid">Válidos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Tipo de documento" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(DOC_TYPE_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.icon} {cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista agrupada */}
        <div className="space-y-3">
          {grouped.length === 0 && (
            <div className="text-center py-12 text-slate-400">Nenhum documento encontrado</div>
          )}
          {grouped.map((g) => (
            <div key={g.case_id} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {g.tipo === 'merchant' ? (
                    <Building2 className="w-4 h-4 text-blue-600" />
                  ) : g.tipo === 'subseller_pj' ? (
                    <Building2 className="w-4 h-4 text-purple-600" />
                  ) : (
                    <User className="w-4 h-4 text-pink-600" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{g.merchantName}</p>
                    {g.merchant_pai_name && (
                      <p className="text-[11px] text-purple-600 dark:text-purple-300 font-semibold">
                        Subseller de {g.merchant_pai_name}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {g.docs.length} {g.docs.length === 1 ? 'documento' : 'documentos'}
                </Badge>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {g.docs.map((d) => {
                  const typeCfg = DOC_TYPE_CONFIG[d.document_type] || { label: d.document_type, icon: '📎' };
                  const statusCfg = DOC_STATUS_CONFIG[d.status] || { label: d.status, color: 'bg-slate-100 text-slate-700' };
                  return (
                    <div key={d.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="text-2xl">{typeCfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {d.document_name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{typeCfg.label}</span>
                          <span>·</span>
                          <span>{new Date(d.uploaded_at).toLocaleDateString('pt-BR')}</span>
                          {d.validation_score && (
                            <>
                              <span>·</span>
                              <span className="font-semibold">Score: {d.validation_score}</span>
                            </>
                          )}
                        </div>
                        {d.validation_notes && (
                          <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">⚠️ {d.validation_notes}</p>
                        )}
                      </div>
                      <Badge className={`${statusCfg.color} border-0`}>{statusCfg.label}</Badge>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}