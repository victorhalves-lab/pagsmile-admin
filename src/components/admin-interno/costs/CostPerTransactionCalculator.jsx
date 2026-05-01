import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Users, Server, Megaphone, Briefcase, Calculator, TrendingDown, Info } from 'lucide-react';

const formatBRL = (n) => `R$ ${(n || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatNum = (n) => (n || 0).toLocaleString('pt-BR');

const initialPeople = [
  { id: 1, role: 'Engenharia (Sênior)', headcount: 8, monthlyCost: 22000 },
  { id: 2, role: 'Engenharia (Pleno)', headcount: 12, monthlyCost: 14000 },
  { id: 3, role: 'Produto/Design', headcount: 4, monthlyCost: 16000 },
  { id: 4, role: 'Comercial', headcount: 6, monthlyCost: 12000 },
  { id: 5, role: 'Suporte/Ops', headcount: 10, monthlyCost: 6500 },
  { id: 6, role: 'Compliance/Risco', headcount: 5, monthlyCost: 11000 },
  { id: 7, role: 'Backoffice/Financeiro', headcount: 4, monthlyCost: 8000 },
  { id: 8, role: 'Liderança/C-level', headcount: 3, monthlyCost: 35000 },
];

const initialOverhead = [
  { id: 1, category: 'Cloud / Infra (AWS/GCP)', monthlyCost: 85000 },
  { id: 2, category: 'Software & SaaS (BI, monitoramento, etc.)', monthlyCost: 25000 },
  { id: 3, category: 'Aluguel / Escritório', monthlyCost: 35000 },
  { id: 4, category: 'Marketing & Aquisição', monthlyCost: 60000 },
  { id: 5, category: 'Jurídico & Auditoria', monthlyCost: 18000 },
  { id: 6, category: 'Impostos sobre folha (encargos)', monthlyCost: 220000 },
  { id: 7, category: 'Outros (viagens, treinamentos)', monthlyCost: 15000 },
];

export default function CostPerTransactionCalculator({ editing }) {
  const [people, setPeople] = useState(initialPeople);
  const [overhead, setOverhead] = useState(initialOverhead);
  const [volumes, setVolumes] = useState({
    card: 4_500_000,
    pix: 8_200_000,
    boleto: 350_000,
  });

  // ── Cálculos ───────────────────────────────────────────────
  const peopleTotal = useMemo(
    () => people.reduce((acc, p) => acc + (p.headcount || 0) * (p.monthlyCost || 0), 0),
    [people]
  );
  const headcountTotal = useMemo(
    () => people.reduce((acc, p) => acc + (p.headcount || 0), 0),
    [people]
  );
  const overheadTotal = useMemo(
    () => overhead.reduce((acc, o) => acc + (o.monthlyCost || 0), 0),
    [overhead]
  );
  const totalFixedCost = peopleTotal + overheadTotal;

  const totalVolume = (volumes.card || 0) + (volumes.pix || 0) + (volumes.boleto || 0);
  const avgCostPerTx = totalVolume > 0 ? totalFixedCost / totalVolume : 0;

  // Distribuição (peso por método)
  const distribution = useMemo(() => {
    if (totalVolume === 0) return { card: 0, pix: 0, boleto: 0 };
    return {
      card: (volumes.card / totalVolume) * 100,
      pix: (volumes.pix / totalVolume) * 100,
      boleto: (volumes.boleto / totalVolume) * 100,
    };
  }, [volumes, totalVolume]);

  // ── Handlers ───────────────────────────────────────────────
  const updatePerson = (id, field, value) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: Number(value) || 0 } : p)));
  };
  const removePerson = (id) => setPeople((prev) => prev.filter((p) => p.id !== id));
  const addPerson = () =>
    setPeople((prev) => [...prev, { id: Date.now(), role: 'Nova função', headcount: 1, monthlyCost: 10000 }]);

  const updateOverhead = (id, field, value) => {
    setOverhead((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: field === 'monthlyCost' ? (Number(value) || 0) : value } : o)));
  };
  const removeOverhead = (id) => setOverhead((prev) => prev.filter((o) => o.id !== id));
  const addOverhead = () =>
    setOverhead((prev) => [...prev, { id: Date.now(), category: 'Nova categoria', monthlyCost: 0 }]);

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              Calculadora de Custo Médio por Transação
            </CardTitle>
            <CardDescription className="mt-1">
              Some todos os custos fixos da empresa (pessoas + overhead) e divida pelo volume total de transações para obter o <strong>custo fixo rateado por transação</strong>. Esse valor é somado ao custo variável (parceiros) na visão de rentabilidade.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* ── Resumo do cálculo ───────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <SummaryCard
            label="Custo Pessoas / mês"
            value={formatBRL(peopleTotal)}
            sub={`${headcountTotal} pessoas`}
            icon={<Users className="w-4 h-4" />}
            color="blue"
          />
          <SummaryCard
            label="Overhead / mês"
            value={formatBRL(overheadTotal)}
            sub="Infra, marketing, etc."
            icon={<Server className="w-4 h-4" />}
            color="orange"
          />
          <SummaryCard
            label="Custo Fixo Total / mês"
            value={formatBRL(totalFixedCost)}
            sub="Pessoas + Overhead"
            icon={<Briefcase className="w-4 h-4" />}
            color="slate"
          />
          <SummaryCard
            label="Volume Total / mês"
            value={formatNum(totalVolume)}
            sub="transações"
            icon={<TrendingDown className="w-4 h-4" />}
            color="emerald"
          />
          <SummaryCard
            label="Custo Médio / Tx"
            value={formatBRL(avgCostPerTx)}
            sub="Custo fixo rateado"
            icon={<Calculator className="w-4 h-4" />}
            color="purple"
            highlight
          />
        </div>

        {/* ── Fórmula explicativa ─────────────────────────── */}
        <Alert className="bg-purple-50 border-purple-200">
          <Info className="h-4 w-4 text-purple-600" />
          <AlertTitle className="text-purple-900">Fórmula aplicada</AlertTitle>
          <AlertDescription className="text-purple-800 font-mono text-xs">
            Custo Médio/Tx = ({formatBRL(peopleTotal)} + {formatBRL(overheadTotal)}) ÷ {formatNum(totalVolume)} tx ={' '}
            <strong className="text-purple-900">{formatBRL(avgCostPerTx)}</strong>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="people">
          <TabsList>
            <TabsTrigger value="people"><Users className="w-3.5 h-3.5 mr-1" />Custo de Pessoas</TabsTrigger>
            <TabsTrigger value="overhead"><Server className="w-3.5 h-3.5 mr-1" />Overhead da Empresa</TabsTrigger>
            <TabsTrigger value="volume"><TrendingDown className="w-3.5 h-3.5 mr-1" />Volume de Transações</TabsTrigger>
          </TabsList>

          {/* ── Pessoas ─────────────────────────────────── */}
          <TabsContent value="people" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Custo total = headcount × custo unitário mensal (já com encargos rateados em "Overhead").
              </p>
              {editing && (
                <Button size="sm" variant="outline" onClick={addPerson}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar função
                </Button>
              )}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs">
                  <tr>
                    <th className="text-left p-2 font-medium">Função / Cargo</th>
                    <th className="text-right p-2 font-medium w-24">Headcount</th>
                    <th className="text-right p-2 font-medium w-40">Custo Unit. (R$/mês)</th>
                    <th className="text-right p-2 font-medium w-40">Subtotal</th>
                    {editing && <th className="w-12"></th>}
                  </tr>
                </thead>
                <tbody>
                  {people.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">
                        {editing ? (
                          <Input
                            value={p.role}
                            onChange={(e) => setPeople((prev) => prev.map((x) => x.id === p.id ? { ...x, role: e.target.value } : x))}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{p.role}</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {editing ? (
                          <Input type="number" value={p.headcount} onChange={(e) => updatePerson(p.id, 'headcount', e.target.value)} className="h-8 text-right" />
                        ) : (
                          <span>{p.headcount}</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {editing ? (
                          <Input type="number" value={p.monthlyCost} onChange={(e) => updatePerson(p.id, 'monthlyCost', e.target.value)} className="h-8 text-right" />
                        ) : (
                          <span className="font-mono">{formatBRL(p.monthlyCost)}</span>
                        )}
                      </td>
                      <td className="p-2 text-right font-mono font-semibold text-slate-700">
                        {formatBRL(p.headcount * p.monthlyCost)}
                      </td>
                      {editing && (
                        <td className="p-2 text-right">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removePerson(p.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold">
                  <tr>
                    <td className="p-2">Total Pessoas</td>
                    <td className="p-2 text-right">{headcountTotal}</td>
                    <td className="p-2"></td>
                    <td className="p-2 text-right font-mono text-blue-700">{formatBRL(peopleTotal)}</td>
                    {editing && <td></td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>

          {/* ── Overhead ────────────────────────────────── */}
          <TabsContent value="overhead" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Custos fixos não-pessoa (infra, software, marketing, jurídico, encargos sobre folha, etc.).</p>
              {editing && (
                <Button size="sm" variant="outline" onClick={addOverhead}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar categoria
                </Button>
              )}
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs">
                  <tr>
                    <th className="text-left p-2 font-medium">Categoria</th>
                    <th className="text-right p-2 font-medium w-48">Custo / mês</th>
                    {editing && <th className="w-12"></th>}
                  </tr>
                </thead>
                <tbody>
                  {overhead.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="p-2">
                        {editing ? (
                          <Input value={o.category} onChange={(e) => updateOverhead(o.id, 'category', e.target.value)} className="h-8" />
                        ) : (
                          <span className="font-medium">{o.category}</span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        {editing ? (
                          <Input type="number" value={o.monthlyCost} onChange={(e) => updateOverhead(o.id, 'monthlyCost', e.target.value)} className="h-8 text-right" />
                        ) : (
                          <span className="font-mono">{formatBRL(o.monthlyCost)}</span>
                        )}
                      </td>
                      {editing && (
                        <td className="p-2 text-right">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeOverhead(o.id)}>
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold">
                  <tr>
                    <td className="p-2">Total Overhead</td>
                    <td className="p-2 text-right font-mono text-orange-700">{formatBRL(overheadTotal)}</td>
                    {editing && <td></td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>

          {/* ── Volume ──────────────────────────────────── */}
          <TabsContent value="volume" className="mt-4 space-y-4">
            <p className="text-xs text-slate-500">Volume mensal de transações por método (referência: últimos 30 dias).</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <VolumeInput editing={editing} label="Cartão (transações/mês)" value={volumes.card} onChange={(v) => setVolumes({ ...volumes, card: v })} share={distribution.card} />
              <VolumeInput editing={editing} label="PIX (transações/mês)" value={volumes.pix} onChange={(v) => setVolumes({ ...volumes, pix: v })} share={distribution.pix} />
              <VolumeInput editing={editing} label="Boleto (transações/mês)" value={volumes.boleto} onChange={(v) => setVolumes({ ...volumes, boleto: v })} share={distribution.boleto} />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-700 font-semibold">Volume total consolidado</p>
                  <p className="text-2xl font-bold text-emerald-900 font-mono">{formatNum(totalVolume)} tx/mês</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-700 font-semibold">Custo fixo rateado</p>
                  <p className="text-2xl font-bold text-emerald-900 font-mono">{formatBRL(avgCostPerTx)}</p>
                  <p className="text-[10px] text-emerald-600">por transação</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ── helpers ───────────────────────────────────────────────────
function SummaryCard({ label, value, sub, icon, color, highlight }) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    purple: 'bg-purple-50 border-purple-300 text-purple-700',
  };
  return (
    <div className={`p-3 rounded-lg border ${colorMap[color]} ${highlight ? 'ring-2 ring-purple-400 shadow-md' : ''}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-[10px] font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-lg font-bold font-mono">{value}</p>
      <p className="text-[10px] opacity-70">{sub}</p>
    </div>
  );
}

function VolumeInput({ editing, label, value, onChange, share }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {editing ? (
        <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="h-9" />
      ) : (
        <div className="h-9 flex items-center px-3 bg-slate-50 rounded-md border border-slate-200 font-mono text-sm">
          {(value || 0).toLocaleString('pt-BR')}
        </div>
      )}
      <Badge variant="outline" className="text-[10px]">{share.toFixed(1)}% do volume</Badge>
    </div>
  );
}