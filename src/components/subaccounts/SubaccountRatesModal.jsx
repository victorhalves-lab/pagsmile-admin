import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/components/utils';
import {
  DollarSign, CreditCard, QrCode, FileText, Info, Loader2, Calculator
} from 'lucide-react';
import { toast } from 'sonner';

const brands = ['visa', 'mastercard', 'elo', 'hipercard', 'amex'];
const brandLabels = { visa: 'Visa', mastercard: 'Mastercard', elo: 'Elo', hipercard: 'Hipercard', amex: 'Amex' };
const installments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function RateInput({ label, value, onChange, suffix = '%', placeholder = '0.00' }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-8 h-8 text-sm"
          min={0}
          step={0.01}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

export default function SubaccountRatesModal({ open, onOpenChange, subaccount }) {
  const queryClient = useQueryClient();
  const [rates, setRates] = useState({
    mdr_card: '',
    mdr_pix: '',
    card: {},
    pix: { percentage: '', fixed: '' },
    boleto: { registration_fee: '', payment_fee: '', cancellation_fee: '' },
    anticipation_rate_card: '',
    anticipation_rate_pix: '',
    settlement_days_card: '',
    max_installments: '12',
    interest_free_installments: '',
  });

  const [simulatorInput, setSimulatorInput] = useState({ amount: 1000, method: 'credit', brand: 'visa', installments: 1 });
  const [simulatorResult, setSimulatorResult] = useState(null);

  useEffect(() => {
    if (subaccount) {
      const rc = subaccount.rates_config || {};
      setRates({
        mdr_card: subaccount.mdr_card ?? '',
        mdr_pix: subaccount.mdr_pix ?? '',
        card: rc.card || {},
        pix: rc.pix || { percentage: '', fixed: '' },
        boleto: rc.boleto || { registration_fee: '', payment_fee: '', cancellation_fee: '' },
        anticipation_rate_card: rc.anticipation_rate_card ?? '',
        anticipation_rate_pix: rc.anticipation_rate_pix ?? '',
        settlement_days_card: rc.settlement_days_card ?? '',
        max_installments: rc.max_installments ?? '12',
        interest_free_installments: rc.interest_free_installments ?? '',
      });
    }
  }, [subaccount]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Subaccount.update(subaccount.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subaccounts'] });
      toast.success('Taxas atualizadas com sucesso!');
      onOpenChange(false);
    }
  });

  const updateCardRate = (brand, installment, field, value) => {
    setRates(prev => {
      const card = { ...prev.card };
      if (!card[brand]) card[brand] = {};
      if (!card[brand][installment]) card[brand][installment] = {};
      card[brand][installment][field] = value;
      return { ...prev, card };
    });
  };

  const getCardRate = (brand, installment, field) => {
    return rates.card?.[brand]?.[installment]?.[field] || '';
  };

  const handleSimulate = () => {
    const amount = parseFloat(simulatorInput.amount) || 0;
    let percentRate = 0;
    let fixedRate = 0;

    if (simulatorInput.method === 'pix') {
      percentRate = parseFloat(rates.pix?.percentage || rates.mdr_pix) || 0;
      fixedRate = parseFloat(rates.pix?.fixed) || 0;
    } else if (simulatorInput.method === 'boleto') {
      fixedRate = parseFloat(rates.boleto?.payment_fee) || 0;
    } else {
      const brandRates = rates.card?.[simulatorInput.brand]?.[simulatorInput.installments];
      if (brandRates) {
        percentRate = parseFloat(brandRates.percentage) || 0;
        fixedRate = parseFloat(brandRates.fixed) || 0;
      } else {
        percentRate = parseFloat(rates.mdr_card) || 0;
      }
    }

    const totalFee = (amount * percentRate / 100) + fixedRate;
    const netAmount = amount - totalFee;

    setSimulatorResult({
      grossAmount: amount,
      feePercent: percentRate,
      feeFixed: fixedRate,
      totalFee,
      netAmount,
    });
  };

  const handleSave = () => {
    updateMutation.mutate({
      mdr_card: rates.mdr_card ? parseFloat(rates.mdr_card) : null,
      mdr_pix: rates.mdr_pix ? parseFloat(rates.mdr_pix) : null,
      rates_config: {
        card: rates.card,
        pix: rates.pix,
        boleto: rates.boleto,
        anticipation_rate_card: rates.anticipation_rate_card ? parseFloat(rates.anticipation_rate_card) : null,
        anticipation_rate_pix: rates.anticipation_rate_pix ? parseFloat(rates.anticipation_rate_pix) : null,
        settlement_days_card: rates.settlement_days_card ? parseInt(rates.settlement_days_card) : null,
        max_installments: rates.max_installments ? parseInt(rates.max_installments) : 12,
        interest_free_installments: rates.interest_free_installments ? parseInt(rates.interest_free_installments) : null,
      }
    });
  };

  if (!subaccount) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>Configurar Taxas</DialogTitle>
              <DialogDescription className="mt-0.5">
                {subaccount.business_name} • {subaccount.document}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="card" className="px-6">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="card" className="gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Cartão</TabsTrigger>
            <TabsTrigger value="pix" className="gap-1.5"><QrCode className="w-3.5 h-3.5" /> PIX</TabsTrigger>
            <TabsTrigger value="boleto" className="gap-1.5"><FileText className="w-3.5 h-3.5" /> Boleto</TabsTrigger>
            <TabsTrigger value="simulator" className="gap-1.5"><Calculator className="w-3.5 h-3.5" /> Simulador</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[50vh]">
            {/* CARTÃO */}
            <TabsContent value="card" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <RateInput
                  label="MDR Geral Cartão (taxa padrão %)"
                  value={rates.mdr_card}
                  onChange={(v) => setRates(prev => ({ ...prev, mdr_card: v }))}
                />
                <RateInput
                  label="Parcelas Sem Juros (até X vezes)"
                  value={rates.interest_free_installments}
                  onChange={(v) => setRates(prev => ({ ...prev, interest_free_installments: v }))}
                  suffix="x"
                  placeholder="0"
                />
                <RateInput
                  label="Máx. Parcelas"
                  value={rates.max_installments}
                  onChange={(v) => setRates(prev => ({ ...prev, max_installments: v }))}
                  suffix="x"
                  placeholder="12"
                />
                <RateInput
                  label="Taxa de Antecipação Cartão (%)"
                  value={rates.anticipation_rate_card}
                  onChange={(v) => setRates(prev => ({ ...prev, anticipation_rate_card: v }))}
                />
                <RateInput
                  label="Prazo de Liquidação (dias)"
                  value={rates.settlement_days_card}
                  onChange={(v) => setRates(prev => ({ ...prev, settlement_days_card: v }))}
                  suffix="d"
                  placeholder="30"
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Taxas por Bandeira e Parcelas</h4>
                <p className="text-xs text-gray-500 mb-4">Deixe em branco para usar a taxa geral configurada acima.</p>

                <div className="space-y-4">
                  {brands.map((brand) => (
                    <div key={brand} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="font-semibold">{brandLabels[brand]}</Badge>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-1.5 pr-2 font-medium text-gray-500 w-16">Parcelas</th>
                              <th className="text-left py-1.5 px-2 font-medium text-gray-500">Taxa (%)</th>
                              <th className="text-left py-1.5 px-2 font-medium text-gray-500">Fixo (R$)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {installments.slice(0, parseInt(rates.max_installments) || 12).map((inst) => (
                              <tr key={inst} className="border-b last:border-0">
                                <td className="py-1.5 pr-2 font-medium">{inst}x</td>
                                <td className="py-1.5 px-2">
                                  <Input
                                    type="number"
                                    className="h-7 text-xs w-24"
                                    placeholder={rates.mdr_card || '0.00'}
                                    value={getCardRate(brand, inst, 'percentage')}
                                    onChange={(e) => updateCardRate(brand, inst, 'percentage', e.target.value)}
                                    min={0}
                                    step={0.01}
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <Input
                                    type="number"
                                    className="h-7 text-xs w-24"
                                    placeholder="0.00"
                                    value={getCardRate(brand, inst, 'fixed')}
                                    onChange={(e) => updateCardRate(brand, inst, 'fixed', e.target.value)}
                                    min={0}
                                    step={0.01}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* PIX */}
            <TabsContent value="pix" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <RateInput
                  label="MDR Geral PIX (%)"
                  value={rates.mdr_pix}
                  onChange={(v) => setRates(prev => ({ ...prev, mdr_pix: v }))}
                />
                <RateInput
                  label="Taxa Fixa PIX (R$)"
                  value={rates.pix?.fixed}
                  onChange={(v) => setRates(prev => ({ ...prev, pix: { ...prev.pix, fixed: v } }))}
                  suffix="R$"
                  placeholder="0.00"
                />
                <RateInput
                  label="Taxa Percentual PIX (%)"
                  value={rates.pix?.percentage}
                  onChange={(v) => setRates(prev => ({ ...prev, pix: { ...prev.pix, percentage: v } }))}
                />
                <RateInput
                  label="Taxa de Antecipação PIX (%)"
                  value={rates.anticipation_rate_pix}
                  onChange={(v) => setRates(prev => ({ ...prev, anticipation_rate_pix: v }))}
                />
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  O MDR Geral PIX será aplicado quando a Taxa Percentual PIX não estiver preenchida. Ambos podem coexistir com a Taxa Fixa.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* BOLETO */}
            <TabsContent value="boleto" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <RateInput
                  label="Taxa por Boleto Registrado (R$)"
                  value={rates.boleto?.registration_fee}
                  onChange={(v) => setRates(prev => ({ ...prev, boleto: { ...prev.boleto, registration_fee: v } }))}
                  suffix="R$"
                  placeholder="1.50"
                />
                <RateInput
                  label="Taxa por Boleto Pago (R$)"
                  value={rates.boleto?.payment_fee}
                  onChange={(v) => setRates(prev => ({ ...prev, boleto: { ...prev.boleto, payment_fee: v } }))}
                  suffix="R$"
                  placeholder="2.50"
                />
                <RateInput
                  label="Taxa por Boleto Cancelado (R$)"
                  value={rates.boleto?.cancellation_fee}
                  onChange={(v) => setRates(prev => ({ ...prev, boleto: { ...prev.boleto, cancellation_fee: v } }))}
                  suffix="R$"
                  placeholder="0.50"
                />
              </div>
            </TabsContent>

            {/* SIMULADOR */}
            <TabsContent value="simulator" className="mt-0 space-y-6">
              <h4 className="text-sm font-semibold">Simulador de Taxas</h4>
              <p className="text-xs text-gray-500">Teste as taxas configuradas antes de salvar.</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Valor da Transação (R$)</Label>
                  <Input
                    type="number"
                    value={simulatorInput.amount}
                    onChange={(e) => setSimulatorInput(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Meio de Pagamento</Label>
                  <select
                    className="w-full h-9 border rounded-lg px-3 text-sm"
                    value={simulatorInput.method}
                    onChange={(e) => setSimulatorInput(prev => ({ ...prev, method: e.target.value }))}
                  >
                    <option value="credit">Cartão de Crédito</option>
                    <option value="debit">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                {(simulatorInput.method === 'credit' || simulatorInput.method === 'debit') && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Bandeira</Label>
                      <select
                        className="w-full h-9 border rounded-lg px-3 text-sm"
                        value={simulatorInput.brand}
                        onChange={(e) => setSimulatorInput(prev => ({ ...prev, brand: e.target.value }))}
                      >
                        {brands.map(b => (
                          <option key={b} value={b}>{brandLabels[b]}</option>
                        ))}
                      </select>
                    </div>
                    {simulatorInput.method === 'credit' && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Parcelas</Label>
                        <select
                          className="w-full h-9 border rounded-lg px-3 text-sm"
                          value={simulatorInput.installments}
                          onChange={(e) => setSimulatorInput(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
                        >
                          {installments.map(i => (
                            <option key={i} value={i}>{i}x</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Button variant="outline" onClick={handleSimulate} className="w-full">
                <Calculator className="w-4 h-4 mr-2" /> Simular
              </Button>

              {simulatorResult && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Valor Bruto</p>
                    <p className="text-lg font-bold">{formatCurrency(simulatorResult.grossAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Taxa Total</p>
                    <p className="text-lg font-bold text-red-600">- {formatCurrency(simulatorResult.totalFee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Taxa % Aplicada</p>
                    <p className="text-sm font-medium">{simulatorResult.feePercent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Taxa Fixa Aplicada</p>
                    <p className="text-sm font-medium">{formatCurrency(simulatorResult.feeFixed)}</p>
                  </div>
                  <div className="col-span-2 border-t pt-3">
                    <p className="text-xs text-gray-500">Valor Líquido (Subconta Recebe)</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(simulatorResult.netAmount)}</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            ) : (
              'Salvar Taxas'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}