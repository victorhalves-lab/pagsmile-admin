import React, { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Scale, AlertTriangle, ExternalLink, Download, Mail, FileText, Search, Building2 } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, EFFECT_TYPES, formatCurrency } from '@/components/regulatory/mocks/urMock';
import { toast } from 'sonner';

export default function AdminIntJudicialBlockages() {
  const [search, setSearch] = useState('');

  const judicialEffects = useMemo(() => {
    return MOCK_EFFECTS.filter((e) =>
      (e.type === 'judicial_lien' || e.type === 'attachment') &&
      (search === '' ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.counterparty?.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.ur?.merchant?.name?.toLowerCase().includes(search.toLowerCase()) ||
        (e.process_ref || '').includes(search))
    );
  }, [search]);

  const groupedByProcess = useMemo(() => {
    const map = {};
    judicialEffects.forEach((e) => {
      const key = e.process_ref || e.counterparty?.name || 'sem_processo';
      if (!map[key]) {
        map[key] = {
          process: e.process_ref,
          court: e.counterparty?.name,
          effects: [],
          total_value: 0,
        };
      }
      map[key].effects.push(e);
      map[key].total_value += e.value_affected;
    });
    return Object.values(map).sort((a, b) => b.total_value - a.total_value);
  }, [judicialEffects]);

  const totalValue = judicialEffects.reduce((s, e) => s + e.value_affected, 0);
  const activeCount = judicialEffects.filter((e) => e.status === 'active').length;
  const merchantsAffected = new Set(judicialEffects.map((e) => e.ur?.merchant?.id)).size;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bloqueios Judiciais"
        subtitle="Vista jurídica de oneraçãos e penhoras sobre URs"
        icon={Scale}
        breadcrumbs={[
          { label: 'Jurídico' },
          { label: 'Bloqueios Judiciais' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Relatório jurídico exportado')}>
              <Download className="w-4 h-4 mr-2" /> Relatório jurídico
            </Button>
            <Button variant="outline" onClick={() => toast.success('Comunicação dirigida à autoridade judicial enviada')}>
              <Mail className="w-4 h-4 mr-2" /> Comunicar autoridade
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-red-200 bg-red-50/40"><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Total ativos</p>
          <p className="text-2xl font-black text-red-700">{activeCount}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Valor afetado</p>
          <p className="text-2xl font-black">{formatCurrency(totalValue)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Lojistas impactados</p>
          <p className="text-2xl font-black">{merchantsAffected}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Processos distintos</p>
          <p className="text-2xl font-black">{groupedByProcess.length}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Buscar por ID, processo, autoridade judicial, lojista…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="by_process">
        <TabsList>
          <TabsTrigger value="by_process" className="text-xs"><Scale className="w-3 h-3 mr-1" />Por processo</TabsTrigger>
          <TabsTrigger value="by_merchant" className="text-xs"><Building2 className="w-3 h-3 mr-1" />Por lojista</TabsTrigger>
          <TabsTrigger value="all" className="text-xs">Lista completa</TabsTrigger>
        </TabsList>

        <TabsContent value="by_process" className="mt-4 space-y-2">
          {groupedByProcess.map((g, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-sm font-mono">{g.process || 'Sem processo informado'}</CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">{g.court}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-700">{formatCurrency(g.total_value)}</p>
                    <p className="text-[10px] text-slate-500">{g.effects.length} bloqueio(s)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {g.effects.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-2 border rounded text-xs">
                    <div className="flex items-center gap-2">
                      <span>{EFFECT_TYPES[e.type]?.icon}</span>
                      <Badge className={`${EFFECT_TYPES[e.type]?.color} text-[9px]`}>{EFFECT_TYPES[e.type]?.label}</Badge>
                      <span className="font-mono text-[10px]">{e.id}</span>
                      <span className="text-[10px]">UR: {e.ur_id}</span>
                      <span className="text-[10px]">· {e.ur?.merchant?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600">{formatCurrency(e.value_affected)}</span>
                      <Link to={`${createPageUrl('AdminIntContractEffectDetail360')}?id=${e.id}`}>
                        <Button size="sm" variant="outline" className="h-6 text-[9px]"><ExternalLink className="w-2.5 h-2.5" /></Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="by_merchant" className="mt-4">
          <Card>
            <CardContent className="p-3 space-y-2">
              {Object.entries(judicialEffects.reduce((acc, e) => {
                const mid = e.ur?.merchant?.id || 'unknown';
                if (!acc[mid]) acc[mid] = { merchant: e.ur?.merchant, count: 0, value: 0, effects: [] };
                acc[mid].count += 1;
                acc[mid].value += e.value_affected;
                acc[mid].effects.push(e);
                return acc;
              }, {})).sort((a, b) => b[1].value - a[1].value).map(([mid, data]) => (
                <div key={mid} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="text-sm font-bold">{data.merchant?.name}</p>
                    <p className="text-[10px] text-slate-500">{data.merchant?.cnpj} · {data.count} bloqueio(s)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-bold text-red-700">{formatCurrency(data.value)}</p>
                    <Link to={`${createPageUrl('AdminIntMerchantProfile')}?id=${mid}`}>
                      <Button size="sm" variant="outline">Ficha lojista</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Tipo</th>
                    <th className="text-left p-2">Processo</th>
                    <th className="text-left p-2">Autoridade</th>
                    <th className="text-left p-2">Lojista</th>
                    <th className="text-left p-2">UR</th>
                    <th className="text-right p-2">Valor</th>
                    <th className="text-left p-2">Aplicação</th>
                    <th className="text-right p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {judicialEffects.map((e) => (
                    <tr key={e.id} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-mono text-[10px]">{e.id}</td>
                      <td className="p-2"><Badge className={`${EFFECT_TYPES[e.type]?.color} text-[9px]`}>{EFFECT_TYPES[e.type]?.label}</Badge></td>
                      <td className="p-2 font-mono text-[10px]">{e.process_ref || '—'}</td>
                      <td className="p-2 text-[11px]">{e.counterparty?.name}</td>
                      <td className="p-2 text-[11px]">{e.ur?.merchant?.name}</td>
                      <td className="p-2"><Link to={`${createPageUrl('AdminIntURDetail360')}?id=${e.ur_id}`} className="text-blue-600 hover:underline font-mono text-[10px]">{e.ur_id}</Link></td>
                      <td className="p-2 text-right font-bold text-red-600">{formatCurrency(e.value_affected)}</td>
                      <td className="p-2 text-[10px]">{new Date(e.application_date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-2 text-right">
                        <Link to={`${createPageUrl('AdminIntContractEffectDetail360')}?id=${e.id}`}>
                          <Button size="icon" variant="ghost" className="h-6 w-6"><ExternalLink className="w-3 h-3" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}