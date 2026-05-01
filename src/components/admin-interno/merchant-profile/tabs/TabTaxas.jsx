import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Edit, Save, X, History, CreditCard, QrCode, Receipt, ShieldAlert,
  AlertTriangle, Info, Percent, Lock, TrendingUp, Clock, Banknote,
  ChevronDown, ChevronUp, Calculator
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ── Mock MCC cost base data ───────────────────────────────────────────
const mccCostDatabase = {
  '5411': { label: '5411 - Supermercados', costs: { vista: 1.20, '2_6': 1.50, '7_12': 1.80, '13_21': 2.10, debit: 0.80, pix_pct: 0.30, boleto: 2.50, antifraud: 0.05, pre_cb: 3.00, cb_penalty: 15.00, anticipation: 1.20 }},
  '5651': { label: '5651 - Varejo de Roupas', costs: { vista: 1.60, '2_6': 1.90, '7_12': 2.20, '13_21': 2.50, debit: 1.10, pix_pct: 0.35, boleto: 2.80, antifraud: 0.08, pre_cb: 4.00, cb_penalty: 18.00, anticipation: 1.30 }},
  '5732': { label: '5732 - Eletrônicos', costs: { vista: 1.80, '2_6': 2.10, '7_12': 2.50, '13_21': 2.80, debit: 1.30, pix_pct: 0.40, boleto: 3.00, antifraud: 0.12, pre_cb: 5.00, cb_penalty: 25.00, anticipation: 1.50 }},
  '5734': { label: '5734 - Software/SaaS', costs: { vista: 1.40, '2_6': 1.70, '7_12': 2.00, '13_21': 2.30, debit: 0.90, pix_pct: 0.25, boleto: 2.50, antifraud: 0.06, pre_cb: 3.50, cb_penalty: 15.00, anticipation: 1.10 }},
  '5812': { label: '5812 - Restaurantes', costs: { vista: 1.50, '2_6': 1.80, '7_12': 2.10, '13_21': 2.40, debit: 1.00, pix_pct: 0.30, boleto: 2.80, antifraud: 0.07, pre_cb: 3.50, cb_penalty: 16.00, anticipation: 1.25 }},
  '5969': { label: '5969 - Marketing Direto', costs: { vista: 2.20, '2_6': 2.60, '7_12': 3.00, '13_21': 3.40, debit: 1.60, pix_pct: 0.50, boleto: 3.50, antifraud: 0.18, pre_cb: 8.00, cb_penalty: 35.00, anticipation: 1.80 }},
  '5999': { label: '5999 - Varejo Diversos', costs: { vista: 1.70, '2_6': 2.00, '7_12': 2.30, '13_21': 2.60, debit: 1.20, pix_pct: 0.35, boleto: 3.00, antifraud: 0.10, pre_cb: 4.50, cb_penalty: 20.00, anticipation: 1.40 }},
};

const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];

const rateHistory = [
  { date: '01/01/2026', change: 'Visa 1x: 3,49% → 2,99%', user: 'Carlos S.', negotiation: '#NEG-2024-892' },
  { date: '01/01/2026', change: 'PIX: 1,29% → 0,99%', user: 'Carlos S.', negotiation: '#NEG-2024-892' },
  { date: '15/06/2025', change: 'Plano: Basic → Premium', user: 'Maria R.', negotiation: '#NEG-2024-456' },
  { date: '01/03/2024', change: 'Taxas iniciais (onboarding)', user: 'Sistema', negotiation: '-' },
];

