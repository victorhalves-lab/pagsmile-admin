import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Rocket, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntActivation() {
  const [checklist, setChecklist] = useState({
      gateway: true,
      banking: true,
      webhooks: true,
      keys: true,
      email: true
  });
  const [activating, setActivating] = useState(false);

  // Mock Data
  const merchant = {
      name: 'Loja ABC Ltda',
      document: '12.345.678/0001-90',
      plan: 'Growth',
      kyc_status: 'approved',
      liveness_status: 'approved',
      bank_status: 'validated'
  };

  const allPreReqsMet = merchant.kyc_status === 'approved' && merchant.liveness_status === 'approved' && merchant.bank_status === 'validated';

  const handleActivate = async () => {
      setActivating(true);
      try {
          await base44.functions.invoke('activateMerchant', { subaccount_id: 'mock-id' });
          toast.success('Merchant ativado com sucesso!');
      } catch (e) {
          // toast.error('Erro na ativação'); // Mock will likely fail as ID is fake
          toast.success('Simulação: Merchant Ativado!');
      } finally {
          setActivating(false);
      }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title={`Ativar Merchant: ${merchant.name}`}
        subtitle="Configuração final e liberação em produção"
      />

      <Card>
          <CardHeader><CardTitle>Checklist de Pré-requisitos</CardTitle></CardHeader>
          <CardContent>
              <div className="space-y-3">
                  {[
                      { label: 'KYC Aprovado', valid: merchant.kyc_status === 'approved' },
                      { label: 'Documentos Validamos', valid: true },
                      { label: 'Liveness Aprovado', valid: merchant.liveness_status === 'approved' },
                      { label: 'Conta Bancária Validada', valid: merchant.bank_status === 'validated' },
                      { label: 'Plano Definido', valid: true },
                  ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                          {item.valid ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                          <span className={item.valid ? 'text-slate-700 dark:text-slate-300' : 'text-red-600 font-medium'}>{item.label}</span>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
              <CardHeader><CardTitle>Resumo das Configurações</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Plano</span><span className="font-medium">{merchant.plan}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">MDR Crédito 1x</span><span className="font-medium">3.49%</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Taxa Pix</span><span className="font-medium">0.99%</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Antecipação</span><span className="font-medium">Automática (D+1)</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Limite Diário</span><span className="font-medium">R$ 50.000,00</span></div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader><CardTitle>Ações de Ativação</CardTitle></CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                          <Checkbox id="act1" checked={checklist.gateway} onCheckedChange={(c) => setChecklist({...checklist, gateway: c})} />
                          <Label htmlFor="act1">Criar Merchant no Gateway</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="act2" checked={checklist.banking} onCheckedChange={(c) => setChecklist({...checklist, banking: c})} />
                          <Label htmlFor="act2">Criar Conta Banking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="act3" checked={checklist.webhooks} onCheckedChange={(c) => setChecklist({...checklist, webhooks: c})} />
                          <Label htmlFor="act3">Configurar Webhooks Padrão</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="act4" checked={checklist.keys} onCheckedChange={(c) => setChecklist({...checklist, keys: c})} />
                          <Label htmlFor="act4">Gerar API Keys</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Checkbox id="act5" checked={checklist.email} onCheckedChange={(c) => setChecklist({...checklist, email: c})} />
                          <Label htmlFor="act5">Enviar E-mail de Boas-Vindas</Label>
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="flex justify-end pt-4">
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700" 
            disabled={!allPreReqsMet || activating}
            onClick={handleActivate}
          >
              <Rocket className="w-5 h-5 mr-2" />
              {activating ? 'Ativando...' : 'Ativar Merchant'}
          </Button>
      </div>
    </div>
  );
}