import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ActionableSummaryCards from './hub/ActionableSummaryCards';
import HourlyHeatmapInline from './hub/HourlyHeatmapInline';
import TransactionAdvancedFilters from './TransactionAdvancedFilters';
import TransactionMassActions from './TransactionMassActions';
import TransactionDataTable from './TransactionDataTable';
import TransactionDetailDrawer from './hub/TransactionDetailDrawer';
import CompareTransactionsPanel from './hub/CompareTransactionsPanel';
import JourneyGroupedView from './hub/JourneyGroupedView';
import { Button } from '@/components/ui/button';
import { Layers, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactionsContext } from './hub/TransactionsContext';

export default function AllTransactionsView() {
  const { stickyFilters } = useTransactionsContext();
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortColumn, setSortColumn] = useState('created_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [drawerRow, setDrawerRow] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [viewMode, setViewMode] = useState('flat'); // flat | journey

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'all', sortColumn, sortDirection],
    queryFn: () => base44.entities.Transaction.list(
      sortDirection === 'desc' ? `-${sortColumn}` : sortColumn,
      500
    ),
  });

  // Aplicar sticky filters + filters locais
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Sticky search
    if (stickyFilters.search) {
      const s = stickyFilters.search.toLowerCase();
      result = result.filter(tx =>
        tx.transaction_id?.toLowerCase().includes(s) ||
        tx.customer?.name?.toLowerCase().includes(s) ||
        tx.customer?.email?.toLowerCase().includes(s) ||
        tx.customer_name?.toLowerCase().includes(s) ||
        tx.customer_email?.toLowerCase().includes(s)
      );
    }
    if (stickyFilters.method && stickyFilters.method !== 'all') {
      result = result.filter(tx => tx.method === stickyFilters.method || tx.type === stickyFilters.method);
    }
    if (stickyFilters.statuses?.length) {
      result = result.filter(tx => stickyFilters.statuses.includes(tx.status));
    }

    // Filtros locais (TransactionAdvancedFilters)
    if (filters.statuses?.length > 0) result = result.filter(tx => filters.statuses.includes(tx.status));
    if (filters.brands?.length > 0) result = result.filter(tx => filters.brands.includes(tx.card?.brand));
    if (filters.min_value) result = result.filter(tx => tx.amount >= parseFloat(filters.min_value));
    if (filters.max_value) result = result.filter(tx => tx.amount <= parseFloat(filters.max_value));

    return result;
  }, [transactions, stickyFilters, filters]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleRowClick = (row) => setDrawerRow(row);

  const handleCompare = () => {
    if (selectedRows.length < 2) return;
    setCompareOpen(true);
  };

  const selectedTransactionsData = useMemo(() =>
    transactions.filter(t => selectedRows.includes(t.id)),
    [transactions, selectedRows]
  );

  return (
    <div className="space-y-4">
      <ActionableSummaryCards transactions={transactions} />

      <HourlyHeatmapInline />

      {/* Toggle modo + Comparar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('flat')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === 'flat' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            Lista
          </button>
          <button
            onClick={() => setViewMode('journey')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === 'journey' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
            )}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Por jornada
          </button>
        </div>

        {selectedRows.length >= 2 && viewMode === 'flat' && (
          <Button size="sm" onClick={handleCompare} className="bg-[#2bc196] hover:bg-[#25a880] text-white gap-2">
            Comparar {selectedRows.length} transações
          </Button>
        )}
      </div>

      {viewMode === 'journey' ? (
        <JourneyGroupedView transactions={filteredTransactions} onRowClick={handleRowClick} />
      ) : (
        <>
          <TransactionAdvancedFilters
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters({})}
            viewMode="all"
          />

          <TransactionMassActions
            selectedCount={selectedRows.length}
            selectedTransactions={selectedRows}
            onClearSelection={() => setSelectedRows([])}
            onExport={() => {}}
            onCaptureBatch={() => {}}
            onCancelBatch={() => {}}
            onRefundBatch={() => {}}
            onReprocessBatch={() => {}}
            onAddTags={() => {}}
            onResendWebhooks={() => {}}
          />

          <TransactionDataTable
            data={paginatedTransactions}
            loading={isLoading}
            viewMode="all"
            viewContext="merchant"
            selectable
            selectedRows={selectedRows}
            onSelectRows={setSelectedRows}
            pagination
            pageSize={pageSize}
            currentPage={page}
            totalItems={filteredTransactions.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onRowClick={handleRowClick}
          />
        </>
      )}

      {/* Drawer de detalhe */}
      <TransactionDetailDrawer
        row={drawerRow}
        allRows={paginatedTransactions}
        open={!!drawerRow}
        onClose={() => setDrawerRow(null)}
        onNavigate={setDrawerRow}
      />

      {/* Painel de comparação */}
      <CompareTransactionsPanel
        rows={selectedTransactionsData}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
      />
    </div>
  );
}