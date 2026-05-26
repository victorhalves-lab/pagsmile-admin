import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal,
  Eye,
  Copy,
  RotateCcw,
  CreditCard,
  QrCode,
  Shield,
  Split,
  Repeat,
  AlertTriangle,
  Settings2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/common/StatusBadge';
import DatesCell from './cells/DatesCell';
import ValuesCell from './cells/ValuesCell';
import FeesCell from './cells/FeesCell';
import ValuesCellMerchant from './cells/ValuesCellMerchant';
import ValuesCellInternal from './cells/ValuesCellInternal';
import FeesCellMerchant from './cells/FeesCellMerchant';
import FeesCellInternal from './cells/FeesCellInternal';
import PixFlowBadge from './pix/PixFlowBadge';

const DEFAULT_COLUMNS = [
  { key: 'transaction_id', label: 'ID', visible: true, sortable: true },
  { key: 'merchant', label: 'Vendedor', visible: true, sortable: true },
  { key: 'customer', label: 'Comprador', visible: true, sortable: true },
  { key: 'payment_block', label: 'Pagamento', visible: true, sortable: false },
  { key: 'dates_block', label: 'Datas', visible: true, sortable: false },
  { key: 'values_block', label: 'Valores', visible: true, sortable: false },
  { key: 'fees_block', label: 'Comissões e Taxas', visible: true, sortable: false },
  { key: 'created_date', label: 'Data/Hora', visible: false, sortable: true },
  { key: 'type', label: 'Método', visible: false, sortable: true },
  { key: 'amount', label: 'Valor', visible: false, sortable: true },
  { key: 'status', label: 'Status', visible: false, sortable: true },
  { key: 'sub_seller', label: 'Sub-seller', visible: false, sortable: true },
  { key: 'card_brand', label: 'Bandeira', visible: false, sortable: true },
  { key: 'card_last_four', label: 'Últimos 4', visible: false },
  { key: 'installments', label: 'Parcelas', visible: false, sortable: true },
  { key: 'net_amount', label: 'Líquido', visible: false, sortable: true },
  { key: 'fee_amount', label: 'Taxa', visible: false },
  { key: 'channel', label: 'Canal', visible: false },
  { key: 'merchant_order_id', label: 'ID Pedido', visible: false },
];

const CARD_COLUMNS = [
  { key: 'transaction_id', label: 'ID', visible: true, sortable: true },
  { key: 'merchant', label: 'Vendedor', visible: true, sortable: true },
  { key: 'customer', label: 'Comprador', visible: true, sortable: true },
  { key: 'payment_block', label: 'Pagamento', visible: true, sortable: false },
  { key: 'dates_block', label: 'Datas', visible: true, sortable: false },
  { key: 'values_block', label: 'Valores', visible: true, sortable: false },
  { key: 'fees_block', label: 'Comissões e Taxas', visible: true, sortable: false },
  { key: 'card_brand', label: 'Bandeira', visible: false, sortable: true },
  { key: 'card_last_four', label: 'Últimos 4', visible: false },
  { key: 'installments', label: 'Parcelas', visible: false, sortable: true },
  { key: 'bin', label: 'BIN', visible: false },
  { key: 'issuer', label: 'Emissor', visible: false },
  { key: 'authorization_code', label: 'Cód. Autorização', visible: false },
  { key: 'threeds', label: '3DS', visible: false },
  { key: 'sub_seller', label: 'Sub-seller', visible: false, sortable: true },
];

const PIX_COLUMNS = [
  { key: 'transaction_id', label: 'ID', visible: true, sortable: true },
  { key: 'merchant', label: 'Vendedor', visible: true, sortable: true },
  { key: 'payer', label: 'Comprador', visible: true, sortable: true },
  { key: 'payment_block', label: 'Pagamento', visible: true, sortable: false },
  { key: 'dates_block', label: 'Datas', visible: true, sortable: false },
  { key: 'values_block', label: 'Valores', visible: true, sortable: false },
  { key: 'fees_block', label: 'Comissões e Taxas', visible: true, sortable: false },
  { key: 'pix_transaction_type', label: 'Tipo PIX', visible: false, sortable: true },
  { key: 'pix_flow', label: 'Fluxo PIX', visible: true, sortable: true },
  { key: 'e2eid', label: 'E2EID', visible: false },
  { key: 'pix_type', label: 'Tipo Cobrança', visible: false },
  { key: 'pix_journey_ms', label: 'Jornada', visible: false, sortable: true },
  { key: 'payment_time', label: 'Tempo Pgto', visible: false },
];

