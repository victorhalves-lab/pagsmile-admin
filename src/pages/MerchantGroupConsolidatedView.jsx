import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, TrendingUp, BarChart3, Filter, Download } from 'lucide-react';

/**
 * Visão consolidada de filiais — apenas para usuário com perfil de admin de grupo.
 * Útil para varejo multi-loja (farmácias, fast-food).
 */
const filiais = [
  { id: '12345', name: 'Centro', city: 'São Paulo', tpv_30d: 1240000, change_pct: 12, ticket: 89, approval: 96.2 },
  { id: '12346', name: 'Vila Mariana', city: 'São Paulo', tpv_30d: 890000, change_pct: 8, ticket: 95, approval: 95.1 },
  { id: '12347', name: 'Pinheiros', city: 'São Paulo', tpv_30d: 1050000, change_pct: 15, ticket: 102, approval: 96.8 },
  { id: '12348', name: 'Moema', city: 'São Paulo', tpv_30d: 720000, change_pct: -3, ticket: 88, approval: 94.5 },
  { id: '12349', name: 'Campinas', city: 'Campinas', tpv_30d: 540000, change_pct: -8, ticket: 78, approval: 93.2 },
  { id: '12350', name: 'Rio Centro', city: 'Rio de Janeiro', tpv_30d: 670000, change_pct: 22, ticket: 92, approval: 95.5 },
];

export default function MerchantGroupConsolidatedView() {
  const totalTpv = filiais.reduce((s, f) => s + f.tpv_30d, 0);
  const avgChange = filiais.reduce((s, f) => s + f.change_pct, 0) / filiais.length;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Visão Consolidada do Grupo"
        subtitle="Métricas agregadas de todas as filiais"
        icon={Building}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filtros</Button>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><p className="text-[10px] uppercase font-bold text-slate-500">Filiais</p><p className="text-3xl font-black mt-1">{filiais.length}</p></Card>
        <Card className="p-4"><p className="text-[10px] uppercase font-bold text-slate-500">TPV agregado 30d</p><p className="text-2xl font-black mt-1">R$ {(totalTpv / 1000000).toFixed(2)}M</p></Card>
        <Card className="p-4"><p className="text-[10px] uppercase font-bold text-slate-500">Variação média</p><p className={`text-2xl font-black mt-1 ${avgChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%</p></Card>
        <Card className="p-4"><p className="text-[10px] uppercase font-bold text-slate-500">Cidades</p><p className="text-3xl font-black mt-1 flex items-center gap-1"><MapPin className="w-5 h-5" />3</p></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Comparativo de filiais</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-2">Filial</th>
                  <th className="text-left p-2">Cidade</th>
                  <th className="text-right p-2">TPV 30d</th>
                  <th className="text-right p-2">Variação</th>
                  <th className="text-right p-2">Ticket médio</th>
                  <th className="text-right p-2">Aprovação</th>
                </tr>
              </thead>
              <tbody>
                {filiais.map(f => (
                  <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-2 font-bold">{f.name}</td>
                    <td className="p-2 text-slate-600">{f.city}</td>
                    <td className="p-2 text-right font-mono">R$ {(f.tpv_30d / 1000).toFixed(0)}k</td>
                    <td className="p-2 text-right">
                      <Badge className={f.change_pct >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                        {f.change_pct >= 0 ? '+' : ''}{f.change_pct}%
                      </Badge>
                    </td>
                    <td className="p-2 text-right font-mono">R$ {f.ticket}</td>
                    <td className="p-2 text-right font-mono">{f.approval}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}