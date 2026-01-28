import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Calendar, Clock, CheckCircle, XCircle, Banknote, Lock, Unlock
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// Mock data
const financialKPIs = {
  saldoTotalMerchants: 8750000,
  saldoRetido: 1250000,
  saldoDisponivel: 7500000,
  liquidarHoje: 2340000,
  saquesPendentes: { count: 23, value: 890000 },
  sacadoHoje: 1560000
};

const recebivelAgenda = [
  { date: '28/01', bruto: 2340000, taxas: 81900, liquido: 2258100, merchants: 156 },
  { date: '29/01', bruto: 1890000, taxas: 66150, liquido: 1823850, merchants: 142 },
  { date: '30/01', bruto: 2150000, taxas: 75250, liquido: 2074750, merchants: 148 },
  { date: '31/01', bruto: 1980000, taxas: 69300, liquido: 1910700, merchants: 138 },
  { date: '01/02', bruto: 2450000, taxas: 85750, liquido: 2364250, merchants: 162 },
  { date: '03/02', bruto: 2120000, taxas: 74200, liquido: 2045800, merchants: 145 },
  { date: '04/02', bruto: 1950000, taxas: 68250, liquido: 1881750, merchants: 135 }
];

const saquesPendentes = [
  { id: 'SAQ-001', merchant: 'Loja ABC', value: 45000, bank: 'Itaú', status: 'pending', requestedAt: '28/01 10:30' },
  { id: 'SAQ-002', merchant: 'Tech Store', value: 128000, bank: 'Bradesco', status: 'pending', requestedAt: '28/01 09:45' },
  { id: 'SAQ-003', merchant: 'Fashion Shop', value: 67500, bank: 'Santander', status: 'pending', requestedAt: '28/01 09:15' },
  { id: 'SAQ-004', merchant: 'Marketplace X', value: 234000, bank: 'Itaú', status: 'pending', requestedAt: '28/01 08:30' },
  { id: 'SAQ-005', merchant: 'Store 123', value: 18500, bank: 'Nubank', status: 'pending', requestedAt: '27/01 18:45' }
];

function FinancialKPICard({ title, value, subtitle, icon: Icon, trend, trendValue, variant = 'default' }) {
  const variants = {
    default: 'border-slate-200',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-amber-200 bg-amber-50/50',
    danger: 'border-red-200 bg-red-50/50'
  };

  return (
    <Card className={`${variants[variant]}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${variant === 'success' ? 'bg-green-100' : variant === 'warning' ? 'bg-amber-100' : variant === 'danger' ? 'bg-red-100' : 'bg-slate-100'}`}>
            <Icon className={`w-6 h-6 ${variant === 'success' ? 'text-green-600' : variant === 'warning' ? 'text-amber-600' : variant === 'danger' ? 'text-red-600' : 'text-slate-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialView() {
  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FinancialKPICard 
          title="Saldo Total Merchants" 
          value={financialKPIs.saldoTotalMerchants}
          subtitle="Disponível + Retido"
          icon={Wallet}
        />
        <FinancialKPICard 
          title="Saldo Disponível" 
          value={financialKPIs.saldoDisponivel}
          subtitle="Pronto para saque"
          icon={Unlock}
          variant="success"
        />
        <FinancialKPICard 
          title="Saldo Retido" 
          value={financialKPIs.saldoRetido}
          subtitle="Rolling Reserve"
          icon={Lock}
          variant="warning"
        />
        <FinancialKPICard 
          title="A Liquidar Hoje" 
          value={financialKPIs.liquidarHoje}
          subtitle="Cartão D+30, PIX D+0"
          icon={Calendar}
        />
        <FinancialKPICard 
          title="Saques Pendentes" 
          value={financialKPIs.saquesPendentes.value}
          subtitle={`${financialKPIs.saquesPendentes.count} solicitações`}
          icon={Clock}
          variant="warning"
        />
        <FinancialKPICard 
          title="Sacado Hoje" 
          value={financialKPIs.sacadoHoje}
          subtitle="Já executados"
          icon={Banknote}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda de Recebíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Agenda de Recebíveis (Cartão)
            </CardTitle>
            <CardDescription>Próximos 7 dias de liquidação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recebivelAgenda}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="liquido" name="Valor Líquido" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-slate-500">Data</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Bruto</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Taxas</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Líquido</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Merchants</th>
                  </tr>
                </thead>
                <tbody>
                  {recebivelAgenda.slice(0, 5).map((row) => (
                    <tr key={row.date} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-2 px-2 font-medium">{row.date}</td>
                      <td className="text-right py-2 px-2">{formatCurrency(row.bruto)}</td>
                      <td className="text-right py-2 px-2 text-red-500">-{formatCurrency(row.taxas)}</td>
                      <td className="text-right py-2 px-2 font-medium text-green-600">{formatCurrency(row.liquido)}</td>
                      <td className="text-right py-2 px-2">{row.merchants}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Fila de Saques */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Banknote className="w-5 h-5 text-green-500" />
                Fila de Saques Pendentes
              </CardTitle>
              <CardDescription>{saquesPendentes.length} solicitações aguardando aprovação</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <XCircle className="w-4 h-4 mr-1" />
                Rejeitar
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-1" />
                Aprovar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {saquesPendentes.map((saque) => (
                <div key={saque.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-slate-300" />
                    <div>
                      <p className="font-medium text-sm">{saque.merchant}</p>
                      <p className="text-xs text-slate-500">{saque.id} • {saque.bank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(saque.value)}</p>
                    <p className="text-xs text-slate-500">{saque.requestedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}