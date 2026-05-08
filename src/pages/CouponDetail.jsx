import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TicketPercent, Pencil, Power, Trash2, Copy, Mail, Percent, DollarSign,
  Calendar, Shield, Target, Users, Clock, ChevronLeft, ChevronRight, Pause,
  CalendarPlus, FileText, Download, ArrowRightCircle, MoreHorizontal, History,
  Link2, ShoppingCart, Sparkles,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockCoupons, mockCouponUsageHistory, mockPaymentLinksForCoupon } from '@/components/mockData/couponMocks';
import CouponNextActions from '@/components/coupons/detail/CouponNextActions';
import CouponDetailKpis from '@/components/coupons/detail/CouponDetailKpis';
import CouponDetailBreakdowns from '@/components/coupons/detail/CouponDetailBreakdowns';
import CouponDetailComparisons from '@/components/coupons/detail/CouponDetailComparisons';
import { toast } from 'sonner';

const statusLabels = { active: 'Ativo', inactive: 'Inativo', expired: 'Expirado', depleted: 'Esgotado' };
const statusVariants = { active: 'default', inactive: 'outline', expired: 'secondary', depleted: 'destructive' };
const appliesToLabels = {
  all_products: 'Todos os Produtos',
  specific_products: 'Produtos Específicos',
  specific_categories: 'Categorias Específicas',
  specific_plans: 'Planos de Assinatura',
};

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0 text-xs">
    <div className="flex items-center gap-1.5 text-slate-500">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </div>
    <span className="font-medium text-right max-w-[55%]">{value ?? '-'}</span>
  </div>
);

