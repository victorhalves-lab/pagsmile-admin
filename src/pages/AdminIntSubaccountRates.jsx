import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, AlertTriangle, Info, Percent } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminIntSubaccountRates() {
  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const { data: subaccount, isLoading } = useQuery({
    queryKey: ['subaccount_rates', subaccountId],
    queryFn: async () => {
      const mockSubaccounts = [
        { id: 'sub1', business_name: 'Loja Fashion Store', document: '11.111.111/1111-11', rates: { mdr_credit: 2.99, mdr_debit: 1.99, mdr_pix: 0.99, fixed_fee_card: 0.10, fixed_fee_pix: 0.00, anticipation_rate: 1.89 } },
        { id: 'sub2', business_name: 'Tech Gadgets Pro', document: '22.222.222/2222-22', rates: { mdr_credit: 3.49, mdr_debit: 2.29, mdr_pix: 1.19, fixed_fee_card: 0.15, fixed_fee_pix: 0.00, anticipation_rate: 2.19 } },
        { id: 'sub3', business_name: 'Artesanato Brasil', document: '33.333.333/3333-33', rates: { mdr_credit: 2.79, mdr_debit: 1.79, mdr_pix: 0.79, fixed_fee_card: 0.10, fixed_fee_pix: 0.00, anticipation_rate: 1.69 } },
        { id: 'sub4', business_name: 'Gourmet Foods', document: '44.444.444/4444-44', rates: { mdr_credit: 3.19, mdr_debit: 2.09, mdr_pix: 0.99, fixed_fee_card: 0.12, fixed_fee_pix: 0.00, anticipation_rate: 1.99 } },
      ];
      return mockSubaccounts.find(sub => sub.id === subaccountId) || {};
    },
    enabled: !!subaccountId,
  });

  const [rates, setRates] = useState({
    mdr_credit: '',
    mdr_debit: '',
    mdr_pix: '',
    fixed_fee_card: '',
    fixed_fee_pix: '',
    anticipation_rate: '',
  });

  React.useEffect(() => {
    if (subaccount?.rates) {
      setRates(subaccount.rates);
    }
  }, [subaccount]);

  const handleChange = (field, value) => {
    setRates(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    alert('Taxas salvas com sucesso! (simulação)');
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
        title={`Alterar Taxas: ${subaccount.business_name}`}
        subtitle={subaccount.document}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Subcontas', page: 'AdminIntSubaccounts' },
          { label: 'Alterar Taxas' }
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
        {/* Taxas de Cartão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-primary" />
              Taxas de Cartão (MDR)
            </CardTitle>
            <CardDescription>Configure as taxas para transações com cartão</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mdr_credit">MDR Crédito (%)</Label>
              <Input
                id="mdr_credit"
                type="number"
                step="0.01"
                value={rates.mdr_credit}
                onChange={(e) => handleChange('mdr_credit', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mdr_debit">MDR Débito (%)</Label>
              <Input
                id="mdr_debit"
                type="number"
                step="0.01"
                value={rates.mdr_debit}
                onChange={(e) => handleChange('mdr_debit', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fixed_fee_card">Taxa Fixa por Transação (R$)</Label>
              <Input
                id="fixed_fee_card"
                type="number"
                step="0.01"
                value={rates.fixed_fee_card}
                onChange={(e) => handleChange('fixed_fee_card', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Taxas de PIX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-emerald-600" />
              Taxas de PIX
            </CardTitle>
            <CardDescription>Configure as taxas para transações PIX</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mdr_pix">MDR PIX (%)</Label>
              <Input
                id="mdr_pix"
                type="number"
                step="0.01"
                value={rates.mdr_pix}
                onChange={(e) => handleChange('mdr_pix', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fixed_fee_pix">Taxa Fixa PIX (R$)</Label>
              <Input
                id="fixed_fee_pix"
                type="number"
                step="0.01"
                value={rates.fixed_fee_pix}
                onChange={(e) => handleChange('fixed_fee_pix', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anticipation_rate">Taxa de Antecipação (%)</Label>
              <Input
                id="anticipation_rate"
                type="number"
                step="0.01"
                value={rates.anticipation_rate}
                onChange={(e) => handleChange('anticipation_rate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo das Taxas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Taxas Configuradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Taxa (%)</TableHead>
                <TableHead>Taxa Fixa (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Crédito</TableCell>
                <TableCell>{rates.mdr_credit}%</TableCell>
                <TableCell>R$ {rates.fixed_fee_card?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Débito</TableCell>
                <TableCell>{rates.mdr_debit}%</TableCell>
                <TableCell>R$ {rates.fixed_fee_card?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">PIX</TableCell>
                <TableCell>{rates.mdr_pix}%</TableCell>
                <TableCell>R$ {rates.fixed_fee_pix?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Antecipação</TableCell>
                <TableCell>{rates.anticipation_rate}%</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              As novas taxas serão aplicadas apenas para transações futuras.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" /> Salvar Taxas
        </Button>
      </div>
    </div>
  );
}