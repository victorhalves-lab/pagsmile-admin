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

const DEFAULT_COLUMNS = [
  { key: 'transaction_id', label: 'ID', visible: true, sortable: true },
  { key: 'created_date', label: 'Data/Hora', visible: true, sortable: true },
  { key: 'type', label: 'Método', visible: true, sortable: true },
  { key: 'amount', label: 'Valor', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'merchant', label: 'Cliente (Merchant)', visible: true, sortable: true },
  { key: 'customer', label: 'Pagador', visible: true, sortable: true },
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
  { key: 'created_date', label: 'Data/Hora', visible: true, sortable: true },
  { key: 'type', label: 'Método', visible: true, sortable: true },
  { key: 'amount', label: 'Valor', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'merchant', label: 'Cliente (Merchant)', visible: true, sortable: true },
  { key: 'customer', label: 'Pagador', visible: true, sortable: true },
  { key: 'sub_seller', label: 'Sub-seller', visible: true, sortable: true },
  { key: 'card_brand', label: 'Bandeira', visible: true, sortable: true },
  { key: 'card_last_four', label: 'Últimos 4', visible: false },
  { key: 'installments', label: 'Parcelas', visible: true, sortable: true },
  { key: 'bin', label: 'BIN', visible: true },
  { key: 'issuer', label: 'Emissor', visible: false },
  { key: 'authorization_code', label: 'Cód. Autorização', visible: false },
  { key: 'threeds', label: '3DS', visible: true },
  { key: 'net_amount', label: 'Líquido', visible: false, sortable: true },
  { key: 'fee_amount', label: 'Taxa', visible: false },
];

const PIX_COLUMNS = [
  { key: 'transaction_id', label: 'ID', visible: true, sortable: true },
  { key: 'created_date', label: 'Data/Hora', visible: true, sortable: true },
  { key: 'pix_transaction_type', label: 'Tipo PIX', visible: true, sortable: true },
  { key: 'amount', label: 'Valor', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'merchant', label: 'Cliente (Merchant)', visible: true, sortable: true },
  { key: 'payer', label: 'Pagador', visible: true, sortable: true },
  { key: 'e2eid', label: 'E2EID', visible: true },
  { key: 'pix_type', label: 'Tipo Cobrança', visible: false },
  { key: 'payment_time', label: 'Tempo Pgto', visible: false },
  { key: 'net_amount', label: 'Líquido', visible: false, sortable: true },
];

export default function TransactionDataTable({
  data = [],
  loading = false,
  viewMode = 'all', // 'all', 'card', 'pix'
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
    return cols.filter(c => c.visible).map(c => c.key);
  });

  const allColumns = viewMode === 'card' ? CARD_COLUMNS : viewMode === 'pix' ? PIX_COLUMNS : DEFAULT_COLUMNS;
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
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
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              row.type === 'pix' ? 'bg-teal-100' : 'bg-blue-100'
            )}>
              {row.type === 'pix' ? (
                <QrCode className="w-4 h-4 text-teal-600" />
              ) : (
                <CreditCard className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-sm font-medium text-gray-900 truncate">
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
          <Badge variant="outline" className={cn(
            row.type === 'pix' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-blue-50 text-blue-700 border-blue-200'
          )}>
            {row.type === 'pix' ? 'Pix' : 'Cartão'}
          </Badge>
        );

      case 'amount':
        return (
          <div>
            <p className="font-semibold text-gray-900">{formatCurrency(row.amount)}</p>
            {row.installments > 1 && (
              <p className="text-xs text-gray-500">{row.installments}x de {formatCurrency(row.amount / row.installments)}</p>
            )}
          </div>
        );

      case 'status':
        return <StatusBadge status={row.status} />;

      case 'merchant':
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{row?.merchant_name || row?.subaccount_name || 'N/A'}</p>
            <p className="text-xs text-gray-500 truncate">{row?.subaccount_id ? `ID: ${row.subaccount_id.slice(0, 8)}...` : ''}</p>
          </div>
        );

      case 'customer':
        return (
          <div className="min-w-0">
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      {/* Column Selector */}
      <div className="flex items-center justify-end p-3 border-b border-gray-100">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="w-4 h-4 mr-2" />
              Colunas
            </Button>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              {allColumns
                .filter(col => visibleColumns.includes(col.key))
                .map((column) => (
                  <TableHead 
                    key={column.key}
                    className={cn(
                      "text-xs font-semibold text-gray-600 uppercase tracking-wider",
                      column.sortable && "cursor-pointer hover:bg-gray-100"
                    )}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && (
                        sortColumn === column.key ? (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="w-3 h-3" /> : 
                            <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-30" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumns.length + (selectable ? 2 : 1)} 
                  className="h-32 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow 
                  key={row.id || idx}
                  className={cn(
                    "hover:bg-gray-50 transition-colors",
                    selectedRows.includes(row.id) && "bg-blue-50"
                  )}
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                      />
                    </TableCell>
                  )}
                  {allColumns
                    .filter(col => visibleColumns.includes(col.key))
                    .map((column) => (
                      <TableCell 
                        key={column.key}
                        className={cn(
                          onRowClick && "cursor-pointer"
                        )}
                        onClick={() => column.key !== 'actions' && onRowClick?.(row)}
                      >
                        {renderCell(row, column.key)}
                      </TableCell>
                    ))}
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100">
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