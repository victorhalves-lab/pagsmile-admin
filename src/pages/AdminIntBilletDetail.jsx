import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, Copy, Send, Download, XCircle, Edit, Clock, Building2, User, Banknote, CheckCircle2,
} from 'lucide-react';
import { mockBilletDetail, mockBilletHistory } from '@/components/mentor/mocks/billetsBackofficeMock';
import { toast } from 'sonner';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function AdminIntBilletDetail() {
  const b = mockBilletDetail;

  const copy = (txt) => { navigator.clipboard.writeText(txt); toast.success('Copiado'); };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title={`Boleto ${b.our_number}`}
        subtitle="Ficha completa · pagador, financeiro, configurações bancárias, histórico"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Boletos', page: 'AdminIntBilletsList' },
          { label: b.our_number },
        ]}
      />

      {/* Header */}
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50/40 to-white">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Boleto ID · Nosso №</p>
              <code className="text-base font-mono font-bold text-slate-800">{b.our_number}</code>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">{b.billet_id}</p>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <Badge className="bg-blue-100 text-blue-700">Registrado</Badge>
                <Badge variant="outline" className="text-[10px]">{b.bank} · {b.portfolio}</Badge>
              </div>
            </div>
            <div className="border-l pl-4">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Valor</p>
              <p className="text-3xl font-black text-emerald-700">{fmt(b.amount)}</p>
              <p className="text-[11px] text-slate-500 mt-1">Vencimento {new Date(b.due_date).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Linha digitável</p>
              <div className="flex items-center gap-2">
                <code className="text-[10px] font-mono text-slate-700 break-all">{b.digitable_line}</code>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => copy(b.digitable_line)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={() => toast.success('PDF baixado')}>
            <Download className="w-3 h-3 mr-1" /> Baixar PDF
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={() => toast.success('Comunicação enviada ao pagador')}>
            <Send className="w-3 h-3 mr-1" /> Reenviar ao pagador
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-[11px]">
            <Edit className="w-3 h-3 mr-1" /> Editar
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-[11px] text-red-700 border-red-300" onClick={() => toast.success('Boleto cancelado')}>
            <XCircle className="w-3 h-3 mr-1" /> Cancelar
          </Button>
        </CardContent>
      </Card>

      {/* Cards principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><User className="w-4 h-4 text-violet-600" /> Pagador</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-xs">
            <p className="font-bold">{b.payer.name}</p>
            <p className="font-mono text-slate-600">{b.payer.document}</p>
            {b.payer.email && <p className="text-slate-600">{b.payer.email}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-violet-600" /> Beneficiário</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-xs">
            <p className="font-bold">{b.beneficiary.name}</p>
            <p className="font-mono text-slate-600">{b.beneficiary.document}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Banknote className="w-4 h-4 text-violet-600" /> Bancário</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-xs">
            <p>Banco: <strong>{b.bank}</strong> ({b.bank_code})</p>
            <p>Carteira: <strong>{b.portfolio}</strong></p>
            <p>Tipo: <Badge variant="outline" className="text-[10px]">Cobrança PagSmile</Badge></p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial">
        <TabsList>
          <TabsTrigger value="financial">Configuração financeira</TabsTrigger>
          <TabsTrigger value="instructions">Instruções</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 rounded p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Valor</p>
                  <p className="text-lg font-black text-emerald-700">{fmt(b.amount)}</p>
                </div>
                <div className="bg-amber-50 rounded p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Juros pós-vencto</p>
                  <p className="text-lg font-black text-amber-700">{b.fees}% / mês</p>
                </div>
                <div className="bg-red-50 rounded p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Multa</p>
                  <p className="text-lg font-black text-red-700">{b.penalty}%</p>
                </div>
                <div className="bg-emerald-50 rounded p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Desconto antecipação</p>
                  <p className="text-lg font-black text-emerald-700">{b.discount ? `${fmt(b.discount.value)}` : '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions">
          <Card>
            <CardContent className="p-4">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Instruções ao pagador (impressas no boleto)</p>
              <p className="text-sm text-slate-700 italic">"{b.instructions}"</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-violet-600" /> Histórico</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockBilletHistory.map((h, i) => (
                  <div key={i} className="flex gap-2 text-xs items-start border-l-2 border-violet-300 pl-3 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-slate-700">{h.event}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{new Date(h.timestamp).toLocaleString('pt-BR')} · {h.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}