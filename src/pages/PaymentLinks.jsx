import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  Link2, Plus, Copy, MoreHorizontal, ExternalLink, QrCode,
  Trash2, Edit, Share2, Pause, Play, LayoutGrid, Upload, Sparkles,
  Eye, KanbanSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import SideDrawer from '@/components/common/SideDrawer';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import ShareOptions from '@/components/payment-links/ShareOptions';

import CreateLinkSplitButton from '@/components/payment-links/CreateLinkSplitButton';
import QuickEditLinkDrawer from '@/components/payment-links/drawers/QuickEditLinkDrawer';
import PaymentLinksKpiBar from '@/components/payment-links/list/PaymentLinksKpiBar';
import PaymentLinkHealthScore, { calcLinkHealth } from '@/components/payment-links/list/PaymentLinkHealthScore';
import PaymentLinkSparkline from '@/components/payment-links/list/PaymentLinkSparkline';
import PaymentLinksFilters from '@/components/payment-links/list/PaymentLinksFilters';
import PaymentLinksBulkBar from '@/components/payment-links/list/PaymentLinksBulkBar';
import PaymentLinksInsightsPanel from '@/components/payment-links/list/PaymentLinksInsightsPanel';
import ImportLinksModal from '@/components/payment-links/list/ImportLinksModal';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

// Tempo desde ts → "há 12 min" / "há 3 dias"
const timeSince = (link) => {
  if (!link?.usage_count || link.usage_count === 0) return '—';
  // Mock baseado em volume
  if (link.usage_count > 10) return 'há 12 min';
  if (link.usage_count > 3) return 'há 3h';
  return 'há 2 dias';
};

const statusBadge = (status) => {
  const map = {
    active: { label: 'Ativo', cls: 'bg-emerald-100 text-emerald-700' },
    inactive: { label: 'Inativo', cls: 'bg-slate-100 text-slate-600' },
    expired: { label: 'Expirado', cls: 'bg-slate-100 text-slate-500' },
    sold_out: { label: 'Esgotado', cls: 'bg-amber-100 text-amber-700' },
    draft: { label: 'Rascunho', cls: 'bg-blue-100 text-blue-700' },
  };
  const c = map[status] || map.draft;
  return <Badge className={`${c.cls} text-[10px]`}>{c.label}</Badge>;
};

