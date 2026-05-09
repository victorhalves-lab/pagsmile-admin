import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, Download, Send, XCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { mockBillets, mockBilletsKPIs } from '@/components/mentor/mocks/billetsBackofficeMock';
import MentorBilletKPIBar from '@/components/mentor/billet/MentorBilletKPIBar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const STATUS_META = {
  registered: { label: 'Registrado', color: 'bg-blue-100 text-blue-700' },
  paid: { label: 'Pago', color: 'bg-emerald-100 text-emerald-700' },
  overdue: { label: 'Vencido', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelado', color: 'bg-slate-200 text-slate-700' },
  in_registration: { label: 'Em registro', color: 'bg-amber-100 text-amber-700' },
  registration_failed: { label: 'Falhou registro', color: 'bg-violet-100 text-violet-700' },
};

const TYPE_META = {
  pagsmile_charge: { label: 'Cobrança PagSmile', color: 'bg-violet-100 text-violet-700' },
  baas: { label: 'BaaS', color: 'bg-cyan-100 text-cyan-700' },
  ecommerce: { label: 'E-commerce', color: 'bg-blue-100 text-blue-700' },
};

export default function AdminIntBilletsList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [bankFilter, setBankFilter] = useState('all');
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    return mockBillets.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (typeFilter !== 'all' && b.type !== typeFilter) return false;
      if (bankFilter !== 'all' && b.bank !== bankFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.billet_id.toLowerCase().includes(q) ||
          b.our_number.toLowerCase().includes(q) ||
          b.payer.name.toLowerCase().includes(q) ||
          b.payer.document.includes(q) ||
          b.digitable_line.includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter, typeFilter, bankFilter]);

  const banks = [...new Set(mockBillets.map(b => b.bank))];

  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Boletos · Backoffice"
        subtitle="Gestão de cobranças via boleto · PagSmile, BaaS e e-commerce"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Boletos' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link to={createPageUrl('AdminIntBilletLayouts')}>
              <Button variant="outline" size="sm"><FileText className="w-3.5 h-3.5 mr-1" /> Layouts</Button>
            </Link>
            <Link to={createPageUrl('AdminIntBilletCreate')}>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700"><Plus className="w-3.5 h-3.5 mr-1" /> Novo boleto</Button>
            </Link>
          </div>
        }
      />

      <MentorBilletKPIBar kpis={mockBilletsKPIs} />

      {/* Filtros */}
      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input placeholder="Nosso número, linha digitável, pagador, CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: todos</SelectItem>
              <SelectItem value="registered">Registrados</SelectItem>
              <SelectItem value="paid">Pagos</SelectItem>
              <SelectItem value="overdue">Vencidos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
              <SelectItem value="registration_failed">Falhou registro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tipo: todos</SelectItem>
              <SelectItem value="pagsmile_charge">Cobrança PagSmile</SelectItem>
              <SelectItem value="baas">BaaS</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
            </SelectContent>
          </Select>
          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Banco: todos</SelectItem>
              {banks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 text-xs">
            <Download className="w-3 h-3 mr-1" /> Exportar
          </Button>
        </CardContent>
      </Card>

      {/* Bulk bar */}
      {selected.length > 0 && (
        <Card className="border-violet-300 bg-violet-50/50">
          <CardContent className="p-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-violet-900">{selected.length} boleto(s) selecionado(s)</span>
            <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success('Comunicação em massa enviada')}>
              <Send className="w-3 h-3 mr-1" /> Comunicar pagadores
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[11px] text-red-700 border-red-300" onClick={() => toast.success(`${selected.length} boletos cancelados`)}>
              <XCircle className="w-3 h-3 mr-1" /> Cancelar em massa
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-[11px]">
              <Download className="w-3 h-3 mr-1" /> Exportar selecionados
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabela */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 w-8"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map(b => b.billet_id) : [])} /></th>
                <th className="text-left p-2 font-bold text-slate-600">Nosso №</th>
                <th className="text-left p-2 font-bold text-slate-600">Status</th>
                <th className="text-left p-2 font-bold text-slate-600">Tipo</th>
                <th className="text-left p-2 font-bold text-slate-600">Pagador</th>
                <th className="text-left p-2 font-bold text-slate-600">Beneficiário</th>
                <th className="text-right p-2 font-bold text-slate-600">Valor</th>
                <th className="text-left p-2 font-bold text-slate-600">Vencimento</th>
                <th className="text-left p-2 font-bold text-slate-600">Banco</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const meta = STATUS_META[b.status];
                const typeMeta = TYPE_META[b.type];
                const due = new Date(b.due_date);
                const daysLeft = Math.ceil((due - new Date('2026-05-09')) / (1000 * 60 * 60 * 24));
                const isUrgent = b.status === 'registered' && daysLeft >= 0 && daysLeft <= 3;
                return (
                  <tr key={b.billet_id} className={cn('border-b last:border-0 hover:bg-violet-50/30', selected.includes(b.billet_id) && 'bg-violet-50')}>
                    <td className="p-2">
                      <input type="checkbox" checked={selected.includes(b.billet_id)} onChange={() => toggle(b.billet_id)} />
                    </td>
                    <td className="p-2"><code className="font-mono text-[10px]">{b.our_number}</code></td>
                    <td className="p-2"><Badge className={cn('text-[10px]', meta.color)}>{meta.label}</Badge></td>
                    <td className="p-2"><Badge className={cn('text-[10px]', typeMeta.color)}>{typeMeta.label}</Badge></td>
                    <td className="p-2">
                      <p className="font-semibold text-slate-700">{b.payer.name}</p>
                      <code className="text-[10px] text-slate-500">{b.payer.document}</code>
                    </td>
                    <td className="p-2 text-slate-600 truncate max-w-[140px]" title={b.beneficiary.name}>{b.beneficiary.name}</td>
                    <td className="p-2 text-right font-bold">{fmt(b.amount)}</td>
                    <td className="p-2">
                      <span className="text-slate-600">{due.toLocaleDateString('pt-BR')}</span>
                      {isUrgent && (
                        <Badge className="ml-1 bg-amber-100 text-amber-700 text-[9px] gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" /> {daysLeft}d
                        </Badge>
                      )}
                    </td>
                    <td className="p-2 text-slate-600 text-[11px]">{b.bank} · {b.portfolio}</td>
                    <td className="p-2">
                      <Link to={createPageUrl('AdminIntBilletDetail') + `?id=${b.billet_id}`}>
                        <ExternalLink className="w-3 h-3 text-slate-400 hover:text-violet-600" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <p className="text-[11px] text-slate-500">{filtered.length} de {mockBillets.length} boletos</p>
    </div>
  );
}