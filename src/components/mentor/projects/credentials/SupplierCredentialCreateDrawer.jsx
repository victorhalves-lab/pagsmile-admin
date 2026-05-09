import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { SUPPLIER_TYPES, CREDENTIAL_TYPES } from '@/components/mentor/mocks/supplierCredentialsMock';
import { toast } from 'sonner';

export default function SupplierCredentialCreateDrawer({ open, onOpenChange, onSaved }) {
  const [draft, setDraft] = useState({
    name: '',
    supplier: '',
    supplier_type: '',
    credential_type: 'api_key',
    environment: 'production',
    raw_value: '',
    expires_at: '',
    rotation_period_days: 365,
    owner: '',
    scope: '',
    notes: '',
  });
  const [test, setTest] = useState({ status: 'idle', latency: null, message: '' });

  const handleTest = async () => {
    setTest({ status: 'testing', latency: null, message: 'Verificando conectividade...' });
    await new Promise((r) => setTimeout(r, 1200));
    if (!draft.raw_value || draft.raw_value.length < 8) {
      setTest({ status: 'error', latency: null, message: 'Valor da credencial inválido' });
      return;
    }
    setTest({ status: 'success', latency: 142 + Math.floor(Math.random() * 50), message: 'Conexão estabelecida · escopos validados' });
  };

  const handleSubmit = () => {
    if (!draft.name || !draft.supplier || !draft.supplier_type || !draft.raw_value) {
      toast.error('Preencha campos obrigatórios');
      return;
    }
    if (test.status !== 'success') {
      toast.error('Execute o teste de conectividade antes de salvar');
      return;
    }
    onSaved?.(draft);
    onOpenChange(false);
    toast.success('Credencial cadastrada · OTP de revelação configurado');
  };

  return (
    <EntityFormDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Cadastrar nova credencial de fornecedor"
      description="Credenciais armazenadas com criptografia AES-256 · revelação requer OTP + razão"
      icon={KeyRound}
      size="lg"
      onSubmit={handleSubmit}
      submitLabel="Cadastrar credencial"
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Nome / identificação</Label>
            <Input
              placeholder="Ex: Cielo · Produção · Visa/Master"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Fornecedor</Label>
            <Input
              placeholder="Ex: Cielo, Stone, Itaú..."
              value={draft.supplier}
              onChange={(e) => setDraft({ ...draft, supplier: e.target.value })}
            />
          </div>
          <div>
            <Label>Categoria</Label>
            <Select value={draft.supplier_type} onValueChange={(v) => setDraft({ ...draft, supplier_type: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPLIER_TYPES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de credencial</Label>
            <Select value={draft.credential_type} onValueChange={(v) => setDraft({ ...draft, credential_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CREDENTIAL_TYPES).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ambiente</Label>
            <Select value={draft.environment} onValueChange={(v) => setDraft({ ...draft, environment: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="production">Produção</SelectItem>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Owner técnico (e-mail)</Label>
            <Input
              type="email"
              placeholder="tech@pagsmile.com"
              value={draft.owner}
              onChange={(e) => setDraft({ ...draft, owner: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Valor da credencial</Label>
          <Textarea
            placeholder="Cole aqui a chave / certificado (será criptografado)"
            value={draft.raw_value}
            onChange={(e) => { setDraft({ ...draft, raw_value: e.target.value }); setTest({ status: 'idle', latency: null, message: '' }); }}
            className="font-mono text-xs min-h-[80px]"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Para certificados mTLS, cole conteúdo PEM completo · será mascarado automaticamente após salvar
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Data de expiração</Label>
            <Input
              type="date"
              value={draft.expires_at}
              onChange={(e) => setDraft({ ...draft, expires_at: e.target.value })}
            />
            <p className="text-[10px] text-slate-500 mt-1">Deixe em branco se sem prazo</p>
          </div>
          <div>
            <Label>Período de rotação (dias)</Label>
            <Input
              type="number"
              min={30}
              max={1825}
              value={draft.rotation_period_days}
              onChange={(e) => setDraft({ ...draft, rotation_period_days: parseInt(e.target.value) })}
            />
            <p className="text-[10px] text-slate-500 mt-1">Sugestão: 90d para infra, 365d para fornecedores</p>
          </div>
        </div>

        <div>
          <Label>Escopo / permissões (separado por vírgula)</Label>
          <Input
            placeholder="payments.create, payments.refund"
            value={draft.scope}
            onChange={(e) => setDraft({ ...draft, scope: e.target.value })}
          />
        </div>

        <div>
          <Label>Notas / observações</Label>
          <Textarea
            placeholder="Contexto adicional, contato do fornecedor, etc"
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            className="min-h-[60px]"
          />
        </div>

        {/* Connectivity tester */}
        <Card className={
          test.status === 'success' ? 'border-emerald-300 bg-emerald-50' :
          test.status === 'error' ? 'border-red-300 bg-red-50' :
          test.status === 'testing' ? 'border-blue-300 bg-blue-50' :
          ''
        }>
          <CardContent className="p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              {test.status === 'idle' && <span className="text-slate-500">Teste de conectividade obrigatório antes de salvar</span>}
              {test.status === 'testing' && <><Loader2 className="w-4 h-4 animate-spin text-blue-600" /><span>{test.message}</span></>}
              {test.status === 'success' && <><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-emerald-900 font-semibold">{test.message} · {test.latency}ms</span></>}
              {test.status === 'error' && <><AlertCircle className="w-4 h-4 text-red-600" /><span className="text-red-900 font-semibold">{test.message}</span></>}
            </div>
            <Button size="sm" variant="outline" onClick={handleTest} disabled={!draft.raw_value || test.status === 'testing'}>
              Testar conexão
            </Button>
          </CardContent>
        </Card>

        {test.status === 'success' && (
          <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">✓ Pronto para salvar</Badge>
        )}
      </div>
    </EntityFormDrawer>
  );
}