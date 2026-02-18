import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TicketPercent,
  Pencil,
  Power,
  Trash2,
  Copy,
  LinkIcon,
  Mail,
  Percent,
  DollarSign,
  Calendar,
  Shield,
  Target,
  Users,
  TrendingUp,
  Hash,
  Clock,
  ArrowLeftRight,
  Check,
  X as XIcon
} from 'lucide-react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { mockCoupons, mockCouponUsageHistory } from '@/components/mockData/couponMocks';

const statusLabels = { active: 'Ativo', inactive: 'Inativo', expired: 'Expirado', depleted: 'Esgotado' };
const statusVariants = { active: 'default', inactive: 'outline', expired: 'secondary', depleted: 'destructive' };
const appliesToLabels = {
  all_products: 'Todos os Produtos',
  specific_products: 'Produtos Específicos',
  specific_categories: 'Categorias Específicas',
  specific_plans: 'Planos de Assinatura'
};

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex items-center gap-2 text-sm text-slate-500">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </div>
    <span className="text-sm font-medium text-slate-900 dark:text-white text-right max-w-[55%]">{value ?? '-'}</span>
  </div>
);

export default function CouponDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const couponId = urlParams.get('id');

  const coupon = mockCoupons.find(c => c.id === couponId) || mockCoupons[0];
  const usageHistory = mockCouponUsageHistory.filter(u => u.coupon_id === coupon.id);

  const usagePercent = coupon.usage_limit_total
    ? Math.min((coupon.times_used / coupon.usage_limit_total) * 100, 100)
    : null;

  const roi = coupon.total_discount_given > 0
    ? ((coupon.total_revenue_generated / coupon.total_discount_given) * 100).toFixed(0)
    : 0;

  // Mock daily usage for chart
  const dailyUsage = [
    { day: '12/02', usos: 15, desconto: 450 },
    { day: '13/02', usos: 22, desconto: 680 },
    { day: '14/02', usos: 45, desconto: 1200 },
    { day: '15/02', usos: 18, desconto: 540 },
    { day: '16/02', usos: 28, desconto: 820 },
    { day: '17/02', usos: 35, desconto: 980 },
    { day: '18/02', usos: 12, desconto: 360 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={coupon.code}
        subtitle={coupon.name}
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'Cupons e Descontos', page: 'CouponsOverview' },
          { label: 'Lista de Cupons', page: 'CouponList' },
          { label: coupon.code }
        ]}
        actions={
          <div className="flex gap-2">
            <Link to={createPageUrl(`CouponForm?id=${coupon.id}`)}>
              <Button variant="outline" size="sm"><Pencil className="w-4 h-4 mr-2" />Editar</Button>
            </Link>
            <Button variant="outline" size="sm" className={coupon.status === 'active' ? 'text-amber-600 border-amber-300' : 'text-emerald-600 border-emerald-300'}>
              <Power className="w-4 h-4 mr-2" />
              {coupon.status === 'active' ? 'Desativar' : 'Ativar'}
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 border-red-300">
              <Trash2 className="w-4 h-4 mr-2" />Excluir
            </Button>
          </div>
        }
      />

      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-2xl">
                <TicketPercent className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-mono font-black">{coupon.code}</h2>
                  <Badge variant={statusVariants[coupon.status]} className="text-sm">
                    {statusLabels[coupon.status]}
                  </Badge>
                  {coupon.is_nominal && (
                    <Badge variant="outline" className="border-purple-300 text-purple-600">
                      <Mail className="w-3 h-3 mr-1" /> Nominal
                    </Badge>
                  )}
                </div>
                <p className="text-slate-500 mt-1">{coupon.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-emerald-600">
                {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
              </p>
              <p className="text-sm text-slate-500">{coupon.type === 'percentage' ? 'de desconto' : 'de desconto fixo'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Hash className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Utilizações</p>
                <p className="text-2xl font-bold">{coupon.times_used}</p>
                {coupon.usage_limit_total && (
                  <div className="mt-1">
                    <Progress value={usagePercent} className="h-1.5" />
                    <p className="text-[10px] text-slate-400 mt-0.5">{coupon.times_used} de {coupon.usage_limit_total}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <DollarSign className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total em Descontos</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(coupon.total_discount_given)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Receita Gerada</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(coupon.total_revenue_generated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BarChartIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">ROI do Cupom</p>
                <p className="text-2xl font-bold text-blue-600">{roi}%</p>
                <p className="text-[10px] text-slate-400">receita / desconto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalhes do Cupom */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalhes do Desconto</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Tipo" value={coupon.type === 'percentage' ? 'Percentual' : 'Valor Fixo'} icon={coupon.type === 'percentage' ? Percent : DollarSign} />
              <InfoRow label="Valor" value={coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)} />
              <InfoRow label="Compra Mínima" value={coupon.min_purchase_amount ? formatCurrency(coupon.min_purchase_amount) : 'Sem mínimo'} />
              <InfoRow label="Desconto Máximo" value={coupon.max_discount_amount ? formatCurrency(coupon.max_discount_amount) : 'Sem limite'} />
              <InfoRow label="Empilhável" value={coupon.is_stackable ? 'Sim' : 'Não'} icon={Shield} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Validade e Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Início" value={new Date(coupon.start_date).toLocaleString('pt-BR')} icon={Calendar} />
              <InfoRow label="Expiração" value={coupon.end_date ? new Date(coupon.end_date).toLocaleString('pt-BR') : 'Sem expiração'} icon={Clock} />
              <InfoRow label="Limite Total" value={coupon.usage_limit_total || 'Ilimitado'} icon={Users} />
              <InfoRow label="Limite por Cliente" value={coupon.usage_limit_per_user || 'Ilimitado'} />
              <InfoRow label="Aplicável a" value={appliesToLabels[coupon.applies_to]} icon={Target} />
              {coupon.target_items?.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1">
                    {coupon.target_items.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {coupon.is_nominal && (
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Cupom Nominal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="E-mail" value={coupon.assigned_to_email} icon={Mail} />
                {coupon.generated_link && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Link com Cupom Automático</p>
                    <div className="flex gap-2">
                      <Input value={coupon.generated_link} readOnly className="font-mono text-xs bg-slate-50" />
                      <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(coupon.generated_link)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts and Usage */}
        <div className="lg:col-span-2 space-y-6">
          {/* Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Utilização Diária (Últimos 7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="usos" name="Utilizações" fill="#2bc196" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="desconto" name="Desconto (R$)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Usage History Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5" />
                Histórico de Utilização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transação</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Valor da Compra</TableHead>
                    <TableHead className="text-right">Desconto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageHistory.length > 0 ? usageHistory.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell className="font-mono text-sm">{usage.transaction_id}</TableCell>
                      <TableCell>{new Date(usage.date).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{usage.customer_name}</p>
                        <p className="text-xs text-slate-400">{usage.customer_email}</p>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(usage.purchase_amount)}</TableCell>
                      <TableCell className="text-right text-red-600 font-medium">{formatCurrency(usage.discount_applied)}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Nenhuma utilização registrada para este cupom.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}