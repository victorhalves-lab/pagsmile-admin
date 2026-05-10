import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitCompare, FileCheck2, AlertCircle, TrendingUp, Download, Eye, Sparkles } from 'lucide-react';
import { myReconciliationKpis, myReconciliationFiles, myDivergences, formatCurrency } from '@/components/my-value/mocks/myValueMock';

const SEVERITY_CFG = {
  low: { label: 'Baixa', color: 'bg-slate-100 text-slate-700' },
  medium: { label: 'Média', color: 'bg-amber-100 text-amber-700' },
  high: { label: 'Alta', color: 'bg-red-100 text-red-700' }
};

const STATUS_CFG = {
  open: { label: 'Aberta', color: 'bg-amber-100 text-amber-700' },
  investigating: { label: 'Em análise', color: 'bg-blue-100 text-blue-700' },
  resolved: { label: 'Resolvida', color: 'bg-emerald-100 text-emerald-700' }
};

const DIV_TYPE_CFG = {
  value_mismatch: 'Divergência de valor',
  fee_mismatch: 'Divergência de taxa',
  missing_settlement: 'Liquidação ausente',
  date_mismatch: 'Divergência de data'
};

export default function MyReconciliationCenter() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Centro de Conciliação — Cada centavo conferido"
        subtitle="Conciliação automática entre seus pedidos e arquivos das adquirentes"
        icon={GitCompare}
        breadcrumbs={[{ label: 'Financeiro', page: '#' }, { label: 'Conciliação' }]}
        actions={
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Relatório</Button>
        }
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">
              {myReconciliationKpis.conciliation_rate}% das suas transações estão conciliadas automaticamente
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              Recuperamos <strong>{formatCurrency(myReconciliationKpis.recovered_30d)}</strong> em divergências resolvidas nos últimos 30 dias. Você só precisa revisar <strong>{myReconciliationKpis.divergent} casos críticos</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MyKpiCard label="TAXA DE CONCILIAÇÃO" value={`${myReconciliationKpis.conciliation_rate}%`} sub="últimos 30d" icon={FileCheck2} accent="emerald" />
        <MyKpiCard label="TRANSAÇÕES" value={(myReconciliationKpis.total_transactions_30d / 1000).toFixed(1) + 'k'} sub="processadas" accent="slate" />
        <MyKpiCard label="CONCILIADAS" value={(myReconciliationKpis.conciliated / 1000).toFixed(1) + 'k'} sub="OK" accent="emerald" />
        <MyKpiCard label="EM REVISÃO" value={myReconciliationKpis.pending_review} sub="manual" icon={Eye} accent="amber" warn />
        <MyKpiCard label="DIVERGENTES" value={myReconciliationKpis.divergent} sub="ativas" icon={AlertCircle} accent="red" />
        <MyKpiCard label="$ DIVERGENTE" value={formatCurrency(myReconciliationKpis.total_divergent_brl).slice(0, 12)} sub="em análise" accent="amber" />
        <MyKpiCard label="$ RECUPERADO" value={formatCurrency(myReconciliationKpis.recovered_30d).slice(0, 12)} sub="30d" icon={TrendingUp} accent="emerald" />
      </div>

      <Tabs defaultValue="files">
        <TabsList>
          <TabsTrigger value="files">Arquivos Recebidos</TabsTrigger>
          <TabsTrigger value="divergences">Divergências ({myDivergences.length})</TabsTrigger>
          <TabsTrigger value="how">Como funciona</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Adquirente</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead className="text-right">Registros</TableHead>
                    <TableHead className="text-right">Conciliados</TableHead>
                    <TableHead className="text-right">Divergentes</TableHead>
                    <TableHead className="text-right">$ Divergente</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myReconciliationFiles.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-mono text-xs">{f.date}</TableCell>
                      <TableCell className="font-semibold">{f.acquirer}</TableCell>
                      <TableCell className="font-mono text-xs">{f.file_name}</TableCell>
                      <TableCell className="text-right">{f.records.toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-semibold">{f.conciliated.toLocaleString('pt-BR')}</TableCell>
                      <TableCell className="text-right text-red-600 font-semibold">{f.divergent}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(f.divergent_brl)}</TableCell>
                      <TableCell>
                        <Badge className={f.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {f.status === 'completed' ? 'Completo' : 'Em revisão'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divergences" className="mt-6 space-y-3">
          {myDivergences.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm">{d.transaction_id}</span>
                      <Badge variant="outline">{d.acquirer}</Badge>
                      <Badge className={SEVERITY_CFG[d.severity].color}>{SEVERITY_CFG[d.severity].label}</Badge>
                      <Badge className={STATUS_CFG[d.status].color}>{STATUS_CFG[d.status].label}</Badge>
                    </div>
                    <div className="text-sm text-slate-700 mt-2">
                      <strong>{DIV_TYPE_CFG[d.type]}</strong> em {d.date}
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Esperado</div>
                        <div className="font-mono">{formatCurrency(d.expected)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Recebido</div>
                        <div className="font-mono">{d.received !== null ? formatCurrency(d.received) : '— ausente —'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Diferença</div>
                        <div className={`font-mono font-bold ${d.difference < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {formatCurrency(d.difference)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Ver detalhes</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="how" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-slate-900">Como funciona a conciliação automática?</h3>
              <ol className="space-y-3 text-sm text-slate-700">
                <li><strong>1. Recebimento:</strong> Diariamente recebemos arquivos de detalhamento de cada adquirente (EEVD/Cielo, EDI/Stone, etc.)</li>
                <li><strong>2. Casamento:</strong> Cada transação no arquivo é cruzada automaticamente com seu pedido na PagSmile via NSU + Autorização + Valor.</li>
                <li><strong>3. Validação:</strong> Verificamos valor bruto, MDR aplicado, parcelas e data de liquidação.</li>
                <li><strong>4. Alertas:</strong> Divergências acima de 1% ou liquidações ausentes geram alertas para revisão.</li>
                <li><strong>5. Resolução:</strong> Você pode contestar diretamente pela plataforma. Casos resolvidos retornam o valor à sua conta.</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}