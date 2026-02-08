import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';

export default function AdminIntSubaccountLimits() {
  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const { data: subaccount, isLoading } = useQuery({
    queryKey: ['subaccount_limits', subaccountId],
    queryFn: async () => {
      const mockSubaccounts = [
        { id: 'sub1', business_name: 'Loja Fashion Store', document: '11.111.111/1111-11', limits: { per_transaction: 5000, daily: 50000, monthly: 500000, pix_per_transaction: 10000, pix_daily: 100000 } },
        { id: 'sub2', business_name: 'Tech Gadgets Pro', document: '22.222.222/2222-22', limits: { per_transaction: 2000, daily: 20000, monthly: 200000, pix_per_transaction: 5000, pix_daily: 50000 } },
        { id: 'sub3', business_name: 'Artesanato Brasil', document: '33.333.333/3333-33', limits: { per_transaction: 3000, daily: 30000, monthly: 300000, pix_per_transaction: 8000, pix_daily: 80000 } },
        { id: 'sub4', business_name: 'Gourmet Foods', document: '44.444.444/4444-44', limits: { per_transaction: 1500, daily: 15000, monthly: 150000, pix_per_transaction: 3000, pix_daily: 30000 } },
      ];
      return mockSubaccounts.find(sub => sub.id === subaccountId) || {};
    },
    enabled: !!subaccountId,
  });

  const [limits, setLimits] = useState({
    per_transaction: '',
    daily: '',
    monthly: '',
    pix_per_transaction: '',
    pix_daily: '',
  });

  React.useEffect(() => {
    if (subaccount?.limits) {
      setLimits(subaccount.limits);
    }
  }, [subaccount]);

  const handleChange = (field, value) => {
    setLimits(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    alert('Limites salvos com sucesso! (simulação)');
  };

  if (isLoading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  if (!subaccount?.id) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Subconta não encontrada.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Alterar Limites: ${subaccount.business_name}`}
        subtitle={subaccount.document}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Subcontas', page: 'AdminIntSubaccounts' },
          { label: 'Alterar Limites' }
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link to={createPageUrl('AdminIntSubaccounts')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Limites de Cartão */}
        <Card>
          <CardHeader>
            <CardTitle>Limites de Cartão</CardTitle>
            <CardDescription>Configure os limites para transações com cartão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="per_transaction">Limite por Transação (R$)</Label>
              <Input
                id="per_transaction"
                type="number"
                value={limits.per_transaction}
                onChange={(e) => handleChange('per_transaction', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="daily">Limite Diário (R$)</Label>
              <Input
                id="daily"
                type="number"
                value={limits.daily}
                onChange={(e) => handleChange('daily', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Limite Mensal (R$)</Label>
              <Input
                id="monthly"
                type="number"
                value={limits.monthly}
                onChange={(e) => handleChange('monthly', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Limites de PIX */}
        <Card>
          <CardHeader>
            <CardTitle>Limites de PIX</CardTitle>
            <CardDescription>Configure os limites para transações PIX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pix_per_transaction">Limite por Transação PIX (R$)</Label>
              <Input
                id="pix_per_transaction"
                type="number"
                value={limits.pix_per_transaction}
                onChange={(e) => handleChange('pix_per_transaction', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pix_daily">Limite Diário PIX (R$)</Label>
              <Input
                id="pix_daily"
                type="number"
                value={limits.pix_daily}
                onChange={(e) => handleChange('pix_daily', e.target.value)}
              />
            </div>

            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Alterações nos limites podem levar até 5 minutos para serem aplicadas.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Limites
        </Button>
      </div>
    </div>
  );
}