export default function PaymentLinks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [viewMode, setViewMode] = useState('table');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [valueTypeFilter, setValueTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [shareLink, setShareLink] = useState(null);
  const [quickEditLink, setQuickEditLink] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [importOpen, setImportOpen] = useState(false);
  const [showInsights, setShowInsights] = useState(true);

  const { data: links = [], isLoading, refetch } = useQuery({
    queryKey: ['payment-links'],
    queryFn: () => base44.entities.PaymentLink.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PaymentLink.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['payment-links']);
      toast.success('Link atualizado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PaymentLink.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['payment-links']);
      toast.success('Link excluído');
    },
  });

  // Filtragem + ordenação
  const filteredLinks = useMemo(() => {
    let list = [...links];

    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      list = list.filter((l) => l.name?.toLowerCase().includes(t) || l.link_id?.toLowerCase().includes(t));
    }

    if (statusFilter === 'problem') {
      list = list.filter((l) => l.status === 'active' && (l.usage_count || 0) === 0 && (l.views_count || 0) > 30);
    } else if (statusFilter !== 'all') {
      list = list.filter((l) => l.status === statusFilter);
    }

    if (methodFilter !== 'all') {
      list = list.filter((l) => {
        const m = l.payment_methods || [];
        if (methodFilter === 'pix') return m.length === 1 && m[0] === 'pix';
        if (methodFilter === 'card') return m.length === 1 && m[0] === 'card';
        if (methodFilter === 'both') return m.includes('pix') && m.includes('card');
        return true;
      });
    }

    if (valueTypeFilter !== 'all') {
      list = list.filter((l) => l.value_type === valueTypeFilter);
    }

    // Sort
    switch (sortBy) {
      case 'best_seller':
        list.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
        break;
      case 'best_conversion':
        list.sort((a, b) => {
          const cA = a.views_count > 0 ? (a.usage_count || 0) / a.views_count : 0;
          const cB = b.views_count > 0 ? (b.usage_count || 0) / b.views_count : 0;
          return cB - cA;
        });
        break;
      case 'highest_revenue':
        list.sort((a, b) => (b.total_collected || 0) - (a.total_collected || 0));
        break;
      case 'worst_perf':
        list.sort((a, b) => calcLinkHealth(a).score - calcLinkHealth(b).score);
        break;
      case 'recent':
      default:
        list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    return list;
  }, [links, searchTerm, statusFilter, methodFilter, valueTypeFilter, sortBy]);

  const activeFiltersCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (methodFilter !== 'all' ? 1 : 0) +
    (valueTypeFilter !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setValueTypeFilter('all');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado!');
  };

  const goToDetail = (id) => navigate(createPageUrl('PaymentLinkDetail') + `?id=${id}`);
  const goToEdit = (id) => {
    const link = links.find(l => l.id === id);
    if (link) setQuickEditLink(link);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const selectAllVisible = () => {
    setSelectedIds(filteredLinks.map((l) => l.id));
  };
  const clearSelection = () => setSelectedIds([]);

  const handleBulkAction = (action) => {
    // Mock — em prod chamaria backend
    if (action === 'pause') {
      selectedIds.forEach((id) => updateMutation.mutate({ id, data: { status: 'inactive' } }));
    } else if (action === 'activate') {
      selectedIds.forEach((id) => updateMutation.mutate({ id, data: { status: 'active' } }));
    }
    clearSelection();
  };

  // Group by status para Kanban
  const kanbanGroups = useMemo(() => {
    const groups = { active: [], draft: [], inactive: [], expired: [], sold_out: [] };
    filteredLinks.forEach((l) => {
      if (groups[l.status]) groups[l.status].push(l);
    });
    return groups;
  }, [filteredLinks]);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('payment_links.title')}
        subtitle="Crie, gerencie e otimize seus links de pagamento"
        breadcrumbs={[{ label: t('payment_links.title'), page: 'PaymentLinks' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl('PaymentLinkShowcase'))}>
              <LayoutGrid className="w-4 h-4 mr-2" />
              Vitrine
            </Button>
            <CreateLinkSplitButton />
          </div>
        }
      />

      {/* KPI Bar — clicável para filtrar */}
      <PaymentLinksKpiBar
        links={links}
        onFilterClick={(filterKey) => {
          if (filterKey === 'problem') {
            setStatusFilter('problem');
            toast.info('Filtrando links com problema');
          }
        }}
      />

      {/* Painel Insights cross-link */}
      {showInsights && (
        <div className="relative">
          <PaymentLinksInsightsPanel links={links} />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-xs"
            onClick={() => setShowInsights(false)}
          >
            Ocultar
          </Button>
        </div>
      )}

      {/* Filtros */}
      <PaymentLinksFilters
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        methodFilter={methodFilter}
        onMethodChange={setMethodFilter}
        valueTypeFilter={valueTypeFilter}
        onValueTypeChange={setValueTypeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
      />

      {/* Conteúdo */}
      {filteredLinks.length === 0 && !isLoading ? (
        <EmptyState
          icon={Link2}
          title="Nenhum link encontrado"
          description={
            activeFiltersCount > 0
              ? 'Tente limpar os filtros ou criar um novo link.'
              : 'Crie seu primeiro link de pagamento para começar a receber.'
          }
          actionLabel="Criar Link"
          onAction={() => navigate(createPageUrl('PaymentLinkCreate'))}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanView groups={kanbanGroups} onCardClick={goToDetail} />
      ) : viewMode === 'cards' ? (
        <CardsView
          links={filteredLinks}
          onCardClick={goToDetail}
          onEdit={goToEdit}
          onShare={setShareLink}
          onCopy={copyToClipboard}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      ) : (
        <TableView
          links={filteredLinks}
          isLoading={isLoading}
          onRowClick={goToDetail}
          onEdit={goToEdit}
          onShare={setShareLink}
          onCopy={copyToClipboard}
          onUpdate={updateMutation.mutate}
          onDelete={deleteMutation.mutate}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAllVisible}
        />
      )}

      {/* Bulk Bar */}
      <PaymentLinksBulkBar
        selectedCount={selectedIds.length}
        onClear={clearSelection}
        onAction={handleBulkAction}
      />

      {/* Drawers */}
      <SideDrawer
        open={!!shareLink}
        onOpenChange={(open) => !open && setShareLink(null)}
        title="Compartilhar Link"
        icon={Share2}
      >
        <ShareOptions link={shareLink} onClose={() => setShareLink(null)} />
      </SideDrawer>

      <ImportLinksModal open={importOpen} onOpenChange={setImportOpen} />

      <QuickEditLinkDrawer
        open={!!quickEditLink}
        onOpenChange={(open) => !open && setQuickEditLink(null)}
        link={quickEditLink}
      />
    </div>
  );
}

