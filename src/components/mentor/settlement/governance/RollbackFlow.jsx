import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Undo2, AlertTriangle, Upload, Lock, FileText, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function RollbackFlow() {
  const [settlementId, setSettlementId] = useState('');
  const [reason, setReason] = useState('calc_error');
  const [justification, setJustification] = useState('');
  const [docs, setDocs] = useState([]);
  const [collectionMethod, setCollectionMethod] = useState('discount_future');
  const [installments, setInstallments] = useState(1);
  const [stage, setStage] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpExec, setOtpExec] = useState('');

  const handleStage1 = () => {
    if (justification.length < 500) {
      toast.error('Justificativa precisa ter no mínimo 500 caracteres');
      return;
    }
    if (docs.length === 0) {
      toast.error('Anexe documentação justificativa');
      return;
    }
    if (otp.length !== 6) {
      toast.error('OTP do operador inválido');
      return;
    }
    setStage(2);
    toast.info('Pedido enviado para aprovação executiva (Diretoria)');
  };

  const handleStage2 = () => {
    if (otpExec.length !== 6) {
      toast.error('OTP executivo inválido');
      return;
    }
    toast.success('Rollback aplicado · comunicação ao lojista disparada · cobrança agendada · revisão pós-evento em D+30/D+60/D+90');
    setStage(3);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-red-50/40 border-red-300">
        <CardContent className="p-3 text-xs text-red-900">
          🛑 <strong>Manual Rollback</strong> · operação altamente destrutiva. Reverte logicamente pagamento já executado.
          Demanda 500+ caracteres de justificativa, documentação completa, mecanismo de devolução, OTP do operador + OTP executivo da Diretoria, comunicação obrigatória ao lojista.
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold', stage >= s ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500')}>
              {s}
            </div>
            <span className={cn('text-[11px]', stage >= s ? 'text-violet-700 font-bold' : 'text-slate-500')}>
              {s === 1 ? 'Iniciar pedido' : s === 2 ? 'Aprovação executiva' : 'Aplicado'}
            </span>
            {s < 3 && <div className={cn('flex-1 h-0.5', stage > s ? 'bg-violet-600' : 'bg-slate-200')} />}
          </div>
        ))}
      </div>

      {stage === 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Undo2 className="w-4 h-4 text-red-600" /> Etapa 1 · Operador inicia pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Settlement ID a reverter</p>
              <Input value={settlementId} onChange={(e) => setSettlementId(e.target.value)} placeholder="STL-..." className="font-mono text-xs" />
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Motivo categorizado</p>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="calc_error">Cálculo errado detectado posteriormente</SelectItem>
                  <SelectItem value="late_chargeback">Transações invalidadas por chargebacks tardios</SelectItem>
                  <SelectItem value="fraud_detected">Fraude detectada na conta de destino</SelectItem>
                  <SelectItem value="contract_breach">Descumprimento contratual</SelectItem>
                  <SelectItem value="strategic">Decisão administrativa estratégica</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Justificativa extensa (mín. 500 caracteres)</p>
              <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={6} className="text-xs"
                placeholder="Contextualize: descoberta do problema, decisão tomada, próximos passos, comunicações já realizadas..." />
              <p className={cn('text-[10px] mt-0.5', justification.length >= 500 ? 'text-emerald-600' : 'text-slate-400')}>
                {justification.length}/500 caracteres mínimos
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Documentação completa</p>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs border-dashed"
                onClick={() => { setDocs([...docs, `doc_${docs.length + 1}.pdf`]); toast.success('Documento anexado'); }}>
                <Upload className="w-3 h-3 mr-1" /> Anexar (relatório, evidências, aprovações, parecer jurídico)
              </Button>
              {docs.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {docs.map((d, i) => <Badge key={i} variant="outline" className="text-[10px]">📎 {d}</Badge>)}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mecanismo de cobrança</p>
                <Select value={collectionMethod} onValueChange={setCollectionMethod}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount_future">Desconto em pagamentos futuros</SelectItem>
                    <SelectItem value="boleto">Cobrança via boleto</SelectItem>
                    <SelectItem value="manual_negotiation">Negociação caso a caso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {collectionMethod === 'discount_future' && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Cronograma (parcelas)</p>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value) || 1)}
                    className="h-9 text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <Lock className="w-4 h-4 text-violet-600" />
              <Input
                placeholder="OTP do operador"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="font-mono text-center w-32"
                maxLength={6}
              />
              <Button onClick={handleStage1} className="bg-red-600 hover:bg-red-700">
                <Send className="w-3.5 h-3.5 mr-1" /> Enviar para aprovação executiva
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === 2 && (
        <Card className="border-violet-300 bg-violet-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-violet-600" /> Etapa 2 · Aprovação executiva (Diretoria)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white border rounded p-3 text-xs space-y-1">
              <p><strong>Settlement:</strong> {settlementId}</p>
              <p><strong>Motivo:</strong> {reason}</p>
              <p><strong>Documentos:</strong> {docs.length} anexos</p>
              <p><strong>Cobrança:</strong> {collectionMethod} {collectionMethod === 'discount_future' && `(${installments}x)`}</p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-600" />
              <Input
                placeholder="OTP da Diretoria"
                value={otpExec}
                onChange={(e) => setOtpExec(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="font-mono text-center w-32"
                maxLength={6}
              />
              <Button onClick={handleStage2} className="bg-violet-600 hover:bg-violet-700">
                <FileText className="w-3.5 h-3.5 mr-1" /> Aprovar e aplicar rollback
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === 3 && (
        <Card className="border-emerald-300 bg-emerald-50/30">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-3xl">✅</div>
            <p className="text-sm font-bold text-emerald-700">Rollback aplicado com sucesso</p>
            <p className="text-xs text-slate-600">Lojista comunicado · cobrança agendada · revisões pós-evento programadas para D+30/D+60/D+90</p>
            <Button variant="outline" onClick={() => { setStage(1); setSettlementId(''); setJustification(''); setDocs([]); setOtp(''); setOtpExec(''); }}>
              Iniciar novo pedido
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}