export default function TransactionDataTable({
  data = [],
  loading = false,
  viewMode = 'all', // 'all', 'card', 'pix'
  viewContext = 'merchant', // 'merchant' (Admin Sub) | 'internal' (Admin Interno)
  selectable = true,
  selectedRows = [],
  onSelectRows,
  pagination = true,
  pageSize = 25,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortColumn,
  sortDirection,
  onRowClick,
  onRefund,
  onCapture,
  onCancel,
  emptyMessage = 'Nenhuma transação encontrada',
}) {
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const cols = viewMode === 'card' ? CARD_COLUMNS : viewMode === 'pix' ? PIX_COLUMNS : DEFAULT_COLUMNS;
    let visible = cols.filter(c => c.visible).map(c => c.key);
    // No contexto merchant, esconder coluna "Vendedor" (é o próprio merchant olhando)
    if (viewContext === 'merchant') visible = visible.filter(k => k !== 'merchant');
    return visible;
  });

  const allColumns = viewMode === 'card' ? CARD_COLUMNS : viewMode === 'pix' ? PIX_COLUMNS : DEFAULT_COLUMNS;
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // V9 table cell styles (inline para garantir aplicação independente de cascade externo)
  const v9ThStyle = (extra = {}) => ({
    background: 'transparent',
    color: '#5CF7CF',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    padding: '14px 16px',
    textAlign: 'left',
    position: 'relative',
    whiteSpace: 'nowrap',
    borderBottom: 'none',
    userSelect: 'none',
    ...extra,
  });

  const v9TdStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid #B3F0DE',
    fontSize: 13,
    verticalAlign: 'middle',
    color: '#001124',
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectRows?.(data.map(row => row.id));
    } else {
      onSelectRows?.([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      onSelectRows?.([...selectedRows, id]);
    } else {
      onSelectRows?.(selectedRows.filter(r => r !== id));
    }
  };

  const handleSort = (column) => {
    if (!column.sortable) return;
    const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort?.(column.key, newDirection);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderCell = (row, columnKey) => {
    switch (columnKey) {
      case 'transaction_id':
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              "v9ic v9ic-sm",
              (row.method === 'pix' || row.type === 'pix') ? 'v9ic-mint' : 'v9ic-blue'
            )}>
              {(row.method === 'pix' || row.type === 'pix') ? (
                <QrCode strokeWidth={2.2} />
              ) : (
                <CreditCard strokeWidth={2.2} />
              )}
            </div>
            <div className="min-w-0">
              <p className="id truncate" style={{ fontSize: 11.5 }}>
                {row.transaction_id?.slice(0, 8)}...
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {row.antifraud_status && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Shield className={cn(
                          "w-3 h-3",
                          row.antifraud_status === 'approved' ? 'text-green-500' : 
                          row.antifraud_status === 'review' ? 'text-yellow-500' : 'text-red-500'
                        )} />
                      </TooltipTrigger>
                      <TooltipContent>
                        Antifraude: {row.antifraud_status}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {row.has_split && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Split className="w-3 h-3 text-purple-500" />
                      </TooltipTrigger>
                      <TooltipContent>Transação com Split</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {row.is_recurring && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Repeat className="w-3 h-3 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>Transação Recorrente</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {row.status === 'chargeback' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>Disputa/Chargeback</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        );

      case 'created_date':
        return row.created_date ? (
          <div>
            <p className="text-sm text-gray-900">
              {format(new Date(row.created_date), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
            <p className="text-xs text-gray-500">
              {format(new Date(row.created_date), 'HH:mm:ss', { locale: ptBR })}
            </p>
          </div>
        ) : '-';

      case 'type':
        return (
          <span className={cn('pill-st', (row.method === 'pix' || row.type === 'pix') ? 'ok' : 'info')}>
            {(row.method === 'pix' || row.type === 'pix') ? 'PIX' : 'Cartão'}
          </span>
        );

      case 'amount':
        return (
          <div>
            <p className="num">{formatCurrency(row.amount)}</p>
            {row.installments > 1 && (
              <p className="mono" style={{ fontSize: 10.5, color: '#547C9D', marginTop: 2 }}>
                {row.installments}x de {formatCurrency(row.amount / row.installments)}
              </p>
            )}
          </div>
        );

      case 'status':
        return <StatusBadge status={row.status} />;

      case 'merchant':
        return (
          <div className="min-w-0 max-w-[180px]">
            <p className="text-sm font-medium text-gray-900 truncate uppercase">{row?.merchant_name || row?.subaccount_name || 'N/A'}</p>
            <p className="text-xs text-gray-500 truncate lowercase">{row?.merchant_email || row?.subaccount_email || ''}</p>
          </div>
        );

      case 'customer':
        return (
          <div className="min-w-0 max-w-[180px]">
            <p className="text-sm font-medium text-gray-900 truncate">{row?.customer?.name || row?.customer_name || 'N/A'}</p>
            <p className="text-xs text-gray-500 truncate">{row?.customer?.email || row?.customer_email || ''}</p>
          </div>
        );

      case 'payer':
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{row?.customer?.name || row?.customer_name || row?.payer_name || 'N/A'}</p>
            <p className="text-xs text-gray-500 truncate">{row?.customer?.document || row?.payer_document || ''}</p>
          </div>
        );

      case 'sub_seller':
        if (!row?.sub_seller_name && !row?.split_rules?.length) return '-';
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-purple-700 truncate">
              {row?.sub_seller_name || (row?.split_rules?.[0]?.recipient_id ? `Split: ${row.split_rules[0].recipient_id.slice(0, 8)}...` : '-')}
            </p>
            {row?.split_rules?.length > 1 && (
              <p className="text-xs text-purple-500">+{row.split_rules.length - 1} outros</p>
            )}
          </div>
        );

      case 'card_brand':
        return row.card_brand ? (
          <Badge variant="outline" className="capitalize">
            {row.card_brand}
          </Badge>
        ) : '-';

      case 'card_last_four':
        return row.card_last_four ? (
          <span className="font-mono text-sm">****{row.card_last_four}</span>
        ) : '-';

      case 'installments':
        return row.installments ? `${row.installments}x` : '-';

      case 'net_amount':
        return formatCurrency(row.net_amount);

      case 'fee_amount':
        return formatCurrency(row.fee_amount);

      case 'channel':
        return row.channel ? (
          <Badge variant="outline" className="capitalize">
            {row.channel}
          </Badge>
        ) : '-';

      case 'merchant_order_id':
        return row.merchant_order_id ? (
          <span className="font-mono text-xs truncate max-w-24 block">{row.merchant_order_id}</span>
        ) : '-';

      case 'payment_block':
        return (
          <div className="space-y-1 min-w-[140px]">
            <StatusBadge status={row.status} />
            <div className="flex items-center gap-1 flex-wrap">
              <p className="text-xs text-gray-500">
                {(row.method === 'pix' || row.type === 'pix') ? 'PIX' : row.card_brand ? `Cartão · ${row.card_brand}` : 'Cartão'}
              </p>
              {(row.method === 'pix' || row.type === 'pix') && (
                <PixFlowBadge flow={row.pix_flow || 'manual'} size="xs" />
              )}
            </div>
            {row.status === 'refused' && row.refusal_reason && (
              <p className="text-[10px] text-red-600 truncate max-w-[140px]" title={row.refusal_reason}>
                {row.refusal_reason}
              </p>
            )}
          </div>
        );

      case 'pix_flow':
        if (row.method !== 'pix' && row.type !== 'pix') return '-';
        return <PixFlowBadge flow={row.pix_flow || 'manual'} />;

      case 'pix_journey_ms':
        if (!row.pix_journey_ms) return '-';
        const ms = row.pix_journey_ms;
        if (ms < 30000) {
          return <span className="text-emerald-700 font-medium text-xs">⚡ {(ms / 1000).toFixed(1)}s</span>;
        }
        if (ms < 120000) {
          return <span className="text-amber-700 font-medium text-xs">{(ms / 1000).toFixed(0)}s</span>;
        }
        return <span className="text-rose-700 font-medium text-xs">{(ms / 60000).toFixed(1)}min</span>;

      case 'dates_block':
        return <DatesCell row={row} />;

      case 'values_block':
        if (viewContext === 'internal') return <ValuesCellInternal row={row} />;
        if (viewContext === 'merchant') return <ValuesCellMerchant row={row} />;
        return <ValuesCell row={row} />;

      case 'fees_block':
        if (viewContext === 'internal') return <FeesCellInternal row={row} />;
        if (viewContext === 'merchant') return <FeesCellMerchant row={row} />;
        return <FeesCell row={row} />;

      case 'bin':
        return row.type === 'card' && row.card_last_four ? (
          <span className="font-mono text-sm">{row.bin || '411111'}</span>
        ) : '-';

      case 'threeds':
        return row.type === 'card' ? (
          <Badge variant="outline" className={cn(
            row.threeds_authenticated ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          )}>
            {row.threeds_authenticated ? '3DS ✓' : 'Sem 3DS'}
          </Badge>
        ) : '-';

      case 'e2eid':
        return row.type === 'pix' && row.pix_key ? (
          <span className="font-mono text-xs truncate max-w-24 block">{row.pix_key?.slice(0, 12)}...</span>
        ) : '-';

      case 'pix_type':
        return row.type === 'pix' ? (
          <Badge variant="outline">Imediata</Badge>
        ) : '-';

      case 'pix_transaction_type':
        if (row.method !== 'pix' && row.type !== 'pix') return '-';
        const pixType = row.pix_transaction_type || 'in';
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1",
              pixType === 'in' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            )}
          >
            {pixType === 'in' ? (
              <>
                <ArrowDownLeft className="w-3 h-3" />
                Entrada
              </>
            ) : (
              <>
                <ArrowUpRight className="w-3 h-3" />
                Saída
              </>
            )}
          </Badge>
        );

      default:
        return row[columnKey] || '-';
    }
  };

  // V9 table wrapper inline styles (garante visual independente de cascade externo)
  const v9TblStyle = {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #fff, #FAFEFC)',
    border: '1px solid #80E5C6',
    boxShadow: '0 8px 24px -8px rgba(0, 193, 148, .15)',
  };

  if (loading) {
    return (
      <div style={v9TblStyle}>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={v9TblStyle}>
      {/* V9 hover styles (precisa de :hover, não dá pra inline) */}
      <style>{`
        .v9tbl-row:hover td { background: linear-gradient(90deg, #E0F8F1, transparent) !important; }
        .v9tbl-row:hover td:first-child { box-shadow: inset 4px 0 0 #00C194; }
      `}</style>

      {/* Column Selector */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid #B3F0DE',
          background: 'linear-gradient(90deg, #F0FAF6, #fff)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#007A5C',
          }}
        >
          <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
          {totalItems > 0 ? `${totalItems} registros` : 'Sem registros'}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="pvf-btn pvf-btn-out pvf-btn-sm">
              <Settings2 className="w-3.5 h-3.5" />
              Colunas
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <p className="text-sm font-medium mb-3">Colunas Visíveis</p>
              {allColumns.filter(c => c.key !== 'actions').map(column => (
                <label key={column.key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={(checked) => {
                      setVisibleColumns(prev => 
                        checked 
                          ? [...prev, column.key]
                          : prev.filter(k => k !== column.key)
                      );
                    }}
                  />
                  <span className="text-sm">{column.label}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table V9 — thead navy gradient + glow text + hover mint */}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'linear-gradient(180deg, #001124, #002443)' }}>
            <tr>
              {selectable && (
                <th style={v9ThStyle({ width: 44 })}>
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}
              {allColumns
                .filter(col => visibleColumns.includes(col.key))
                .map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column)}
                    style={v9ThStyle({ cursor: column.sortable ? 'pointer' : 'default' })}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && (
                        sortColumn === column.key ? (
                          sortDirection === 'asc'
                            ? <ArrowUp className="w-3 h-3" />
                            : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3" style={{ opacity: 0.45 }} />
                        )
                      )}
                    </div>
                  </th>
                ))}
              <th style={v9ThStyle({ width: 44 })}></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 2 : 1)}
                  className="text-center"
                  style={{ height: 128, color: '#547C9D', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, padding: '14px 16px' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const isSelected = selectedRows.includes(row.id);
                return (
                <tr
                  key={row.id || idx}
                  className="v9tbl-row"
                  style={isSelected ? { background: 'linear-gradient(90deg, #E0F8F1, transparent)' } : undefined}
                >
                  {selectable && (
                    <td style={v9TdStyle}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                      />
                    </td>
                  )}
                  {allColumns
                    .filter(col => visibleColumns.includes(col.key))
                    .map((column) => (
                      <td
                        key={column.key}
                        onClick={() => column.key !== 'actions' && onRowClick?.(row)}
                        style={{ ...v9TdStyle, cursor: onRowClick ? 'pointer' : 'default' }}
                      >
                        {renderCell(row, column.key)}
                      </td>
                    ))}
                  <td style={v9TdStyle}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`${createPageUrl('TransactionDetail')}?id=${row.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(row.transaction_id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {row.status === 'approved' && (
                          <DropdownMenuItem onClick={() => onRefund?.(row)}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Estornar
                          </DropdownMenuItem>
                        )}
                        {row.status === 'pre_authorized' && (
                          <DropdownMenuItem onClick={() => onCapture?.(row)}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Capturar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                      </DropdownMenu>
                      </td>
                      </tr>
                      );
                      })
                      )}
                      </tbody>
                      </table>
                      </div>

      {/* Pagination */}
      {pagination && totalItems > 0 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4"
          style={{ borderTop: '1px solid #B3F0DE', background: 'linear-gradient(180deg, #fff, #F0FAF6)' }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Mostrando</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange?.(Number(v))}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>de {totalItems} registros</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(1)}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="px-3 text-sm text-gray-600">
              Página {currentPage} de {totalPages || 1}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange?.(totalPages)}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}