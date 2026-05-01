import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Wallet,
  QrCode,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  Download,
  Calendar,
  Eye,
  EyeOff,
  Calculator,
  Receipt,
  Table2,
  Info,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';

export default function Fees() {
  const [showValues, setShowValues] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('taxas');
  
  // Simulador states
  const [simAmount, setSimAmount] = useState('1000');
  const [simInstallments, setSimInstallments] = useState('1');
  const [simBrand, setSimBrand] = useState('visa');

  const formatCurrency = (value, hide = false) => {
    if (hide && !showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // ==================== TAXAS (MDR) ====================
  const taxasMDR = {
    vista: {
      visa: 2.99,
      mastercard: 2.99,
      elo: 3.19,
      amex: 3.49,
      hipercard: 3.29
    },
    parcelado2a6: {
      visa: 3.49,
      mastercard: 3.49,
      elo: 3.69,
      amex: 3.99,
      hipercard: 3.79
    },
    parcelado7a12: {
      visa: 3.99,
      mastercard: 3.99,
      elo: 4.19,
      amex: 4.49,
      hipercard: 4.29
    },
    debito: {
      visa: 1.99,
      mastercard: 1.99,
      elo: 2.19
    },
    pix: 0.99
  };

  const taxaAntecipacao = 1.99; // % ao mês

  // Tabela completa 1-12x com antecipação
  const generateInstallmentTable = () => {
    const rows = [];
    for (let i = 1; i <= 12; i++) {
      let mdr;
      if (i === 1) mdr = taxasMDR.vista.visa;
      else if (i <= 6) mdr = taxasMDR.parcelado2a6.visa;
      else mdr = taxasMDR.parcelado7a12.visa;

      // Prazo médio de recebimento em dias (D+30 para cada parcela)
      const prazoMedioDias = i === 1 ? 30 : Math.round((30 + 30 * i) / 2);
      
      // Custo de antecipação para D+1
      const diasAntecipados = prazoMedioDias - 1;
      const custoAntecipacaoMensal = taxaAntecipacao;
      const custoAntecipacaoTotal = (diasAntecipados / 30) * custoAntecipacaoMensal;
      
      const custoEfetivoTotal = mdr + custoAntecipacaoTotal;

      rows.push({
        parcelas: i,
        mdr: mdr,
        prazoMedio: prazoMedioDias,
        custoAntecipacao: custoAntecipacaoTotal,
        custoEfetivoTotal: custoEfetivoTotal
      });
    }
    return rows;
  };

  const installmentTable = generateInstallmentTable();

  // ==================== TARIFAS (FIXAS) ====================
  const tarifasFixas = [
    { categoria: 'Gateway', nome: 'Gateway - Transação Aprovada', valor: 0.49, tipo: 'por_transacao' },
    { categoria: 'Gateway', nome: 'Gateway - Transação Recusada', valor: 0.00, tipo: 'por_transacao' },
    { categoria: '3DS', nome: 'Autenticação 3D Secure', valor: 0.30, tipo: 'por_transacao' },
    { categoria: 'Antifraude', nome: 'Antifraude - Cartão', valor: 0.70, tipo: 'por_transacao' },
    { categoria: 'Antifraude', nome: 'Antifraude - PIX', valor: 0.08, tipo: 'por_transacao' },
    { categoria: 'Pré-Chargeback', nome: 'Taxa de Pré-Chargeback (alerta Ethoca/Verifi)', valor: 8.00, tipo: 'por_ocorrencia' },
    { categoria: 'Chargeback', nome: 'Multa por Chargeback', valor: 30.00, tipo: 'por_ocorrencia' },
    { categoria: 'Saques', nome: 'Saque via TED', valor: 3.90, tipo: 'por_operacao' },
    { categoria: 'Saques', nome: 'Saque via PIX', valor: 0.00, tipo: 'por_operacao' },
    { categoria: 'Estornos', nome: 'Estorno/Cancelamento', valor: 0.00, tipo: 'por_operacao' },
    { categoria: 'Boleto', nome: 'Emissão de Boleto', valor: 2.90, tipo: 'por_boleto' },
    { categoria: 'Boleto', nome: 'Boleto Compensado', valor: 0.00, tipo: 'por_boleto' },
  ];

  // Simulação de venda
  const calculateSimulation = () => {
    const amount = parseFloat(simAmount) || 0;
    const installments = parseInt(simInstallments) || 1;
    
    let mdr;
    if (installments === 1) mdr = taxasMDR.vista[simBrand] || taxasMDR.vista.visa;
    else if (installments <= 6) mdr = taxasMDR.parcelado2a6[simBrand] || taxasMDR.parcelado2a6.visa;
    else mdr = taxasMDR.parcelado7a12[simBrand] || taxasMDR.parcelado7a12.visa;

    const valorMDR = amount * (mdr / 100);
    const tarifaGateway = 0.49;
    const tarifa3DS = 0.30;
    const tarifaAntifraude = 0.70;
    
    // Antecipação
    const prazoMedioDias = installments === 1 ? 30 : Math.round((30 + 30 * installments) / 2);
    const diasAntecipados = prazoMedioDias - 1;
    const custoAntecipacaoPercent = (diasAntecipados / 30) * taxaAntecipacao;
    const valorAntecipacao = amount * (custoAntecipacaoPercent / 100);

    const custoTotal = valorMDR + tarifaGateway + tarifa3DS + tarifaAntifraude + valorAntecipacao;
    const valorLiquido = amount - custoTotal;
    const percentualEfetivo = (custoTotal / amount) * 100;

    return {
      valorBruto: amount,
      mdr: mdr,
      valorMDR,
      tarifaGateway,
      tarifa3DS,
      tarifaAntifraude,
      custoAntecipacaoPercent,
      valorAntecipacao,
      custoTotal,
      valorLiquido,
      percentualEfetivo,
      prazoMedioDias
    };
  };

  const simulation = calculateSimulation();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tarifas e Taxas"
        subtitle="Visualize suas taxas negociadas, tarifas e simule custos"
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Tarifas e Taxas', page: 'Fees' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowValues(!showValues)}
            >
              {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* Tabs principais: Taxas vs Tarifas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
          <TabsTrigger value="taxas" className="text-base gap-2 data-[state=active]:bg-[#00D26A] data-[state=active]:text-white">
            <Percent className="w-4 h-4" />
            Taxas (MDR)
          </TabsTrigger>
          <TabsTrigger value="tarifas" className="text-base gap-2 data-[state=active]:bg-[#00D26A] data-[state=active]:text-white">
            <Receipt className="w-4 h-4" />
            Tarifas (Fixas)
          </TabsTrigger>
        </TabsList>

        {/* ==================== ABA TAXAS (MDR) ==================== */}
        <TabsContent value="taxas" className="space-y-6">
          
          {/* Cards de Taxas por Modalidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Crédito à Vista */}
            <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Crédito à Vista</p>
                    <p className="text-xs text-slate-400">1x no cartão</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Visa/Master</span>
                    <Badge className="bg-blue-600 text-white">{formatPercent(taxasMDR.vista.visa)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Elo</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.vista.elo)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Amex</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.vista.amex)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parcelado 2-6x */}
            <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Parcelado 2-6x</p>
                    <p className="text-xs text-slate-400">Crédito parcelado</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Visa/Master</span>
                    <Badge className="bg-orange-600 text-white">{formatPercent(taxasMDR.parcelado2a6.visa)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Elo</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.parcelado2a6.elo)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Amex</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.parcelado2a6.amex)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parcelado 7-12x */}
            <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Parcelado 7-12x</p>
                    <p className="text-xs text-slate-400">Crédito parcelado</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Visa/Master</span>
                    <Badge className="bg-purple-600 text-white">{formatPercent(taxasMDR.parcelado7a12.visa)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Elo</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.parcelado7a12.elo)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Amex</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.parcelado7a12.amex)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Débito e PIX */}
            <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Débito & PIX</p>
                    <p className="text-xs text-slate-400">Pagamento à vista</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Débito Visa/Master</span>
                    <Badge className="bg-emerald-600 text-white">{formatPercent(taxasMDR.debito.visa)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Débito Elo</span>
                    <Badge variant="outline">{formatPercent(taxasMDR.debito.elo)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">PIX</span>
                    <Badge className="bg-[#00D26A] text-white">{formatPercent(taxasMDR.pix)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela Completa 1-12x com Antecipação */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Table2 className="w-5 h-5 text-slate-600" />
                    Tabela Completa de Taxas (1-12x) com Antecipação
                  </CardTitle>
                  <CardDescription>
                    Custo efetivo total considerando MDR + Antecipação para D+1 (Taxa de antecipação: {formatPercent(taxaAntecipacao)} a.m.)
                  </CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="w-4 h-4 text-slate-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>O custo efetivo total considera o MDR da transação mais o custo de antecipação para receber em D+1 ao invés do prazo padrão.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold">Parcelas</TableHead>
                      <TableHead className="font-semibold text-center">MDR</TableHead>
                      <TableHead className="font-semibold text-center">Prazo Médio</TableHead>
                      <TableHead className="font-semibold text-center">Custo Antecipação</TableHead>
                      <TableHead className="font-semibold text-center bg-slate-100">Custo Efetivo Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installmentTable.map((row) => (
                      <TableRow key={row.parcelas} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="font-mono">
                            {row.parcelas}x
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-blue-600">{formatPercent(row.mdr)}</span>
                        </TableCell>
                        <TableCell className="text-center text-slate-500">
                          D+{row.prazoMedio}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-orange-600">{formatPercent(row.custoAntecipacao)}</span>
                        </TableCell>
                        <TableCell className="text-center bg-slate-50">
                          <Badge className={cn(
                            "font-mono font-bold",
                            row.custoEfetivoTotal <= 4 ? "bg-emerald-100 text-emerald-700" :
                            row.custoEfetivoTotal <= 6 ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {formatPercent(row.custoEfetivoTotal)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Simulador de Venda */}
          <Card className="border-2 border-[#00D26A]/20 bg-gradient-to-br from-[#00D26A]/5 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#00D26A]" />
                Simulador de Venda
              </CardTitle>
              <CardDescription>
                Calcule o custo total e valor líquido de uma venda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Valor da Venda</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                      <Input
                        type="number"
                        value={simAmount}
                        onChange={(e) => setSimAmount(e.target.value)}
                        className="pl-10 text-lg font-semibold"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Parcelas</Label>
                    <Select value={simInstallments} onValueChange={setSimInstallments}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                          <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bandeira</Label>
                    <Select value={simBrand} onValueChange={setSimBrand}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="elo">Elo</SelectItem>
                        <SelectItem value="amex">Amex</SelectItem>
                        <SelectItem value="hipercard">Hipercard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Resultado */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <p className="text-slate-400 text-sm mb-1">Valor Líquido</p>
                  <p className="text-4xl font-bold text-[#00D26A] mb-6">
                    {formatCurrency(simulation.valorLiquido)}
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valor Bruto</span>
                      <span>{formatCurrency(simulation.valorBruto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">MDR ({formatPercent(simulation.mdr)})</span>
                      <span className="text-red-400">-{formatCurrency(simulation.valorMDR)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tarifa Gateway</span>
                      <span className="text-red-400">-{formatCurrency(simulation.tarifaGateway)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Autenticação 3DS</span>
                      <span className="text-red-400">-{formatCurrency(simulation.tarifa3DS)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Antifraude</span>
                      <span className="text-red-400">-{formatCurrency(simulation.tarifaAntifraude)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Antecipação D+1 ({formatPercent(simulation.custoAntecipacaoPercent)})</span>
                      <span className="text-red-400">-{formatCurrency(simulation.valorAntecipacao)}</span>
                    </div>
                    <div className="border-t border-slate-700 pt-3 flex justify-between font-semibold">
                      <span>Custo Efetivo Total</span>
                      <span className="text-amber-400">{formatPercent(simulation.percentualEfetivo)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== ABA TARIFAS (FIXAS) ==================== */}
        <TabsContent value="tarifas" className="space-y-6">
          
          {/* Cards resumo - todas as tarifas operacionais visíveis */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="w-4 h-4" />
                  <p className="text-slate-300 text-xs font-medium">Gateway</p>
                </div>
                <p className="text-xl font-bold">{formatCurrency(0.49)}</p>
                <p className="text-[10px] text-slate-400 mt-1">Por transação aprovada</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <p className="text-slate-700 text-xs font-medium">3DS</p>
                </div>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(0.30)}</p>
                <p className="text-[10px] text-slate-500 mt-1">Autenticação 3D Secure</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <p className="text-slate-700 text-xs font-medium">Antifraude Cartão</p>
                </div>
                <p className="text-xl font-bold text-orange-700">{formatCurrency(0.70)}</p>
                <p className="text-[10px] text-slate-500 mt-1">Por análise em cartão</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <p className="text-slate-700 text-xs font-medium">Antifraude PIX</p>
                </div>
                <p className="text-xl font-bold text-emerald-700">{formatCurrency(0.08)}</p>
                <p className="text-[10px] text-slate-500 mt-1">Por análise em PIX</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <p className="text-slate-700 text-xs font-medium">Pré-Chargeback</p>
                </div>
                <p className="text-xl font-bold text-amber-700">{formatCurrency(8.00)}</p>
                <p className="text-[10px] text-slate-500 mt-1">Por alerta Ethoca/Verifi</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <p className="text-slate-700 text-xs font-medium">Chargeback</p>
                </div>
                <p className="text-xl font-bold text-red-700">{formatCurrency(30.00)}</p>
                <p className="text-[10px] text-slate-500 mt-1">Multa por chargeback</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Tarifas por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-600" />
                Tabela Completa de Tarifas
              </CardTitle>
              <CardDescription>
                Todas as tarifas fixas aplicáveis às suas operações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Categoria</TableHead>
                    <TableHead className="font-semibold">Descrição</TableHead>
                    <TableHead className="font-semibold text-center">Tipo</TableHead>
                    <TableHead className="font-semibold text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tarifasFixas.map((tarifa, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50">
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {tarifa.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">
                        {tarifa.nome}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs text-slate-500">
                          {tarifa.tipo === 'por_transacao' ? 'Por transação' :
                           tarifa.tipo === 'por_operacao' ? 'Por operação' :
                           tarifa.tipo === 'por_ocorrencia' ? 'Por ocorrência' :
                           'Por boleto'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {tarifa.valor === 0 ? (
                          <Badge className="bg-emerald-100 text-emerald-700">Grátis</Badge>
                        ) : (
                          <span className="font-semibold text-slate-900">{formatCurrency(tarifa.valor)}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Nota sobre Antecipação */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Taxa de Antecipação</p>
                  <p className="text-sm text-amber-800 mb-3">
                    A taxa de antecipação é de <strong>{formatPercent(taxaAntecipacao)} ao mês</strong> sobre o valor antecipado.
                    Ela é calculada proporcionalmente ao número de dias antecipados.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      <Calculator className="w-4 h-4 mr-2" />
                      Simular Antecipação
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}