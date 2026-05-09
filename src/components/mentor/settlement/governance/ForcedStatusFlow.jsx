import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, FileText, Upload, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ForcedStatusFlow() {
  const [settlementId, setSettlementId] = useState('');
  const [newStatus, setNewStatus] = useState('executed');
  const [evidence, setEvidence] = useState([]);
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');
  const [executiveApproval, setExecutiveApproval] = useState(false);

  const submit = () => {
    if (justification.length < 200) {
      toast.error('Justificativa precisa ter no mínimo 200 caracteres');
      return;
    }
    if (evidence.length === 0) {
      toast.error('Anexe pelo menos uma evidência');
      return;
    }
    if (!executiveApproval) {
      toast.error('Aprovação executiva obrigatória');
      return;
    }
    if (otp.length !== 6) {
      toast.error('OTP inválido');
      return;
    }
    toast.success(`Status forçado para ${newStatus} · trilha auditável robusta registrada · revisão pós-evento agendada para D+7`);
    setSettlementId('');
    setJustification('');
    setOtp('');
    setEvidence([]);
    setExecutiveApproval(false);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-amber-50/40 border-amber-300">
        <CardContent className="p-3 text-xs text-amber-900">
          ⚠️ <strong>Forçar Status</strong> · operação especializada quando o sistema não consegue determinar status final automaticamente (banco não respondeu, comunicação interrompida).
          Demanda evidência documental + justificativa de 200+ caracteres + OTP + aprovação executiva.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Configuração da força de status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Settlement ID alvo</p>
            <Input
              placeholder="STL-2026-05-09-00489"
              value={settlementId}
              onChange={(e) => setSettlementId(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Novo status forçado</p>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="executed">Executado (extrato confirma transferência)</SelectItem>
                <SelectItem value="failed">Falhou (banco confirmou rejeição)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Evidências obrigatórias</p>
            <Button variant="outline" size="sm" className="w-full h-9 text-xs border-dashed" onClick={() => { setEvidence([...evidence, `evidencia_${evidence.length + 1}.pdf`]); toast.success('Evidência anexada'); }}>
              <Upload className="w-3 h-3 mr-1" /> Anexar evidência (extrato, ofício, e-mail)
            </Button>
            {evidence.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {evidence.map((e, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">📎 {e}</Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Justificativa textual robusta (mín. 200 caracteres)</p>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={5}
              className="text-xs"
              placeholder="Descreva: (1) motivo da necessidade de forçar status; (2) processo de investigação; (3) conclusão; (4) implicações operacionais"
            />
            <p className={cn('text-[10px] mt-0.5', justification.length >= 200 ? 'text-emerald-600' : 'text-slate-400')}>
              {justification.length}/200 caracteres mínimos
            </p>
          </div>

          <div className="bg-violet-50 border border-violet-300 rounded p-3 space-y-2">
            <p className="text-[10px] uppercase font-bold text-violet-700">Aprovação executiva</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={executiveApproval}
                onChange={(e) => setExecutiveApproval(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600"
              />
              <span className="text-xs text-slate-700">Confirmo que <strong>Roberto Silva (Gerente Financeiro)</strong> aprovou esta operação</span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <Lock className="w-4 h-4 text-violet-600" />
            <Input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="font-mono text-center w-32"
              maxLength={6}
            />
            <Button onClick={submit} className="bg-amber-600 hover:bg-amber-700 text-white">
              <FileText className="w-3.5 h-3.5 mr-1" /> Forçar status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}