import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calculator, AlertTriangle, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { mockRecalculatePreview } from '@/components/mentor/mocks/settlementGovernanceMock';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(n));

export default function RecalculateFlow() {
  const [scope, setScope] = useState('list');
  const [reason, setReason] = useState('config_correction');
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const totalDelta = mockRecalculatePreview.reduce((s, p) => s + p.delta, 0);
  const significant = mockRecalculatePreview.filter((p) => p.significant);

  const submit = () => {
    if (!justification.trim() || justification.length < 30) {
      toast.error('Justificativa precisa ter no mínimo 30 caracteres');
      return;
    }
    if (otp.length !== 6) {
      toast.error('Código OTP inválido');
      return;
    }
    toast.success('Recálculo aplicado em 3 settlements · trilha auditável registrada');
    setShowPreview(false);
    setJustification('');
    setOtp('');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50/30 border-blue-200">
        <CardContent className="p-3 text-xs text-blue-900">
          📐 <strong>Recalculate</strong> · refaz o cálculo financeiro de pagamentos sem alterar transações agregadas. Gera valor diferente conforme dados/regras atualizadas.
          Disponível apenas para pagamentos pré-execução.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="w-4 h-4 text-violet-600" /> 1. Configurar escopo do recálculo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { key: 'specific', label: 'Pagamento específico' },
              { key: 'list', label: 'Lista de pagamentos' },
              { key: 'filter', label: 'Filtro de critérios' },
              { key: 'massive', label: 'Massivo (todos elegíveis)' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setScope(s.key)}
                className={cn(
                  'p-2 rounded border text-[11px] font-semibold transition',
                  scope === s.key ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Motivo do recálculo</p>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="calc_error">Erro no cálculo original detectado</SelectItem>
                <SelectItem value="retro_adjustment">Mudança retroativa em ajustes pendentes</SelectItem>
                <SelectItem value="config_correction">Correção de configuração</SelectItem>
                <SelectItem value="systematic_review">Revisão sistemática pós-mudança</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Justificativa textual (mín. 30 caracteres)</p>
            <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={3} className="text-xs" placeholder="Detalhe contexto da decisão..." />
            <p className="text-[10px] text-slate-400 mt-0.5">{justification.length} caracteres</p>
          </div>

          <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setShowPreview(true)}>
            <ArrowRight className="w-3.5 h-3.5 mr-1" /> Gerar preview de impacto
          </Button>
        </CardContent>
      </Card>

      {showPreview && (
        <>
          <Card className="border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> 2. Preview de impacto · {mockRecalculatePreview.length} settlements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded p-2 text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Settlements</p>
                  <p className="text-lg font-black">{mockRecalculatePreview.length}</p>
                </div>
                <div className={cn('rounded p-2 text-center', totalDelta >= 0 ? 'bg-emerald-50' : 'bg-red-50')}>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Δ agregado</p>
                  <p className={cn('text-lg font-black', totalDelta >= 0 ? 'text-emerald-700' : 'text-red-700')}>
                    {totalDelta >= 0 ? '+' : '−'}{fmt(totalDelta)}
                  </p>
                </div>
                <div className={cn('rounded p-2 text-center', significant.length > 0 ? 'bg-amber-50' : 'bg-emerald-50')}>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Mudanças significativas</p>
                  <p className={cn('text-lg font-black', significant.length > 0 ? 'text-amber-700' : 'text-emerald-700')}>{significant.length}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2 font-bold text-slate-600">Settlement</th>
                      <th className="text-left p-2 font-bold text-slate-600">Lojista</th>
                      <th className="text-right p-2 font-bold text-slate-600">Atual</th>
                      <th className="text-right p-2 font-bold text-slate-600">Novo</th>
                      <th className="text-right p-2 font-bold text-slate-600">Δ</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecalculatePreview.map((p) => (
                      <tr key={p.settlement_id} className={cn('border-b last:border-0', p.significant && 'bg-amber-50')}>
                        <td className="p-2"><code className="font-mono text-[10px]">{p.settlement_id}</code></td>
                        <td className="p-2 font-semibold">{p.merchant}</td>
                        <td className="p-2 text-right">{fmt(p.current_value)}</td>
                        <td className="p-2 text-right font-bold">{fmt(p.new_value)}</td>
                        <td className={cn('p-2 text-right font-bold', p.delta >= 0 ? 'text-emerald-700' : 'text-red-700')}>
                          {p.delta >= 0 ? '+' : '−'}{fmt(p.delta)} ({p.delta_pct >= 0 ? '+' : ''}{p.delta_pct.toFixed(2)}%)
                        </td>
                        <td className="p-2">
                          {p.significant && (
                            <Badge className="bg-amber-100 text-amber-700 text-[9px] gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> revisar
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {significant.map((p) => (
                <div key={p.settlement_id} className="bg-amber-50 border border-amber-200 rounded p-2 text-[11px]">
                  <strong>{p.settlement_id} · {p.merchant}:</strong> {p.reason}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-violet-300 bg-violet-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-600" /> 3. Confirmar com OTP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Código OTP (6 dígitos)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="font-mono text-center w-32"
                  maxLength={6}
                />
                <Button onClick={submit} className="bg-violet-600 hover:bg-violet-700">
                  <FileText className="w-3.5 h-3.5 mr-1" /> Aplicar recálculo · {mockRecalculatePreview.length} settlements
                </Button>
              </div>
              <p className="text-[10px] text-slate-500">
                Trilha auditável registra autor, timestamp, escopo, justificativa, valores antes vs depois.
                Comunicação automática ao lojista em mudanças relevantes.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}