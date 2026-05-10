import React, { useState } from 'react';
import { Sparkles, Play, ArrowLeft, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminIntCheckupProgrammaticTrigger() {
  const navigate = useNavigate();
  const [resource, setResource] = useState('transactions');
  const [operation, setOperation] = useState('consistency_check');
  const [sampleType, setSampleType] = useState('time_window');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [merchantIds, setMerchantIds] = useState('');
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');
  const [estimatedVolume, setEstimatedVolume] = useState(null);
  const [running, setRunning] = useState(false);

  const handleEstimate = () => {
    setEstimatedVolume({
      transactions: Math.floor(Math.random() * 50000) + 10000,
      estimated_inconsistencies: Math.floor(Math.random() * 200) + 20,
      estimated_duration_min: Math.floor(Math.random() * 15) + 2,
    });
  };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => navigate('/AdminIntCheckupHub'), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <PageHeader
        icon={Sparkles}
        title="Disparar Checkup Customizado"
        subtitle="Mentor API · ORIGEM 197 · Análise diagnóstica dirigida sobre amostra específica"
        breadcrumbs={[
          { label: 'Diagnósticos', page: 'AdminIntCheckupHub' },
          { label: 'Disparo Programático' },
        ]}
        actions={
          <Link to="/AdminIntCheckupHub">
            <Button variant="ghost" className="gap-1"><ArrowLeft className="w-4 h-4" /> Voltar</Button>
          </Link>
        }
      />

      <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-purple-800">Quando usar disparo programático?</div>
            <div className="text-purple-700 mt-1">
              Quando rotinas automáticas não cobrem adequadamente — ex: revalidar transações após mudança de regra, dirigir análise em lojista específico após reclamação, identificar inconsistências em janela de incidente sistêmico.
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">⚙️ Parâmetros do Checkup</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Recurso (entidade-alvo)</Label>
            <Select value={resource} onValueChange={setResource}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="transactions">Transações</SelectItem>
                <SelectItem value="payments">Pagamentos</SelectItem>
                <SelectItem value="anticipations">Antecipações</SelectItem>
                <SelectItem value="receivable_units">URs (Recebíveis)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de análise</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="consistency_check">Validação de consistência interna</SelectItem>
                <SelectItem value="external_reconciliation">Reconciliação externa (adquirente)</SelectItem>
                <SelectItem value="value_validation">Validação de valores e cálculos</SelectItem>
                <SelectItem value="status_validation">Validação de estados</SelectItem>
                <SelectItem value="regulatory_check">Conformidade regulatória</SelectItem>
                <SelectItem value="custom">Análise customizada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Critério de seleção da amostra</Label>
          <div className="flex gap-2 mt-2">
            {[
              { v: 'time_window', label: 'Janela temporal' },
              { v: 'merchant', label: 'Por lojista' },
              { v: 'ids', label: 'Lista de IDs' },
            ].map(opt => (
              <button
                key={opt.v}
                onClick={() => setSampleType(opt.v)}
                className={`px-3 py-2 rounded-lg border text-sm ${sampleType === opt.v ? 'border-purple-300 bg-purple-50' : 'border-slate-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {sampleType === 'time_window' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Data início</Label>
              <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Data fim</Label>
              <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        )}

        {sampleType === 'merchant' && (
          <div>
            <Label>IDs de lojistas (separados por vírgula)</Label>
            <Input value={merchantIds} onChange={(e) => setMerchantIds(e.target.value)} placeholder="mer_001, mer_002, mer_003" />
          </div>
        )}

        {sampleType === 'ids' && (
          <div>
            <Label>IDs de transações (um por linha)</Label>
            <Textarea rows={4} placeholder="txn_900001&#10;txn_900002&#10;txn_900003" />
          </div>
        )}

        <Button variant="outline" onClick={handleEstimate} className="gap-1">
          📊 Estimar Volume
        </Button>

        {estimatedVolume && (
          <Card className="p-3 bg-amber-50 border-amber-200">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-xs text-amber-700 uppercase font-bold">Itens a analisar</div>
                <div className="text-xl font-black">{estimatedVolume.transactions.toLocaleString('pt-BR')}</div>
              </div>
              <div>
                <div className="text-xs text-amber-700 uppercase font-bold">Inconsistências est.</div>
                <div className="text-xl font-black">{estimatedVolume.estimated_inconsistencies}</div>
              </div>
              <div>
                <div className="text-xs text-amber-700 uppercase font-bold">Duração est.</div>
                <div className="text-xl font-black">~{estimatedVolume.estimated_duration_min}min</div>
              </div>
            </div>
          </Card>
        )}
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-purple-600" /> Governança</h3>
        <div>
          <Label>Justificativa <span className="text-red-500">*</span></Label>
          <Textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Por que está disparando análise dirigida? Mínimo 50 caracteres."
            rows={3}
          />
        </div>
        <div>
          <Label>Token OTP</Label>
          <Input
            type="text" inputMode="numeric" maxLength={6} placeholder="000000"
            value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="font-mono text-xl text-center tracking-widest"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleRun}
          disabled={!estimatedVolume || justification.length < 50 || otp.length !== 6 || running}
          className="gap-1 bg-purple-600 hover:bg-purple-700"
        >
          {running ? '⏳ Executando...' : <><Play className="w-4 h-4" /> Disparar Checkup</>}
        </Button>
      </div>
    </div>
  );
}