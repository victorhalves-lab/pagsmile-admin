import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  SlidersHorizontal,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DataTable({
  columns,
  data,
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectRows,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  onSearch,
  pagination = true,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  actions,
  onRefresh,
  onExport,
  emptyMessage = 'Nenhum registro encontrado',
  className
}) {
  const totalPages = Math.ceil(totalItems / pageSize);

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

  if (loading) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-100", className)}>
        <div className="p-4 border-b border-gray-100">
          <div className="h-10 bg-gray-100 rounded animate-pulse w-64"></div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchable && (
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 w-full sm:w-64"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}
          {actions}
        </div>
        
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
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
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={cn("text-xs font-semibold text-gray-600 uppercase tracking-wider", column.headerClassName)}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="h-32 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow 
                  key={row.id || rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.cellClassName}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
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
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === totalPages}
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