// Helper component for editable rate cell
function RateCell({ value, editing, onChange, costBase, suffix = '%' }) {
  const numVal = parseFloat(value) || 0;
  const belowCost = costBase !== undefined && numVal < costBase;

  if (!editing) {
    return (
      <div className="text-center">
        <span className={cn("font-medium", belowCost && "text-red-600")}>{numVal.toFixed(2)}{suffix}</span>
        {belowCost && <AlertTriangle className="w-3 h-3 text-red-500 inline ml-1" />}
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-8 text-center text-xs w-20", belowCost && "border-red-400 bg-red-50")}
      />
      {costBase !== undefined && (
        <p className="text-[10px] text-slate-400 mt-0.5 text-center">min: {costBase.toFixed(2)}</p>
      )}
    </div>
  );
}

export default function TabTaxas({ merchant }) {
  const [editing, setEditing] = useState(false);
  const [selectedMcc, setSelectedMcc] = useState(merchant.mcc || '5651');
  const [mccEnabled, setMccEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // ── Rate state ──────────────────────────────────────────────────────
  const [rates, setRates] = useState({
    // MDR Crédito por faixa (flat, applied to all brands equally for simplicity)
    vista: 2.99, '2_6': 3.49, '7_12': 3.99, '13_21': 4.49,
    // Débito
    debit: 1.99,
    // Taxa fixa por transação cartão
    fi_card: 0.00,
    // PIX
    pix_type: 'percent', // 'percent' or 'fixed'
    pix_percent: 0.99,
    pix_fixed: 0.00,
    // Boleto
    boleto_fee: 2.50,
    // Gateway (cobrada por transação processada)
    gateway_fee_approved: 0.49,
    gateway_fee_refused: 0.00,
    // 3DS (autenticação)
    threeds_fee: 0.30,
    threeds_charge_only_authenticated: true,
    // Antifraude Cartão
    antifraud_fee: 0.15,
    // Antifraude PIX
    antifraud_pix_fee: 0.08,
    // Pré-chargeback
    pre_cb_fee: 8.00,
    // Multa por chargeback
    cb_penalty: 30.00,
    // Retenção PIX
    pix_retention_pct: 5.0,
    pix_retention_days: 30,
    // Retenção Cartão
    card_retention_pct: 10.0,
    card_retention_days: 60,
    // Antecipação
    anticipation_rate: 1.89,
    // Prazo de recebimento (D+N)
    receivables_days: 30,
  });

  const mccCosts = mccCostDatabase[selectedMcc]?.costs;

  // ── Anticipation table calculation (duration model) ─────────────────
  const anticipationTable = useMemo(() => {
    const rows = [];
    const baseRate = rates.anticipation_rate;
    const daysToReceive = rates.receivables_days;
    for (let i = 1; i <= 21; i++) {
      // Each installment i is paid D+30*i by the card brand
      // The merchant receives in D+receivables_days
      // Duration = days anticipated = 30*i - receivables_days (simplified)
      const daysAnticipated = Math.max(0, 30 * i - daysToReceive);
      const effectiveRate = (baseRate / 30) * daysAnticipated;
      rows.push({
        installment: i,
        daysAnticipated,
        effectiveRate: effectiveRate,
      });
    }
    return rows;
  }, [rates.anticipation_rate, rates.receivables_days]);

  const handleRateChange = (field, value) => {
    setRates(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    // Check below-cost warnings
    if (mccEnabled && mccCosts) {
      const belowCost = [];
      if (rates.vista < mccCosts.vista) belowCost.push('MDR à Vista');
      if (rates['2_6'] < mccCosts['2_6']) belowCost.push('MDR 2-6x');
      if (rates['7_12'] < mccCosts['7_12']) belowCost.push('MDR 7-12x');
      if (rates.debit < mccCosts.debit) belowCost.push('Débito');
      if (belowCost.length > 0) {
        toast.warning(`Atenção: ${belowCost.join(', ')} estão abaixo do custo base do MCC.`);
      }
    }
    toast.success('Taxas salvas com sucesso! (simulação)');
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset would go here in a real scenario
  };

  const handleLoadMccDefaults = () => {
    if (!mccCosts) return;
    setRates(prev => ({
      ...prev,
      vista: mccCosts.vista + 1.00,
      '2_6': mccCosts['2_6'] + 1.00,
      '7_12': mccCosts['7_12'] + 1.00,
      '13_21': mccCosts['13_21'] + 1.00,
      debit: mccCosts.debit + 0.80,
      pix_percent: mccCosts.pix_pct + 0.50,
      boleto_fee: mccCosts.boleto + 0.50,
      antifraud_fee: mccCosts.antifraud + 0.05,
      pre_cb_fee: mccCosts.pre_cb + 2.00,
      cb_penalty: mccCosts.cb_penalty + 10.00,
      anticipation_rate: mccCosts.anticipation + 0.50,
    }));
    toast.info('Taxas sugeridas carregadas com base no MCC selecionado.');
  };

  return (
    <div className="space-y-6">
      {/* ── Action Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm py-1 px-3 gap-1">
            <Clock className="w-3 h-3" /> Vigente desde: 01/01/2026
          </Badge>
          <Badge className="bg-[#2bc196]/10 text-[#2bc196] border-[#2bc196]/20 py-1 px-3">
            Plano: {merchant.plan_name || 'Premium'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <History className="w-4 h-4 mr-1" /> Histórico
          </Button>
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" /> Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" /> Salvar Taxas
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-1" /> Editar Taxas
            </Button>
          )}
        </div>
      </div>

      {/* ── MCC Cost Base (Optional) ───────────────────────────── */}
      <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              MCC - Custo Base de Referência
              <Badge variant="outline" className="text-xs">Opcional</Badge>
            </CardTitle>
            <Switch checked={mccEnabled} onCheckedChange={setMccEnabled} />
          </div>
          <CardDescription>
            Ao ativar, o sistema exibe o custo base do MCC como referência para não colocar taxas abaixo do custo.
          </CardDescription>
        </CardHeader>
        {mccEnabled && (
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <Label>MCC do Cliente</Label>
                <Select value={selectedMcc} onValueChange={setSelectedMcc}>
                  <SelectTrigger className="mt-1 bg-white dark:bg-slate-800">
                    <SelectValue placeholder="Selecione o MCC" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(mccCostDatabase).map(([code, data]) => (
                      <SelectItem key={code} value={code}>{data.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {editing && (
                <Button variant="outline" size="sm" onClick={handleLoadMccDefaults}>
                  <Calculator className="w-4 h-4 mr-1" /> Carregar Taxas Sugeridas
                </Button>
              )}
            </div>
            {mccCosts && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Custo Vista', val: mccCosts.vista },
                  { label: 'Custo 2-6x', val: mccCosts['2_6'] },
                  { label: 'Custo 7-12x', val: mccCosts['7_12'] },
                  { label: 'Custo 13-21x', val: mccCosts['13_21'] },
                  { label: 'Custo Débito', val: mccCosts.debit },
                  { label: 'Custo PIX', val: mccCosts.pix_pct },
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-blue-100 dark:border-blue-900 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{item.val.toFixed(2)}%</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── KPI Summary ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Crédito à Vista', val: `${rates.vista.toFixed(2)}%`, color: 'text-[#2bc196]' },
          { label: 'Parcelado 2-6x', val: `${rates['2_6'].toFixed(2)}%`, color: 'text-blue-600' },
          { label: 'Débito', val: `${rates.debit.toFixed(2)}%`, color: 'text-purple-600' },
          { label: 'PIX', val: rates.pix_type === 'percent' ? `${rates.pix_percent.toFixed(2)}%` : `R$ ${rates.pix_fixed.toFixed(2)}`, color: 'text-emerald-600' },
          { label: 'Antecipação', val: `${rates.anticipation_rate.toFixed(2)}% a.m.`, color: 'text-orange-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={cn("text-xl font-bold", item.color)}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* ── Cartão de Crédito - MDR ────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            MDR - Cartão de Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-3 font-semibold text-slate-600">Bandeira</th>
                  <th className="text-center py-3 px-3 font-semibold text-slate-600">À Vista</th>
                  <th className="text-center py-3 px-3 font-semibold text-slate-600">2-6x</th>
                  <th className="text-center py-3 px-3 font-semibold text-slate-600">7-12x</th>
                  <th className="text-center py-3 px-3 font-semibold text-slate-600">13-21x</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      <div className="w-8 h-5 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-slate-500">{brand.slice(0, 2).toUpperCase()}</div>
                      {brand}
                    </td>
                    {['vista', '2_6', '7_12', '13_21'].map(key => (
                      <td key={key} className="py-3 px-3">
                        <RateCell
                          value={rates[key]}
                          editing={editing}
                          onChange={(v) => handleRateChange(key, v)}
                          costBase={mccEnabled && mccCosts ? mccCosts[key === 'vista' ? 'vista' : key] : undefined}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Débito */}
          <Separator className="my-4" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-sm mb-1">Cartão de Débito</p>
              <p className="text-xs text-slate-500">Taxa única para todas as bandeiras</p>
            </div>
            <RateCell
              value={rates.debit}
              editing={editing}
              onChange={(v) => handleRateChange('debit', v)}
              costBase={mccEnabled && mccCosts ? mccCosts.debit : undefined}
            />
          </div>
          {/* FI */}
          <Separator className="my-4" />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold text-sm mb-1">FI - Taxa Fixa por Transação</p>
              <p className="text-xs text-slate-500">Cobrada por transação (crédito e débito)</p>
            </div>
            {editing ? (
              <div className="flex items-center gap-1">
                <span className="text-sm text-slate-500">R$</span>
                <Input type="number" step="0.01" value={rates.fi_card} onChange={(e) => handleRateChange('fi_card', e.target.value)} className="h-8 w-24 text-center text-xs" />
              </div>
            ) : (
              <span className="font-medium">R$ {rates.fi_card.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── PIX & Boleto ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-500" />
              Taxa PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing && (
              <div className="flex items-center gap-4">
                <Label className="text-sm">Tipo:</Label>
                <Select value={rates.pix_type} onValueChange={(v) => setRates(prev => ({ ...prev, pix_type: v }))}>
                  <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentual (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Taxa Percentual</p>
                {editing ? (
                  <Input type="number" step="0.01" value={rates.pix_percent} onChange={(e) => handleRateChange('pix_percent', e.target.value)} className="h-8 text-center" />
                ) : (
                  <p className={cn("text-xl font-bold", rates.pix_type === 'percent' ? 'text-emerald-600' : 'text-slate-400')}>
                    {rates.pix_percent.toFixed(2)}%
                  </p>
                )}
                {rates.pix_type !== 'percent' && !editing && <p className="text-[10px] text-slate-400">(inativo)</p>}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Taxa Fixa</p>
                {editing ? (
                  <Input type="number" step="0.01" value={rates.pix_fixed} onChange={(e) => handleRateChange('pix_fixed', e.target.value)} className="h-8 text-center" />
                ) : (
                  <p className={cn("text-xl font-bold", rates.pix_type === 'fixed' ? 'text-emerald-600' : 'text-slate-400')}>
                    R$ {rates.pix_fixed.toFixed(2)}
                  </p>
                )}
                {rates.pix_type !== 'fixed' && !editing && <p className="text-[10px] text-slate-400">(inativo)</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-500" />
              Taxa Boleto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Taxa por Boleto Emitido</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.boleto_fee} onChange={(e) => handleRateChange('boleto_fee', e.target.value)} className="h-8 w-32 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-amber-600">R$ {rates.boleto_fee.toFixed(2)}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Gateway (por transação processada) ─────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Banknote className="w-5 h-5 text-cyan-500" />
            Taxa de Gateway
          </CardTitle>
          <CardDescription>Cobrada por transação processada (independente de aprovação)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Gateway - Transação Aprovada</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.gateway_fee_approved} onChange={(e) => handleRateChange('gateway_fee_approved', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-cyan-700 dark:text-cyan-400">R$ {rates.gateway_fee_approved.toFixed(2)}</p>
              )}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Gateway - Transação Recusada</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.gateway_fee_refused} onChange={(e) => handleRateChange('gateway_fee_refused', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">R$ {rates.gateway_fee_refused.toFixed(2)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 3DS & Antifraude ───────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-500" />
            Autenticação 3DS & Antifraude
          </CardTitle>
          <CardDescription>Taxas de proteção: 3D Secure (autenticação) e análise de risco</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-slate-500 mb-1">Taxa 3DS (autenticação)</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.threeds_fee} onChange={(e) => handleRateChange('threeds_fee', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">R$ {rates.threeds_fee.toFixed(2)}</p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">Por tentativa de autenticação</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Antifraude - Cartão</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.antifraud_fee} onChange={(e) => handleRateChange('antifraud_fee', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">R$ {rates.antifraud_fee.toFixed(2)}</p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">Por análise em transação cartão</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <p className="text-xs text-slate-500 mb-1">Antifraude - PIX</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.antifraud_pix_fee} onChange={(e) => handleRateChange('antifraud_pix_fee', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">R$ {rates.antifraud_pix_fee.toFixed(2)}</p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">Por análise em transação PIX</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <Switch
              checked={rates.threeds_charge_only_authenticated}
              onCheckedChange={(v) => setRates(prev => ({ ...prev, threeds_charge_only_authenticated: v }))}
              disabled={!editing}
            />
            <div>
              <p className="text-sm font-medium">Cobrar 3DS apenas em autenticações bem-sucedidas</p>
              <p className="text-[11px] text-slate-500">Quando ativo, tentativas falhas de 3DS não geram cobrança.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Pré-Chargeback & Chargebacks ───────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            Pré-Chargeback & Chargebacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-slate-500 mb-1">Taxa Pré-Chargeback</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.pre_cb_fee} onChange={(e) => handleRateChange('pre_cb_fee', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-orange-600">R$ {rates.pre_cb_fee.toFixed(2)}</p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">Por alerta Ethoca/Verifi recebido</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <p className="text-xs text-slate-500 mb-1">Multa por Chargeback</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">R$</span>
                  <Input type="number" step="0.01" value={rates.cb_penalty} onChange={(e) => handleRateChange('cb_penalty', e.target.value)} className="h-8 w-28 text-center" />
                </div>
              ) : (
                <p className="text-xl font-bold text-red-600">R$ {rates.cb_penalty.toFixed(2)}</p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">Por chargeback recebido</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Retenção ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            Retenção (Rolling Reserve)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PIX Retention */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
              <p className="font-semibold text-sm mb-3 flex items-center gap-2"><QrCode className="w-4 h-4 text-emerald-600" /> Retenção PIX</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Percentual Retido</p>
                  {editing ? (
                    <div className="flex items-center gap-1">
                      <Input type="number" step="0.1" value={rates.pix_retention_pct} onChange={(e) => handleRateChange('pix_retention_pct', e.target.value)} className="h-8 w-20 text-center" />
                      <span className="text-sm">%</span>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-emerald-700">{rates.pix_retention_pct.toFixed(1)}%</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Dias de Retenção</p>
                  {editing ? (
                    <div className="flex items-center gap-1">
                      <Input type="number" value={rates.pix_retention_days} onChange={(e) => handleRateChange('pix_retention_days', e.target.value)} className="h-8 w-20 text-center" />
                      <span className="text-sm">dias</span>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-emerald-700">{rates.pix_retention_days} dias</p>
                  )}
                </div>
              </div>
            </div>
            {/* Card Retention */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
              <p className="font-semibold text-sm mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-purple-600" /> Retenção Cartão</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Percentual Retido</p>
                  {editing ? (
                    <div className="flex items-center gap-1">
                      <Input type="number" step="0.1" value={rates.card_retention_pct} onChange={(e) => handleRateChange('card_retention_pct', e.target.value)} className="h-8 w-20 text-center" />
                      <span className="text-sm">%</span>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-purple-700">{rates.card_retention_pct.toFixed(1)}%</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Dias de Retenção</p>
                  {editing ? (
                    <div className="flex items-center gap-1">
                      <Input type="number" value={rates.card_retention_days} onChange={(e) => handleRateChange('card_retention_days', e.target.value)} className="h-8 w-20 text-center" />
                      <span className="text-sm">dias</span>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-purple-700">{rates.card_retention_days} dias</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Antecipação + Prazo de Recebimento ─────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Antecipação & Prazo de Recebimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-5 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-slate-500 mb-1">Taxa de Antecipação (a.m.)</p>
              {editing ? (
                <div className="flex items-center gap-1">
                  <Input type="number" step="0.01" value={rates.anticipation_rate} onChange={(e) => handleRateChange('anticipation_rate', e.target.value)} className="h-9 w-28 text-center text-lg font-bold" />
                  <span className="text-sm">% a.m.</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-orange-600">{rates.anticipation_rate.toFixed(2)}% a.m.</p>
              )}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-slate-500 mb-1">Prazo de Recebimento (D+N)</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">D +</span>
                  <Input type="number" value={rates.receivables_days} onChange={(e) => handleRateChange('receivables_days', e.target.value)} className="h-9 w-24 text-center text-lg font-bold" />
                  <span className="text-sm">dias</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-blue-600">D + {rates.receivables_days} dias</p>
              )}
              <p className="text-[10px] text-slate-400 mt-1">O cálculo de antecipação é feito no modelo de duration com base neste prazo.</p>
            </div>
          </div>

          {/* Anticipation Table */}
          <div>
            <p className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Tabela de Antecipação por Parcela (cálculo automático - duration)
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="py-2 px-2 text-center font-semibold text-slate-600">Parcela</th>
                    {anticipationTable.map(row => (
                      <th key={row.installment} className="py-2 px-2 text-center font-semibold text-slate-600">{row.installment}x</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-2 px-2 text-center font-medium text-slate-500">Dias antecipados</td>
                    {anticipationTable.map(row => (
                      <td key={row.installment} className="py-2 px-2 text-center text-slate-600">{row.daysAnticipated}d</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-center font-medium text-slate-500">Taxa efetiva</td>
                    {anticipationTable.map(row => (
                      <td key={row.installment} className={cn("py-2 px-2 text-center font-bold", row.effectiveRate > 0 ? "text-orange-600" : "text-slate-400")}>
                        {row.effectiveRate.toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Fórmula: Taxa Efetiva = (Taxa a.m. / 30) × Dias Antecipados | Dias Antecipados = (30 × Parcela) - Prazo Recebimento
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Rate History ───────────────────────────────────────── */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-5 h-5" /> Histórico de Alterações de Taxas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Data</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Alteração</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Usuário</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Negociação</th>
                  </tr>
                </thead>
                <tbody>
                  {rateHistory.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-3 px-3">{item.date}</td>
                      <td className="py-3 px-3">{item.change}</td>
                      <td className="py-3 px-3">{item.user}</td>
                      <td className="py-3 px-3">
                        {item.negotiation !== '-' ? (
                          <Badge variant="outline" className="text-[#2bc196] border-[#2bc196]">{item.negotiation}</Badge>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Below-cost alert ───────────────────────────────────── */}
      {mccEnabled && mccCosts && editing && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/10">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            Campos marcados em vermelho indicam taxas abaixo do custo base do MCC <strong>{selectedMcc}</strong>. Isso pode gerar prejuízo operacional.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}