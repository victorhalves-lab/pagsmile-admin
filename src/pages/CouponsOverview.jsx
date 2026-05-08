import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TicketPercent, Plus, ArrowRight, Megaphone, FileUp, Layers,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar,
} from 'recharts';
import { mockCoupons, mockCouponUsageOverTime } from '@/components/mockData/couponMocks';

import CouponsKpiBar from '@/components/coupons/overview/CouponsKpiBar';
import CouponsAnomalyCard from '@/components/coupons/overview/CouponsAnomalyCard';
import CouponsConversionFunnel from '@/components/coupons/overview/CouponsConversionFunnel';
import CouponsTypeStatusMatrix from '@/components/coupons/overview/CouponsTypeStatusMatrix';
import CouponsTopBottom from '@/components/coupons/overview/CouponsTopBottom';
import CouponsActiveNow from '@/components/coupons/overview/CouponsActiveNow';
import CouponsPeriodSelector from '@/components/coupons/overview/CouponsPeriodSelector';

export default function CouponsOverview() {
  const [period, setPeriod] = useState('30d');
  const totalDiscount = mockCoupons.reduce((s, c) => s + c.total_discount_given, 0);
  const totalRevenue = mockCoupons.reduce((s, c) => s + c.total_revenue_generated, 0);

  // MoM mock
  const lastMonth = mockCouponUsageOverTime[mockCouponUsageOverTime.length - 1];
  const prevMonth = mockCouponUsageOverTime[mockCouponUsageOverTime.length - 2];
  const momDelta = prevMonth ? (((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Promoções e Cupons"
        subtitle="Gerencie cupons, campanhas e promoções como ferramentas de growth"
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'Promoções' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <CouponsPeriodSelector value={period} onChange={setPeriod} />
            <Button variant="outline" size="sm">
              <FileUp className="w-4 h-4 mr-1.5" />
              Importar CSV
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-1.5" />
              Pacote único
            </Button>
            <Button variant="outline" size="sm">
              <Megaphone className="w-4 h-4 mr-1.5" />
              Nova campanha
            </Button>
            <Link to={createPageUrl('CouponForm')}>
              <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]">
                <Plus className="w-4 h-4 mr-1.5" />
                Criar cupom
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Bar nova com sparklines + variação */}
      <CouponsKpiBar coupons={mockCoupons} onCardClick={(filterKey) => {
        // Em prod redirecionaria para list com filtro pré-aplicado
        console.log('Filter:', filterKey);
      }} />

      {/* Anomalias / Recomendações IA */}
      <CouponsAnomalyCard coupons={mockCoupons} />

      {/* Linha 1: Funil + Receita ao longo do tempo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <CouponsConversionFunnel coupons={mockCoupons} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Desconto vs Receita</span>
              <span className="text-[10px] font-normal text-emerald-600">
                MoM {momDelta >= 0 ? '↑' : '↓'} {Math.abs(momDelta)}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockCouponUsageOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#2bc196" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="discount" name="Desconto" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Linha 2: Matriz tipo×status (substitui pies) + Top 5 receita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <CouponsTypeStatusMatrix coupons={mockCoupons} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top 5 Cupons por Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[...mockCoupons]
                  .sort((a, b) => b.total_revenue_generated - a.total_revenue_generated)
                  .slice(0, 5)
                  .map((c) => ({ name: c.code, receita: c.total_revenue_generated, desconto: c.total_discount_given }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="receita" name="Receita" fill="#2bc196" radius={[0, 4, 4, 0]} />
                <Bar dataKey="desconto" name="Desconto" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Linha 3: Top performers + Bottom 5 */}
      <CouponsTopBottom coupons={mockCoupons} />

      {/* Linha 4: Mais ativos agora + Recentes */}
      <CouponsActiveNow coupons={mockCoupons} />

      <div className="flex justify-end">
        <Link to={createPageUrl('CouponList')}>
          <Button variant="outline" size="sm">
            Ver todos os cupons <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}