export default function CouponDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const couponId = urlParams.get('id');
  const [period, setPeriod] = useState('7d');

  const couponIdx = mockCoupons.findIndex((c) => c.id === couponId);
  const coupon = mockCoupons[couponIdx >= 0 ? couponIdx : 0];
  const usageHistory = mockCouponUsageHistory.filter((u) => u.coupon_id === coupon.id);

  // Navegação cupom-a-cupom
  const prevCoupon = mockCoupons[couponIdx > 0 ? couponIdx - 1 : mockCoupons.length - 1];
  const nextCoupon = mockCoupons[couponIdx < mockCoupons.length - 1 ? couponIdx + 1 : 0];

  // Mock daily usage por período
  const dailyUsage = (period === '7d'
    ? [
        { day: '12/02', usos: 15, desconto: 450 },
        { day: '13/02', usos: 22, desconto: 680 },
        { day: '14/02', usos: 45, desconto: 1200 },
        { day: '15/02', usos: 18, desconto: 540 },
        { day: '16/02', usos: 28, desconto: 820 },
        { day: '17/02', usos: 35, desconto: 980 },
        { day: '18/02', usos: 12, desconto: 360 },
      ]
    : period === '30d'
    ? Array.from({ length: 30 }, (_, i) => ({
        day: `${i + 1}`,
        usos: Math.floor(Math.random() * 40 + 10),
        desconto: Math.floor(Math.random() * 1200 + 300),
      }))
    : Array.from({ length: 12 }, (_, i) => ({
        day: `S${i + 1}`,
        usos: Math.floor(Math.random() * 200 + 50),
        desconto: Math.floor(Math.random() * 6000 + 1500),
      }))
  );

  // Linked entities
  const linkedLinks = (coupon.linked_payment_link_ids || [])
    .map((id) => mockPaymentLinksForCoupon.find((l) => l.id === id))
    .filter(Boolean);

  // Histórico mock
  const changeHistory = [
    { date: '17/05/2026', user: 'João Silva', change: 'Aumentou desconto de 10% para 12%', impact: '+8% conversão' },
    { date: '02/05/2026', user: 'Maria Costa', change: 'Estendeu validade em +30 dias', impact: null },
    { date: '15/04/2026', user: 'João Silva', change: 'Cupom criado', impact: null },
  ];

  return (
    <div className="space-y-3">
      <PageHeader
        title={coupon.code}
        subtitle={coupon.name}
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Promoções', page: 'CouponsOverview' },
          { label: 'Lista', page: 'CouponList' },
          { label: coupon.code },
        ]}
        actions={
          <div className="flex items-center gap-1">
            {/* Navegação prev/next */}
            <Button
              size="icon" variant="outline" className="h-8 w-8"
              onClick={() => navigate(createPageUrl(`CouponDetail?id=${prevCoupon.id}`))}
              title="Cupom anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon" variant="outline" className="h-8 w-8"
              onClick={() => navigate(createPageUrl(`CouponDetail?id=${nextCoupon.id}`))}
              title="Próximo cupom"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <Link to={createPageUrl(`CouponForm?id=${coupon.id}`)}>
              <Button variant="outline" size="sm"><Pencil className="w-3.5 h-3.5 mr-1" />Editar</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => toast.success('Cupom pausado')}>
              <Pause className="w-3.5 h-3.5 mr-1" /> Pausar
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Validade estendida +7d')}>
              <CalendarPlus className="w-3.5 h-3.5 mr-1" /> Estender
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Variante criada para A/B test')}>
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Criar variante A/B
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.success('Limite aumentado +500')}>
                  <ArrowRightCircle className="w-3.5 h-3.5 mr-2" /> Aumentar limite
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('Cupom duplicado')}>
                  <Copy className="w-3.5 h-3.5 mr-2" /> Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('PDF exportado')}>
                  <FileText className="w-3.5 h-3.5 mr-2" /> Compartilhar relatório PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success('CSV exportado')}>
                  <Download className="w-3.5 h-3.5 mr-2" /> Exportar lista de clientes
                </DropdownMenuItem>
                {coupon.is_nominal && (
                  <DropdownMenuItem onClick={() => toast.success('Lembrete enviado')}>
                    <Mail className="w-3.5 h-3.5 mr-2" /> Notificar atribuído
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.success('Campanha de follow-up criada')}>
                  <Sparkles className="w-3.5 h-3.5 mr-2" /> Criar campanha follow-up
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className={coupon.status === 'active' ? 'text-amber-600' : 'text-emerald-600'}>
                  <Power className="w-3.5 h-3.5 mr-2" />
                  {coupon.status === 'active' ? 'Desativar' : 'Ativar'}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Header compacto */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-xl">
                <TicketPercent className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-mono font-black">{coupon.code}</h2>
                  <Badge variant={statusVariants[coupon.status]} className="text-xs">
                    {statusLabels[coupon.status]}
                  </Badge>
                  {coupon.is_nominal && (
                    <Badge variant="outline" className="border-purple-300 text-purple-600 text-xs">
                      <Mail className="w-2.5 h-2.5 mr-1" /> Nominal
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{coupon.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-emerald-600">
                {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
              </p>
              <p className="text-[10px] text-slate-500">{coupon.type === 'percentage' ? 'de desconto' : 'de desconto fixo'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximas ações sugeridas — TOPO */}
      <CouponNextActions coupon={coupon} />

      {/* KPIs reorganizados */}
      <CouponDetailKpis coupon={coupon} />

      {/* Comparações */}
      <CouponDetailComparisons coupon={coupon} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Coluna esquerda — info */}
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Detalhes do desconto</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Tipo" value={coupon.type === 'percentage' ? 'Percentual' : 'Valor Fixo'} icon={coupon.type === 'percentage' ? Percent : DollarSign} />
              <InfoRow label="Valor" value={coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)} />
              <InfoRow label="Compra mínima" value={coupon.min_purchase_amount ? formatCurrency(coupon.min_purchase_amount) : 'Sem mínimo'} />
              <InfoRow label="Desconto máx" value={coupon.max_discount_amount ? formatCurrency(coupon.max_discount_amount) : 'Sem limite'} />
              <InfoRow label="Empilhável" value={coupon.is_stackable ? 'Sim' : 'Não'} icon={Shield} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Validade e uso</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Início" value={new Date(coupon.start_date).toLocaleDateString('pt-BR')} icon={Calendar} />
              <InfoRow label="Expiração" value={coupon.end_date ? new Date(coupon.end_date).toLocaleDateString('pt-BR') : 'Sem expiração'} icon={Clock} />
              <InfoRow label="Limite total" value={coupon.usage_limit_total || 'Ilimitado'} icon={Users} />
              <InfoRow label="Limite por cliente" value={coupon.usage_limit_per_user || 'Ilimitado'} />
              <InfoRow label="Aplicável a" value={appliesToLabels[coupon.applies_to]} icon={Target} />
            </CardContent>
          </Card>

          {/* Linked entities visual */}
          {linkedLinks.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> Vinculações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {linkedLinks.map((link) => (
                  <Link
                    key={link.id}
                    to={createPageUrl(`PaymentLinkDetail?id=${link.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg border hover:border-[#2bc196]/40 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ShoppingCart className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <p className="text-xs font-medium truncate">{link.name}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{formatCurrency(link.amount)}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Cupom Nominal */}
          {coupon.is_nominal && (
            <Card className="border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" /> Cupom Nominal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="E-mail" value={coupon.assigned_to_email} icon={Mail} />
                {coupon.generated_link && (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">Link com cupom automático</p>
                    <div className="flex gap-1">
                      <Input value={coupon.generated_link} readOnly className="font-mono text-[10px] h-7" />
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => { navigator.clipboard.writeText(coupon.generated_link); toast.success('Copiado'); }}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Histórico de mudanças */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="w-4 h-4" /> Histórico de mudanças
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {changeHistory.map((h, i) => (
                <div key={i} className="text-xs border-l-2 border-slate-200 pl-2.5 py-1">
                  <p className="font-medium">{h.change}</p>
                  <p className="text-[10px] text-slate-500">{h.user} • {h.date}</p>
                  {h.impact && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[9px] mt-1 border-0">{h.impact}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita — gráfico + decomposições + tabela */}
        <div className="lg:col-span-2 space-y-3">
          {/* Chart com period selector */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Utilização ao longo do tempo</span>
                <div className="flex gap-1">
                  {['7d', '30d', '90d'].map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={period === p ? 'default' : 'ghost'}
                      className="h-6 text-[10px] px-2"
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="usos" name="Utilizações" fill="#2bc196" radius={[2, 2, 0, 0]} />
                  <Bar yAxisId="right" dataKey="desconto" name="Desconto (R$)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Decomposições novas */}
          <CouponDetailBreakdowns coupon={coupon} />

          {/* Histórico de utilização */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Clientes que usaram</span>
                <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => toast.success('CSV exportado')}>
                  <Download className="w-3 h-3 mr-1" /> Exportar CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[10px]">Transação</TableHead>
                    <TableHead className="text-[10px]">Data</TableHead>
                    <TableHead className="text-[10px]">Cliente</TableHead>
                    <TableHead className="text-[10px] text-right">Compra</TableHead>
                    <TableHead className="text-[10px] text-right">Desconto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageHistory.length > 0 ? usageHistory.map((u) => (
                    <TableRow key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-mono text-xs">{u.transaction_id}</TableCell>
                      <TableCell className="text-xs">{new Date(u.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Link
                          to={createPageUrl('CustomerDetail') + `?email=${u.customer_email}`}
                          className="hover:text-[#2bc196] transition-colors"
                        >
                          <p className="text-xs font-medium">{u.customer_name}</p>
                          <p className="text-[10px] text-slate-400">{u.customer_email}</p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">{formatCurrency(u.purchase_amount)}</TableCell>
                      <TableCell className="text-right text-xs text-red-600 font-medium">{formatCurrency(u.discount_applied)}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-500">
                        Nenhuma utilização registrada.
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