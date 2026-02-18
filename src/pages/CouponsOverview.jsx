import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TicketPercent,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ArrowRight,
  Tag,
  Percent,
  Hash
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockCoupons, mockCouponUsageOverTime } from '@/components/mockData/couponMocks';

const COLORS = ['#2bc196', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CouponsOverview() {
  const activeCoupons = mockCoupons.filter(c => c.status === 'active');
  const totalDiscountGiven = mockCoupons.reduce((sum, c) => sum + c.total_discount_given, 0);
  const totalRevenueGenerated = mockCoupons.reduce((sum, c) => sum + c.total_revenue_generated, 0);
  const totalUsages = mockCoupons.reduce((sum, c) => sum + c.times_used, 0);
  const nominalCoupons = mockCoupons.filter(c => c.is_nominal).length;

  const typeDistribution = [
    { name: 'Percentual', value: mockCoupons.filter(c => c.type === 'percentage').length },
    { name: 'Valor Fixo', value: mockCoupons.filter(c => c.type === 'fixed_amount').length },
  ];

  const statusDistribution = [
    { name: 'Ativos', value: mockCoupons.filter(c => c.status === 'active').length, color: '#2bc196' },
    { name: 'Inativos', value: mockCoupons.filter(c => c.status === 'inactive').length, color: '#94a3b8' },
    { name: 'Expirados', value: mockCoupons.filter(c => c.status === 'expired').length, color: '#f59e0b' },
    { name: 'Esgotados', value: mockCoupons.filter(c => c.status === 'depleted').length, color: '#ef4444' },
  ];

  const top5Coupons = [...mockCoupons]
    .sort((a, b) => b.total_revenue_generated - a.total_revenue_generated)
    .slice(0, 5)
    .map(c => ({ name: c.code, desconto: c.total_discount_given, receita: c.total_revenue_generated, usos: c.times_used }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cupons e Descontos"
        subtitle="Visão geral do desempenho dos seus cupons"
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'Cupons e Descontos' }
        ]}
        actions={
          <Link to={createPageUrl('CouponForm')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Cupom
            </Button>
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Tag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Cupons Ativos</p>
                <p className="text-2xl font-bold">{activeCoupons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total em Descontos</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDiscountGiven)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Receita Gerada</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenueGenerated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Hash className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Utilizações Totais</p>
                <p className="text-2xl font-bold">{totalUsages.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Cupons Nominais</p>
                <p className="text-2xl font-bold">{nominalCoupons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desconto vs Receita ao longo do tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Desconto vs. Receita ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mockCouponUsageOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Receita" stroke="#2bc196" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="discount" name="Desconto" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 5 Cupons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Cupons por Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top5Coupons} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#2bc196" radius={[0, 4, 4, 0]} />
                <Bar dataKey="desconto" name="Desconto" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={typeDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {typeDistribution.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Coupons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Cupons Recentes</CardTitle>
          <Link to={createPageUrl('CouponList')}>
            <Button variant="outline" size="sm">
              Ver Todos <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockCoupons.slice(0, 5).map(coupon => (
              <Link key={coupon.id} to={createPageUrl(`CouponDetail?id=${coupon.id}`)} className="block">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${coupon.type === 'percentage' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                      {coupon.type === 'percentage' ? <Percent className="w-4 h-4 text-purple-600" /> : <DollarSign className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-sm">{coupon.code}</span>
                        {coupon.is_nominal && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Nominal</Badge>}
                      </div>
                      <p className="text-xs text-slate-500">{coupon.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                      <p className="text-xs text-slate-500">Usos</p>
                      <p className="font-semibold text-sm">{coupon.times_used}{coupon.usage_limit_total ? `/${coupon.usage_limit_total}` : ''}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs text-slate-500">Receita</p>
                      <p className="font-semibold text-sm text-emerald-600">{formatCurrency(coupon.total_revenue_generated)}</p>
                    </div>
                    <Badge variant={coupon.status === 'active' ? 'default' : coupon.status === 'expired' ? 'secondary' : coupon.status === 'depleted' ? 'destructive' : 'outline'} className="text-xs">
                      {coupon.status === 'active' ? 'Ativo' : coupon.status === 'inactive' ? 'Inativo' : coupon.status === 'expired' ? 'Expirado' : 'Esgotado'}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}