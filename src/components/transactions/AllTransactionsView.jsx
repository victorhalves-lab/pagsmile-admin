import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TransactionSummaryCards from './TransactionSummaryCards';
import TransactionAdvancedFilters from './TransactionAdvancedFilters';
import TransactionMassActions from './TransactionMassActions';
import TransactionDataTable from './TransactionDataTable';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AllTransactionsView() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortColumn, setSortColumn] = useState('created_date');
  const [sortDirection, setSortDirection] = useState('desc');

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['transactions', 'all', filters, sortColumn, sortDirection],
    queryFn: () => base44.entities.Transaction.list(
      sortDirection === 'desc' ? `-${sortColumn}` : sortColumn, 
      500
    ),
  });

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.search_id) {
      const search = filters.search_id.toLowerCase();
      result = result.filter(tx => 
        tx.transaction_id?.toLowerCase().includes(search) ||
        tx.customer_name?.toLowerCase().includes(search) ||
        tx.customer_email?.toLowerCase().includes(search) ||
        tx.merchant_order_id?.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.statuses?.length > 0) {
      result = result.filter(tx => filters.statuses.includes(tx.status));
    }

    // Method filter
    if (filters.method && filters.method !== 'all') {
      result = result.filter(tx => tx.type === filters.method);
    }

    // Brand filter
    if (filters.brands?.length > 0) {
      result = result.filter(tx => filters.brands.includes(tx.card_brand));
    }

    // Value range filter
    if (filters.min_value) {
      result = result.filter(tx => tx.amount >= parseFloat(filters.min_value));
    }
    if (filters.max_value) {
      result = result.filter(tx => tx.amount <= parseFloat(filters.max_value));
    }

    // Date range filter
    if (filters.date_from) {
      result = result.filter(tx => new Date(tx.created_date) >= new Date(filters.date_from));
    }
    if (filters.date_to) {
      result = result.filter(tx => new Date(tx.created_date) <= new Date(filters.date_to));
    }

    // Channel filter
    if (filters.channels?.length > 0) {
      result = result.filter(tx => filters.channels.includes(tx.channel));
    }

    // Customer filter
    if (filters.customer_search) {
      const search = filters.customer_search.toLowerCase();
      result = result.filter(tx => 
        tx.customer_name?.toLowerCase().includes(search) ||
        tx.customer_email?.toLowerCase().includes(search)
      );
    }

    if (filters.customer_document) {
      result = result.filter(tx => 
        tx.customer_document?.replace(/\D/g, '').includes(filters.customer_document.replace(/\D/g, ''))
      );
    }

    return result;
  }, [transactions, filters]);

  // Paginate
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleRowClick = (row) => {
    navigate(`${createPageUrl('TransactionDetail')}?id=${row.id}`);
  };

  const handleExport = (options) => {
    console.log('Exporting with options:', options);
    // TODO: Implement export
  };

  const handleCaptureBatch = (transactions) => {
    console.log('Capturing batch:', transactions);
    // TODO: Implement batch capture
  };

  const handleCancelBatch = (transactions) => {
    console.log('Canceling batch:', transactions);
    // TODO: Implement batch cancel
  };

  const handleRefundBatch = (transactions, reason) => {
    console.log('Refunding batch:', transactions, reason);
    // TODO: Implement batch refund
  };

  const handleReprocessBatch = (transactions) => {
    console.log('Reprocessing batch:', transactions);
    // TODO: Implement batch reprocess
  };

  const handleAddTags = (transactions, tags) => {
    console.log('Adding tags:', transactions, tags);
    // TODO: Implement add tags
  };

  const handleResendWebhooks = (transactions) => {
    console.log('Resending webhooks:', transactions);
    // TODO: Implement resend webhooks
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <TransactionSummaryCards transactions={transactions} />

      {/* Advanced Filters */}
      <TransactionAdvancedFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({})}
        viewMode="all"
      />

      {/* Mass Actions Bar */}
      <TransactionMassActions
        selectedCount={selectedRows.length}
        selectedTransactions={selectedRows}
        onClearSelection={() => setSelectedRows([])}
        onExport={handleExport}
        onCaptureBatch={handleCaptureBatch}
        onCancelBatch={handleCancelBatch}
        onRefundBatch={handleRefundBatch}
        onReprocessBatch={handleReprocessBatch}
        onAddTags={handleAddTags}
        onResendWebhooks={handleResendWebhooks}
      />

      {/* Data Table */}
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
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={handleRowClick}
      />
    </div>
  );
}