/* ----------------- Subviews ----------------- */

function TableView({ links, onRowClick, onEdit, onShare, onCopy, onUpdate, onDelete, selectedIds, onToggleSelect, onSelectAll }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 text-xs">
          <tr>
            <th className="p-2.5 w-8">
              <Checkbox onCheckedChange={onSelectAll} />
            </th>
            <th className="text-left p-2.5 font-semibold">Link</th>
            <th className="text-left p-2.5 font-semibold">Saúde</th>
            <th className="text-right p-2.5 font-semibold">Valor</th>
            <th className="text-left p-2.5 font-semibold">Status</th>
            <th className="text-left p-2.5 font-semibold">Vendas</th>
            <th className="text-left p-2.5 font-semibold">Tendência</th>
            <th className="text-right p-2.5 font-semibold">Arrecadado</th>
            <th className="text-left p-2.5 font-semibold">Última venda</th>
            <th className="p-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {links.map((row) => {
            const conversion = row.views_count > 0 ? ((row.usage_count || 0) / row.views_count * 100).toFixed(1) : 0;
            return (
              <tr
                key={row.id}
                className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
              >
                <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() => onToggleSelect(row.id)}
                  />
                </td>
                <td className="p-2.5 cursor-pointer" onClick={() => onRowClick(row.id)}>
                  <div className="flex items-center gap-2">
                    {row.main_image_url ? (
                      <img src={row.main_image_url} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <Link2 className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-xs truncate max-w-[180px]">{row.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{row.short_url || row.url}</p>
                    </div>
                  </div>
                </td>
                <td className="p-2.5 cursor-pointer" onClick={() => onRowClick(row.id)}>
                  <PaymentLinkHealthScore link={row} />
                </td>
                <td className="p-2.5 text-right cursor-pointer" onClick={() => onRowClick(row.id)}>
                  {row.value_type === 'fixed' ? (
                    <span className="font-semibold text-xs">{formatBRL(row.amount)}</span>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      {row.value_type === 'open' ? 'Aberto' : `Min ${formatBRL(row.min_amount)}`}
                    </span>
                  )}
                </td>
                <td className="p-2.5 cursor-pointer" onClick={() => onRowClick(row.id)}>
                  {statusBadge(row.status)}
                </td>
                <td className="p-2.5 cursor-pointer" onClick={() => onRowClick(row.id)}>
                  <p className="text-xs font-medium">{row.usage_count || 0}</p>
                  <p className="text-[10px] text-slate-500">{conversion}% conv</p>
                </td>
                <td className="p-2.5 cursor-pointer" onClick={() => onRowClick(row.id)}>
                  <PaymentLinkSparkline link={row} />
                </td>
                <td className="p-2.5 text-right cursor-pointer" onClick={() => onRowClick(row.id)}>
                  <span className="font-semibold text-xs text-emerald-600">{formatBRL(row.total_collected)}</span>
                </td>
                <td className="p-2.5 cursor-pointer" onClick={() => onRowClick(row.id)}>
                  <span className="text-[11px] text-slate-500">{timeSince(row)}</span>
                </td>
                <td className="p-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onCopy(row.short_url || row.url)}
                      title="Copiar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onShare(row)} title="Compartilhar">
                      <Share2 className="w-3.5 h-3.5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRowClick(row.id)}>
                          <Eye className="w-4 h-4 mr-2" /> Ver detalhe
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(row.url, '_blank')}>
                          <ExternalLink className="w-4 h-4 mr-2" /> Abrir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row.id)}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(row)}>
                          <QrCode className="w-4 h-4 mr-2" /> QR Code
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {row.status === 'active' ? (
                          <DropdownMenuItem onClick={() => onUpdate({ id: row.id, data: { status: 'inactive' } })}>
                            <Pause className="w-4 h-4 mr-2" /> Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => onUpdate({ id: row.id, data: { status: 'active' } })}>
                            <Play className="w-4 h-4 mr-2" /> Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (confirm('Excluir este link?')) onDelete(row.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CardsView({ links, onCardClick, onEdit, onShare, onCopy, selectedIds, onToggleSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {links.map((link) => {
        const conversion = link.views_count > 0 ? ((link.usage_count || 0) / link.views_count * 100).toFixed(1) : 0;
        return (
          <div
            key={link.id}
            className={cn(
              'bg-white dark:bg-slate-900 rounded-xl border overflow-hidden hover:shadow-md transition-all group cursor-pointer',
              selectedIds.includes(link.id) && 'ring-2 ring-[#2bc196]'
            )}
            onClick={() => onCardClick(link.id)}
          >
            {/* Imagem 25% */}
            {link.main_image_url ? (
              <img src={link.main_image_url} alt={link.name} className="w-full h-24 object-cover" />
            ) : (
              <div className="w-full h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                <Link2 className="w-8 h-8 text-slate-400" />
              </div>
            )}

            <div className="p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm truncate flex-1">{link.name}</h3>
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(link.id)}
                    onCheckedChange={() => onToggleSelect(link.id)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {statusBadge(link.status)}
                <PaymentLinkHealthScore link={link} />
              </div>

              {/* 4 KPIs */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded">
                  <p className="text-slate-500">Valor</p>
                  <p className="font-semibold">
                    {link.value_type === 'fixed' ? formatBRL(link.amount) : 'Variável'}
                  </p>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded">
                  <p className="text-slate-500">Vendas</p>
                  <p className="font-semibold">{link.usage_count || 0}</p>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded">
                  <p className="text-slate-500">Conv</p>
                  <p className="font-semibold">{conversion}%</p>
                </div>
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                  <p className="text-emerald-600">Total</p>
                  <p className="font-semibold text-emerald-600">{formatBRL(link.total_collected)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                <PaymentLinkSparkline link={link} width={80} height={20} />
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onCopy(link.short_url || link.url)}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onShare(link)}>
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(link.id)}>
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanView({ groups, onCardClick }) {
  const cols = [
    { key: 'active', label: 'Ativos', color: 'bg-emerald-100 text-emerald-700' },
    { key: 'draft', label: 'Rascunhos', color: 'bg-blue-100 text-blue-700' },
    { key: 'inactive', label: 'Inativos', color: 'bg-slate-100 text-slate-700' },
    { key: 'sold_out', label: 'Esgotados', color: 'bg-amber-100 text-amber-700' },
    { key: 'expired', label: 'Expirados', color: 'bg-slate-100 text-slate-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cols.map((col) => (
        <div key={col.key} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${col.color} text-[10px]`}>{col.label}</Badge>
            <span className="text-xs text-slate-500">{groups[col.key]?.length || 0}</span>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-auto">
            {groups[col.key]?.map((link) => (
              <div
                key={link.id}
                onClick={() => onCardClick(link.id)}
                className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border hover:shadow-sm cursor-pointer"
              >
                <p className="text-xs font-medium truncate">{link.name}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {link.usage_count || 0} vendas • {formatBRL(link.total_collected)}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <PaymentLinkHealthScore link={link} />
                  <PaymentLinkSparkline link={link} width={40} height={14} />
                </div>
              </div>
            ))}
            {(!groups[col.key] || groups[col.key].length === 0) && (
              <p className="text-xs text-slate-400 text-center py-4">Vazio</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}