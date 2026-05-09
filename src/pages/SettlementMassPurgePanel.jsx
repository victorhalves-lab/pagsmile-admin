import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, AlertTriangle, Trash2, Lock, Upload, CheckCircle2 } from 'lucide-react';
import { mockMassPurgePendingState } from '@/components/mentor/mocks/settlementGovernanceMock';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
const CONFIRM_PHRASE = 'EU CONFIRMO A REMOÇÃO MASSIVA DE TODOS OS PAGAMENTOS PENDENTES';

export default function SettlementMassPurgePanel() {
  const state = mockMassPurgePendingState;
  const [reason, setReason] = useState('incident_recovery');
  const [justification, setJustification] = useState('');
  const [docs, setDocs] = useState([]);
  const [scope, setScope] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('');
  const [stage, setStage] = useState(1);
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');

  const advance = (toStage) => {
    if (toStage === 2) {
      if (justification.length < 1000) {
        toast.error('Justificativa precisa ter no mínimo 1000 caracteres');
        return;
      }
      if (docs.length === 0) {
        toast.error('Anexe documentação de aprovação interna');
        return;
      }
      if (otp1.length !== 6) {
        toast.error('OTP do operador inválido');
        return;
      }
      toast.info('Pedido enviado para Gerente Financeiro');
    }
    if (toStage === 3) {
      if (otp2.length !== 6) {
        toast.error('OTP do Gerente Financeiro inválido');
        return;
      }
      toast.info('Aguardando OTP da Diretoria');
    }
    if (toStage === 4) {
      if (otp3.length !== 6) {
        toast.error('OTP da Diretoria inválido');
        return;
      }
      if (confirmPhrase.trim() !== CONFIRM_PHRASE) {
        toast.error('Frase de confirmação não confere exatamente');
        return;
      }
      toast.success('Mass purge executada · transação atômica · revisão pós-evento agendada');
    }
    setStage(toStage);
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Mass Purge · Pagamentos pendentes"
        subtitle="Operação de exceção sistêmica · 3 etapas de aprovação + frase exata de confirmação"
        icon={Trash2}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Liquidações', page: 'AdminIntSettlements' },
          { label: 'Mass Purge' },
        ]}
        actions={
          <Badge className="bg-violet-100 text-violet-700 gap-1">
            <Sparkles className="w-3 h-3" /> Mentor · Wave I.5
          </Badge>
        }
      />

      <Card className="bg-red-50/40 border-red-300">
        <CardContent className="p-3 text-xs text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>OPERAÇÃO EXTREMAMENTE DESTRUTIVA.</strong> Remove TODOS os pagamentos pendentes (status "criado" pré-execução).
            Use apenas em recuperação de incidente sistêmico, ajustes estruturais ou manutenções planejadas.
            Demanda 3 etapas de aprovação + digitação literal da frase de confirmação.
          </div>
        </CardContent>
      </Card>

      {/* Estado vigente */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Estado vigente do pipeline pendente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <div className="bg-amber-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Pendentes</p>
              <p className="text-2xl font-black text-amber-700">{state.total_pending.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-red-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Valor agregado</p>
              <p className="text-base font-black text-red-700">{fmt(state.total_value)}</p>
            </div>
            <div className="bg-blue-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Lojistas afetados</p>
              <p className="text-2xl font-black text-blue-700">{state.affected_merchants}</p>
            </div>
            <div className="bg-slate-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Mais antigo</p>
              <p className="text-2xl font-black">{state.oldest_pending_days}d</p>
            </div>
          </div>

          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Distribuição por tipo</p>
          <div className="space-y-1">
            {state.by_type.map((t) => (
              <div key={t.type} className="flex items-center gap-2 text-[11px]">
                <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                <span className="text-slate-600">{t.count} pagamentos</span>
                <span className="ml-auto font-mono">{fmt(t.value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stepper */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { n: 1, label: 'Operador inicia' },
          { n: 2, label: 'Gerente Financeiro' },
          { n: 3, label: 'Diretoria' },
          { n: 4, label: 'Executada' },
        ].map((s, i, arr) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2">
              <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                stage >= s.n ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500')}>
                {stage > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
              </div>
              <span className={cn('text-[11px]', stage >= s.n ? 'text-violet-700 font-bold' : 'text-slate-500')}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <div className={cn('flex-1 h-0.5 min-w-[20px]', stage > s.n ? 'bg-violet-600' : 'bg-slate-200')} />}
          </React.Fragment>
        ))}
      </div>

      {stage === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Etapa 1 · Operador inicia</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Escopo refinado</p>
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os pendentes ({state.total_pending})</SelectItem>
                  <SelectItem value="by_project">Apenas projeto específico</SelectItem>
                  <SelectItem value="by_type">Apenas tipo específico</SelectItem>
                  <SelectItem value="by_window">Apenas janela temporal</SelectItem>
                </SelectContent>
              </Select>
              {scope !== 'all' && (
                <Input className="mt-2 h-8 text-xs" placeholder="Identificador do escopo" value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value)} />
              )}
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Motivo categorizado</p>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="incident_recovery">Recuperação de incidente sistêmico</SelectItem>
                  <SelectItem value="structural">Ajuste estrutural com rebuild do pipeline</SelectItem>
                  <SelectItem value="maintenance">Manutenção planejada</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Justificativa extensa (mín. 1000 caracteres)</p>
              <Textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={8} className="text-xs" placeholder="Contexto completo, decisão tomada, processo de aprovação interna, plano de comunicação aos lojistas afetados..." />
              <p className={cn('text-[10px] mt-0.5', justification.length >= 1000 ? 'text-emerald-600' : 'text-slate-400')}>
                {justification.length}/1000 caracteres mínimos
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Documentação de aprovação interna</p>
              <Button variant="outline" size="sm" className="w-full h-9 text-xs border-dashed"
                onClick={() => { setDocs([...docs, `aprovacao_${docs.length + 1}.pdf`]); toast.success('Documento anexado'); }}>
                <Upload className="w-3 h-3 mr-1" /> Anexar (ata, e-mails de aprovação executiva, parecer técnico, plano)
              </Button>
              {docs.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {docs.map((d, i) => <Badge key={i} variant="outline" className="text-[10px]">📎 {d}</Badge>)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <Lock className="w-4 h-4" />
              <Input placeholder="OTP do operador" value={otp1} onChange={(e) => setOtp1(e.target.value.replace(/\D/g, '').slice(0, 6))} className="font-mono text-center w-32" maxLength={6} />
              <Button onClick={() => advance(2)} className="bg-red-600 hover:bg-red-700">Enviar para Gerente Financeiro</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === 2 && (
        <Card className="border-amber-300">
          <CardHeader><CardTitle className="text-sm">Etapa 2 · Aprovação Gerente Financeiro</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-amber-50 rounded p-3 text-xs">
              <p>Pedido recebido. Revisar documentação anexa ({docs.length} anexos) e justificativa antes de aprovar.</p>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <Input placeholder="OTP Gerente Financeiro" value={otp2} onChange={(e) => setOtp2(e.target.value.replace(/\D/g, '').slice(0, 6))} className="font-mono text-center w-32" maxLength={6} />
              <Button onClick={() => advance(3)} className="bg-amber-600 hover:bg-amber-700">Aprovar e escalar para Diretoria</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === 3 && (
        <Card className="border-red-400 bg-red-50/30">
          <CardHeader><CardTitle className="text-sm">Etapa 3 · Aprovação Diretoria + Frase de confirmação</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-red-100 border border-red-300 rounded p-3 text-xs">
              <p className="font-bold text-red-900 mb-1">⚠️ Confirmação final irreversível</p>
              <p>Esta operação removerá <strong>{state.total_pending} pagamentos</strong> totalizando <strong>{fmt(state.total_value)}</strong>, afetando <strong>{state.affected_merchants} lojistas</strong>.</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Digite EXATAMENTE a frase abaixo:</p>
              <code className="block bg-slate-900 text-emerald-300 p-2 rounded text-[11px] font-mono mb-2 select-none">
                {CONFIRM_PHRASE}
              </code>
              <Input
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                className="font-mono text-xs"
                placeholder="Digite a frase exatamente..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <Lock className="w-4 h-4 text-red-600" />
              <Input placeholder="OTP Diretoria" value={otp3} onChange={(e) => setOtp3(e.target.value.replace(/\D/g, '').slice(0, 6))} className="font-mono text-center w-32" maxLength={6} />
              <Button onClick={() => advance(4)} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Executar mass purge
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === 4 && (
        <Card className="border-emerald-300 bg-emerald-50/30">
          <CardContent className="p-4 text-center space-y-2">
            <div className="text-4xl">✅</div>
            <p className="text-sm font-bold text-emerald-700">Mass purge executada com sucesso</p>
            <p className="text-xs text-slate-600">{state.total_pending} pagamentos removidos · transações liberadas para reprocessamento · lojistas afetados notificados em massa · revisões pós-evento programadas para 24h, 7d, 30d</p>
          </CardContent>
        </Card>
      )}

      {/* Histórico de purges */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Histórico de mass purges anteriores</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {state.recent_purges.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded text-[11px] flex-wrap gap-2">
              <div>
                <span className="font-mono text-slate-500">{p.date}</span>
                <span className="ml-2 font-bold">{p.operator}</span>
                <span className="ml-2 text-slate-600">· {p.count} pagamentos · {fmt(p.value)}</span>
              </div>
              <span className="text-slate-500 italic">"{p.reason}"</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}