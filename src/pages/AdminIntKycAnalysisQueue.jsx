import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, AlertTriangle, ScanSearch, Copy, Calendar, ExternalLink, Search, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Mentor F0339–F0372 — Fila de documentos KYC pendentes para Compliance.
 * Inclui OCR auto-extrai dados, alerta de duplicação byte-a-byte, expiração.
 */
const QUEUE = [
  {
    id: 'KYC-001', merchant_id: '12347', merchant_name: 'Tech Store', doc_type: 'Contrato Social',
    uploaded_at: '2026-05-08 14:32', status: 'pending', priority: 'high',
    ocr_extracted: { cnpj: '11.222.333/0001-44', razao_social: 'TECH STORE LTDA' },
    ocr_match: true, duplicate: false, expires_at: '2026-08-08',
  },
  {
    id: 'KYC-002', merchant_id: '12352', merchant_name: 'Saúde Total', doc_type: 'RG do Sócio',
    uploaded_at: '2026-05-08 11:15', status: 'pending', priority: 'normal',
    ocr_extracted: { nome: 'JOÃO DA SILVA', cpf: '111.222.333-44' },
    ocr_match: false, ocr_alert: 'CPF do documento não bate com cadastro do sócio',
    duplicate: false, expires_at: null,
  },
  {
    id: 'KYC-003', merchant_id: '12355', merchant_name: 'Fintech Pay', doc_type: 'Comprovante Endereço',
    uploaded_at: '2026-05-09 09:02', status: 'pending', priority: 'high',
    ocr_extracted: { endereco: 'Av. Paulista 1000', cep: '01310-100' },
    ocr_match: true, duplicate: true, duplicate_alert: 'Hash idêntico ao documento do lojista #98765 (suspeita de fraude)',
    expires_at: null,
  },
  {
    id: 'KYC-004', merchant_id: '12345', merchant_name: 'E-commerce XYZ', doc_type: 'Cartão CNPJ',
    uploaded_at: '2026-05-07 16:45', status: 'expiring_soon',
    ocr_extracted: { cnpj: '12.345.678/0001-90' },
    ocr_match: true, duplicate: false, expires_at: '2026-06-07', days_to_expire: 29,
  },
];

export default function AdminIntKycAnalysisQueue() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [docTypeFilter, setDocTypeFilter] = useState('all');

  const filtered = QUEUE.filter(q => {
    if (search && !`${q.merchant_name} ${q.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    if (docTypeFilter !== 'all' && q.doc_type !== docTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Fila de Análise KYC"
        subtitle="Documentos pendentes para Compliance — com OCR, detecção de duplicação e expiração"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Compliance', page: 'AdminIntCompliance' },
          { label: 'Fila de Análise' },
        ]}
        icon={FileCheck}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><p className="text-[10px] font-bold uppercase text-slate-500">Na fila</p><p className="text-3xl font-black mt-1">{QUEUE.length}</p></Card>
        <Card className="p-4 border-amber-200"><p className="text-[10px] font-bold uppercase text-amber-700">Expirando ≤30d</p><p className="text-3xl font-black mt-1 text-amber-700">1</p></Card>
        <Card className="p-4 border-red-200"><p className="text-[10px] font-bold uppercase text-red-700">Suspeita de duplicação</p><p className="text-3xl font-black mt-1 text-red-700">1</p></Card>
        <Card className="p-4 border-red-200"><p className="text-[10px] font-bold uppercase text-red-700">Divergência OCR</p><p className="text-3xl font-black mt-1 text-red-700">1</p></Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Buscar lojista, ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="expiring_soon">Expirando</SelectItem>
            </SelectContent>
          </Select>
          <Select value={docTypeFilter} onValueChange={setDocTypeFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="Contrato Social">Contrato Social</SelectItem>
              <SelectItem value="RG do Sócio">RG do Sócio</SelectItem>
              <SelectItem value="Comprovante Endereço">Comprovante Endereço</SelectItem>
              <SelectItem value="Cartão CNPJ">Cartão CNPJ</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Fila */}
      <div className="space-y-3">
        {filtered.map(q => (
          <Card key={q.id} className={cn(
            q.duplicate ? 'border-red-300' :
            q.ocr_alert ? 'border-amber-300' :
            q.status === 'expiring_soon' ? 'border-amber-200' : ''
          )}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-[280px]">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link to={createPageUrl(`AdminIntMerchantProfile?id=${q.merchant_id}&tab=kyc`)} className="font-bold text-slate-900 hover:text-[#2bc196] flex items-center gap-1">
                        {q.merchant_name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Badge variant="outline">{q.doc_type}</Badge>
                      {q.priority === 'high' && <Badge className="bg-red-100 text-red-700">Alta prioridade</Badge>}
                      <code className="text-[10px] text-slate-500">{q.id}</code>
                    </div>
                    <p className="text-xs text-slate-500">Enviado em {q.uploaded_at}</p>

                    {/* OCR */}
                    {q.ocr_extracted && (
                      <div className="mt-2 p-2 rounded bg-slate-50 text-xs">
                        <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                          <ScanSearch className="w-3 h-3" /> OCR extraiu
                        </p>
                        {Object.entries(q.ocr_extracted).map(([k, v]) => (
                          <p key={k}><strong>{k}:</strong> <code>{v}</code></p>
                        ))}
                      </div>
                    )}

                    {/* Alertas */}
                    {q.duplicate && (
                      <div className="mt-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                        <Copy className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Suspeita de duplicação:</strong> {q.duplicate_alert}
                        </div>
                      </div>
                    )}
                    {q.ocr_alert && (
                      <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <div>{q.ocr_alert}</div>
                      </div>
                    )}
                    {q.expires_at && q.days_to_expire <= 30 && (
                      <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                        <Calendar className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <div>Expira em <strong>{q.days_to_expire} dias</strong> ({q.expires_at})</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">Ver documento</Button>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Aprovar</Button>
                  <Button size="sm" variant="destructive">Rejeitar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}