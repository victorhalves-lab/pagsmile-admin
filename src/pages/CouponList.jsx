import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TicketPercent, Plus, Eye, Pencil, Power, Trash2, Copy, MoreHorizontal, Download, Mail,
  LinkIcon, Percent, DollarSign, Pause, CalendarPlus, QrCode, History, Activity, ArrowLeftRight,
} from 'lucide-react';
import { mockCoupons } from '@/components/mockData/couponMocks';
import { calcConversion, expiryBadge, timeSinceUse, inferAudience, calcCouponHealth } from '@/components/coupons/utils';
import CouponHealthScore from '@/components/coupons/CouponHealthScore';
import CouponListKpiBar from '@/components/coupons/list/CouponListKpiBar';
import CouponListFilters from '@/components/coupons/list/CouponListFilters';
import CouponListBulkBar from '@/components/coupons/list/CouponListBulkBar';
import CouponCompareModal from '@/components/coupons/list/CouponCompareModal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusLabels = { active: 'Ativo', inactive: 'Inativo', expired: 'Expirado', depleted: 'Esgotado' };
const statusVariants = { active: 'default', inactive: 'outline', expired: 'secondary', depleted: 'destructive' };

const PAGE_SIZE = 20;

export default function CouponList() {
  const navigate = useNavigate();

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [nominalFilter, setNominalFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [valueRange, setValueRange] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [healthMode, setHealthMode] = useState(false);

  // Selection / pagination / compare
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...mockCoupons];

    if (search) {
      const s = search.toLowerCase();
      list = list.filter((c) =>
        c.code.toLowerCase().includes(s) ||
        c.name.toLowerCase().includes(s) ||
        (c.assigned_to_email || '').toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') list = list.filter((c) => c.status === statusFilter);
    if (typeFilter !== 'all') list = list.filter((c) => c.type === typeFilter);
    if (nominalFilter === 'nominal') list = list.filter((c) => c.is_nominal);
    if (nominalFilter === 'general') list = list.filter((c) => !c.is_nominal);
    if (audienceFilter !== 'all') list = list.filter((c) => inferAudience(c) === audienceFilter);

    if (valueRange === 'low') list = list.filter((c) => c.value <= 10);
    if (valueRange === 'mid') list = list.filter((c) => c.value > 10 && c.value <= 25);
    if (valueRange === 'high') list = list.filter((c) => c.value > 25);

    switch (sortBy) {
      case 'best_revenue':
        list.sort((a, b) => b.total_revenue_generated - a.total_revenue_generated);
        break;
      case 'best_conversion':
        list.sort((a, b) => calcConversion(b) - calcConversion(a));
        break;
      case 'most_used':
        list.sort((a, b) => b.times_used - a.times_used);
        break;
      case 'expiring_soon':
        list.sort((a, b) => new Date(a.end_date || '2099') - new Date(b.end_date || '2099'));
        break;
      case 'low_usage':
        list.sort((a, b) => calcCouponHealth(a).score - calcCouponHealth(b).score);
        break;
      case 'recent':
      default:
        list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    return list;
  }, [search, statusFilter, typeFilter, nominalFilter, audienceFilter, valueRange, sortBy]);

  const activeFiltersCount =
    (search ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (typeFilter !== 'all' ? 1 : 0) +
    (nominalFilter !== 'all' ? 1 : 0) +
    (audienceFilter !== 'all' ? 1 : 0) +
    (valueRange !== 'all' ? 1 : 0);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setNominalFilter('all');
    setAudienceFilter('all');
    setValueRange('all');
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === paged.length ? [] : paged.map((c) => c.id));
  };

  const handleBulkAction = (action) => {
    const labels = {
      activate: 'Ativados', pause: 'Pausados', extend: 'Validade estendida',
      tag: 'Tag aplicada', export: 'Pacote exportado', duplicate: 'Duplicados', notify: 'Notificações enviadas',
    };
    toast.success(`${labels[action]}: ${selectedIds.length} cupons`);
    setSelectedIds([]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const handleRowClick = (id) => navigate(createPageUrl(`CouponDetail?id=${id}`));

  const openCompare = () => {
    if (selectedIds.length !== 2) {
      toast.error('Selecione exatamente 2 cupons');
      return;
    }
    setCompareOpen(true);
  };

  const compareCoupons = mockCoupons.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-3">
      <PageHeader
        title="Lista de Cupons"
        subtitle="Gerencie todos os seus cupons em um só lugar"
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'Promoções', page: 'CouponsOverview' },
          { label: 'Lista' },
        ]}
        actions={
          <div className="flex gap-2">
            {selectedIds.length === 2 && (
              <Button variant="outline" size="sm" onClick={openCompare}>
                <ArrowLeftRight className="w-4 h-4 mr-1.5" />
                Comparar 2
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1.5" /> Exportar CSV
            </Button>
            <Link to={createPageUrl('CouponForm')}>
              <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]">
                <Plus className="w-4 h-4 mr-1.5" /> Criar cupom
              </Button>
            </Link>
          </div>
        }
      />

      {/* Mini KPIs */}
      <CouponListKpiBar coupons={mockCoupons} />

      {/* Filters */}
      <CouponListFilters
        search={search} onSearch={setSearch}
        statusFilter={statusFilter} onStatusChange={setStatusFilter}
        typeFilter={typeFilter} onTypeChange={setTypeFilter}
        nominalFilter={nominalFilter} onNominalChange={setNominalFilter}
        audienceFilter={audienceFilter} onAudienceChange={setAudienceFilter}
        valueRange={valueRange} onValueRangeChange={setValueRange}
        sortBy={sortBy} onSortChange={setSortBy}
        healthMode={healthMode} onHealthModeChange={setHealthMode}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
      />

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="w-8">
                    <Checkbox
                      checked={selectedIds.length === paged.length && paged.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  {healthMode && <TableHead className="w-10 text-[10px]">Saúde</TableHead>}
                  <TableHead className="text-[11px]">Código</TableHead>
                  <TableHead className="text-[11px]">Nome</TableHead>
                  <TableHead className="text-[11px]">Audiência</TableHead>
                  <TableHead className="text-[11px]">Tipo</TableHead>
                  <TableHead className="text-[11px]">Valor</TableHead>
                  <TableHead className="text-[11px]">Status</TableHead>
                  <TableHead className="text-[11px]">Vínculos</TableHead>
                  <TableHead className="text-[11px]">Uso</TableHead>
                  <TableHead className="text-[11px] text-center">Conv.</TableHead>
                  <TableHead className="text-[11px] text-right">Receita</TableHead>
                  <TableHead className="text-[11px]">Última uso</TableHead>
                  <TableHead className="text-[11px]">Validade</TableHead>
                  <TableHead className="w-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((coupon) => {
                  const conv = calcConversion(coupon).toFixed(1);
                  const expBadge = expiryBadge(coupon);
                  const usagePct = coupon.usage_limit_total
                    ? (coupon.times_used / coupon.usage_limit_total) * 100
                    : null;
                  const linksCount = (coupon.linked_payment_link_ids?.length || 0) + (coupon.linked_checkout_ids?.length || 0);

                  return (
                    <TableRow
                      key={coupon.id}
                      className={cn(
                        'cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50',
                        selectedIds.includes(coupon.id) && 'bg-emerald-50/50 dark:bg-emerald-900/10'
                      )}
                      onClick={() => handleRowClick(coupon.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(coupon.id)}
                          onCheckedChange={() => toggleSelect(coupon.id)}
                        />
                      </TableCell>
                      {healthMode && (
                        <TableCell>
                          <CouponHealthScore coupon={coupon} showLabel={false} size="sm" />
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs">{coupon.code}</span>
                          {coupon.is_nominal && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-purple-300 text-purple-600">
                              <Mail className="w-2.5 h-2.5 mr-0.5" /> Nominal
                            </Badge>
                          )}
                        </div>
                        {coupon.assigned_to_email && (
                          <p className="text-[10px] text-slate-400">{coupon.assigned_to_email}</p>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[160px]">
                        <p className="text-xs font-medium truncate">{coupon.name}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] px-1.5 h-4">{inferAudience(coupon)}</Badge>
                      </TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' ? (
                          <Percent className="w-3.5 h-3.5 text-purple-500" title="Percentual" />
                        ) : (
                          <DollarSign className="w-3.5 h-3.5 text-blue-500" title="Valor fixo" />
                        )}
                      </TableCell>
                      <TableCell className="font-bold text-xs">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : formatCurrency(coupon.value)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[coupon.status]} className="text-[10px]">
                          {statusLabels[coupon.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {linksCount > 0 ? (
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <LinkIcon className="w-2.5 h-2.5" /> {linksCount}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-slate-400">Todos</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 min-w-[80px]">
                          <span className="text-xs font-semibold">{coupon.times_used}</span>
                          {coupon.usage_limit_total && (
                            <>
                              <span className="text-[10px] text-slate-400">/{coupon.usage_limit_total}</span>
                              <Progress value={usagePct} className="h-1 w-12" />
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs font-medium">{conv}%</span>
                      </TableCell>
                      <TableCell className="text-right text-xs font-semibold text-emerald-600">
                        {formatCurrency(coupon.total_revenue_generated)}
                      </TableCell>
                      <TableCell>
                        <span className="text-[11px] text-slate-500">{timeSinceUse(coupon)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${expBadge.color} border-0`}>
                          {expBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => handleRowClick(coupon.id)}>
                              <Eye className="w-3.5 h-3.5 mr-2" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={createPageUrl(`CouponForm?id=${coupon.id}`)} className="flex items-center">
                                <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(coupon.code)}>
                              <Copy className="w-3.5 h-3.5 mr-2" /> Copiar código
                            </DropdownMenuItem>
                            {coupon.generated_link && (
                              <DropdownMenuItem onClick={() => copyToClipboard(coupon.generated_link)}>
                                <LinkIcon className="w-3.5 h-3.5 mr-2" /> Copiar link
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => toast.success('QR Code gerado')}>
                              <QrCode className="w-3.5 h-3.5 mr-2" /> Compartilhar QR
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.success('Pausado')}>
                              <Pause className="w-3.5 h-3.5 mr-2" /> Pausar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Validade estendida +7d')}>
                              <CalendarPlus className="w-3.5 h-3.5 mr-2" /> Estender validade
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Cupom duplicado')}>
                              <Copy className="w-3.5 h-3.5 mr-2" /> Duplicar
                            </DropdownMenuItem>
                            {coupon.is_nominal && (
                              <DropdownMenuItem onClick={() => toast.success('Lembrete enviado')}>
                                <Mail className="w-3.5 h-3.5 mr-2" /> Notificar atribuído
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Activity className="w-3.5 h-3.5 mr-2" /> Estatística rápida
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="w-3.5 h-3.5 mr-2" /> Histórico de mudanças
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
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={healthMode ? 15 : 14} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <TicketPercent className="w-10 h-10 text-slate-300" />
                        <div>
                          <p className="text-sm font-semibold text-slate-600">Nenhum cupom encontrado</p>
                          <p className="text-xs text-slate-400">
                            {activeFiltersCount > 0 ? 'Tente limpar os filtros' : 'Crie seu primeiro cupom'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {activeFiltersCount > 0 && (
                            <Button size="sm" variant="outline" onClick={clearFilters}>
                              Limpar filtros
                            </Button>
                          )}
                          <Link to={createPageUrl('CouponForm')}>
                            <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]">
                              <Plus className="w-3.5 h-3.5 mr-1" /> Criar cupom
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t">
              <span className="text-xs text-slate-500">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
              </span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Anterior
                </Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Bar */}
      <CouponListBulkBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onAction={handleBulkAction}
      />

      {/* Compare Modal */}
      <CouponCompareModal
        open={compareOpen}
        onOpenChange={setCompareOpen}
        coupons={compareCoupons}
      />
    </div>
  );
}