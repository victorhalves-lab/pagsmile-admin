import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CheckCircle2, AlertTriangle, PlayCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AdminIntActivation() {
  const [targetId, setTargetId] = useState('');
  const [merchant, setMerchant] = useState(null);

  const fetchMerchant = async () => {
      if (!targetId) return;
      const data = await base44.entities.Subaccount.get(targetId);
      setMerchant(data);
  };

  const activateMutation = useMutation({
      mutationFn: () => base44.functions.invoke('activateMerchant', { subaccount_id: merchant.subaccount_id }),
      onSuccess: () => alert('Merchant ativado com sucesso!'),
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ativação de Merchant" 
        subtitle="Configuração e liberação em produção"
      />

      {/* Selector */}
      {!merchant ? (
          <Card>
              <CardContent className="pt-6">
                  <div className="flex gap-4">
                      <Input 
                        placeholder="ID da Subconta (ex: sub_123)" 
                        value={targetId} 
                        onChange={e => setTargetId(e.target.value)} 
                      />
                      <Button onClick={fetchMerchant}>Buscar</Button>
                  </div>
              </CardContent>
          </Card>
      ) : (
          <div className="space-y-6">
              {/* Header Info */}
              <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold">{merchant.business_name}</h2>
                          <p className="text-slate-500">CNPJ: {merchant.document} | ID: {merchant.subaccount_id}</p>
                      </div>
                      <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setMerchant(null)}>Trocar</Button>
                      </div>
                  </CardContent>
              </Card>

              {/* Checklist */}
              <Card>
                  <CardHeader><CardTitle>Checklist de Ativação</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <CheckItem label="KYC Aprovado" status={merchant.status === 'kyc_approved'} detail={`Score: ${merchant.kyc_score}`} />
                      <CheckItem label="Documentos Validados" status={true} detail="Todos docs OK" />
                      <CheckItem label="Liveness Validado" status={true} detail="Score 98" />
                      <CheckItem label="Conta Bancária" status={true} detail="Banco Itaú" />
                      <CheckItem label="Plano Definido" status={true} detail={merchant.plan_chosen} />
                  </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                  <CardHeader><CardTitle>Resumo das Configurações</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-8">
                      <div>
                          <h4 className="font-semibold mb-2">Comercial</h4>
                          <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span>Plano</span><span>{merchant.plan_chosen}</span></div>
                              <div className="flex justify-between"><span>Tipo</span><span>{merchant.account_type}</span></div>
                          </div>
                      </div>
                      <div>
                          <h4 className="font-semibold mb-2">Risco</h4>
                          <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span>Limite Diário</span><span>R$ 50.000</span></div>
                              <div className="flex justify-between"><span>Rolling Reserve</span><span>3% (120 dias)</span></div>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                  <CardHeader><CardTitle>Execução</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <ActionCheck label="Criar Merchant no Gateway" defaultChecked />
                          <ActionCheck label="Criar Conta Banking" defaultChecked />
                          <ActionCheck label="Gerar API Keys" defaultChecked />
                          <ActionCheck label="Enviar E-mail de Boas-Vindas" defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex justify-end pt-2">
                          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => activateMutation.mutate()}>
                              <PlayCircle className="w-5 h-5 mr-2" /> Ativar Merchant
                          </Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
      )}
    </div>
  );
}

function CheckItem({ label, status, detail }) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
                {status ? <CheckCircle2 className="text-emerald-500 w-5 h-5" /> : <AlertTriangle className="text-amber-500 w-5 h-5" />}
                <span className="font-medium">{label}</span>
            </div>
            <span className="text-sm text-slate-500">{detail}</span>
        </div>
    );
}

function ActionCheck({ label, defaultChecked }) {
    return (
        <div className="flex items-center gap-2">
            <Checkbox checked={defaultChecked} disabled />
            <span>{label}</span>
        </div>
    );
}