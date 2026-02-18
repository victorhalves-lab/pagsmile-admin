import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TicketPercent,
  Plus,
  Search,
  Eye,
  Pencil,
  Power,
  Trash2,
  Copy,
  MoreHorizontal,
  Download,
  Mail,
  LinkIcon,
  Percent,
  DollarSign
} from 'lucide-react';
import { mockCoupons } from '@/components/mockData/couponMocks';

const statusLabels = { active: 'Ativo', inactive: 'Inativo', expired: 'Expirado', depleted: 'Esgotado' };
const statusVariants = { active: 'default', inactive: 'outline', expired: 'secondary', depleted: 'destructive' };

export default function CouponList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [nominalFilter, setNominalFilter] = useState('all');

  let filtered = [...mockCoupons];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || (c.assigned_to_email || '').toLowerCase().includes(s)
    );
  }
  if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
  if (typeFilter !== 'all') filtered = filtered.filter(c => c.type === typeFilter);
  if (nominalFilter === 'nominal') filtered = filtered.filter(c => c.is_nominal);
  if (nominalFilter === 'general') filtered = filtered.filter(c => !c.is_nominal);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Cupons"
        subtitle="Gerencie todos os seus cupons e descontos"
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'Cupons e Descontos', page: 'CouponsOverview' },
          { label: 'Lista de Cupons' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            <Link to={createPageUrl('CouponForm')}>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Criar Cupom
              </Button>
            </Link>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar por código, nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="expired">Expirados</SelectItem>
                  <SelectItem value="depleted">Esgotados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="percentage">Percentual</SelectItem>
                  <SelectItem value="fixed_amount">Valor Fixo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={nominalFilter} onValueChange={setNominalFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Escopo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="nominal">Nominais</SelectItem>
                  <SelectItem value="general">Gerais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Usos</TableHead>
                  <TableHead className="text-right">Desconto</TableHead>
                  <TableHead className="text-right">Receita</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(coupon => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">{coupon.code}</span>
                        {coupon.is_nominal && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-purple-300 text-purple-600">
                            <Mail className="w-3 h-3 mr-1" />
                            Nominal
                          </Badge>
                        )}
                      </div>
                      {coupon.assigned_to_email && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{coupon.assigned_to_email}</p>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-sm font-medium truncate">{coupon.name}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {coupon.type === 'percentage' ? <Percent className="w-3.5 h-3.5 text-purple-500" /> : <DollarSign className="w-3.5 h-3.5 text-blue-500" />}
                        <span className="text-xs">{coupon.type === 'percentage' ? 'Percentual' : 'Valor Fixo'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[coupon.status]}>{statusLabels[coupon.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{coupon.times_used}</span>
                      {coupon.usage_limit_total && <span className="text-xs text-slate-400">/{coupon.usage_limit_total}</span>}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-medium text-sm">
                      {formatCurrency(coupon.total_discount_given)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium text-sm">
                      {formatCurrency(coupon.total_revenue_generated)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>{new Date(coupon.start_date).toLocaleDateString('pt-BR')}</p>
                        {coupon.end_date && <p className="text-slate-400">até {new Date(coupon.end_date).toLocaleDateString('pt-BR')}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl(`CouponDetail?id=${coupon.id}`)} className="flex items-center gap-2">
                              <Eye className="w-4 h-4" /> Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={createPageUrl(`CouponForm?id=${coupon.id}`)} className="flex items-center gap-2">
                              <Pencil className="w-4 h-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(coupon.code)}>
                            <Copy className="w-4 h-4 mr-2" /> Copiar Código
                          </DropdownMenuItem>
                          {coupon.generated_link && (
                            <DropdownMenuItem onClick={() => copyToClipboard(coupon.generated_link)}>
                              <LinkIcon className="w-4 h-4 mr-2" /> Copiar Link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className={coupon.status === 'active' ? 'text-amber-600' : 'text-emerald-600'}>
                            <Power className="w-4 h-4 mr-2" />
                            {coupon.status === 'active' ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-slate-500">
                      Nenhum cupom encontrado com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}