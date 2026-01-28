import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, Upload, Download, Settings, FileSpreadsheet, FileText, File } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

import MerchantFilters from '@/components/admin-interno/merchants/MerchantFilters';
import MerchantTable from '@/components/admin-interno/merchants/MerchantTable';
import MerchantBulkActions from '@/components/admin-interno/merchants/MerchantBulkActions';
import MerchantSummary from '@/components/admin-interno/merchants/MerchantSummary';
import MerchantPagination from '@/components/admin-interno/merchants/MerchantPagination';

// Mock data
const mockMerchants = [
  { id: '12345', trade_name: 'E-commerce XYZ', business_name: 'E-commerce XYZ Ltda', document: '12345678000190', status: 'active', methods: ['card', 'pix', 'boleto'], tpv_30d: 2340000, tpv_change: 12, cb_ratio: 0.82, segment: 'E-commerce', last_access: new Date(Date.now() - 3600000) },
  { id: '12346', trade_name: 'Loja ABC', business_name: 'Loja ABC Ltda', document: '98765432000100', status: 'active', methods: ['card', 'pix'], tpv_30d: 1870000, tpv_change: -5, cb_ratio: 0.95, segment: 'Varejo', last_access: new Date(Date.now() - 86400000) },
  { id: '12347', trade_name: 'Tech Store', business_name: 'Tech Store S.A.', document: '11222333000144', status: 'kyc_pending', methods: ['card'], tpv_30d: 0, cb_ratio: 0, segment: 'Eletrônicos', last_access: null },
  { id: '12348', trade_name: 'Fashion Online', business_name: 'Fashion Online Ltda', document: '44555666000155', status: 'blocked', methods: ['card', 'pix', 'boleto'], tpv_30d: 567000, tpv_change: 0, cb_ratio: 2.34, segment: 'Moda', last_access: new Date('2026-01-15T09:12:00') },
  { id: '12349', trade_name: 'SaaS Cloud', business_name: 'SaaS Cloud Tecnologia', document: '77888999000166', status: 'active', methods: ['card', 'pix'], tpv_30d: 890000, tpv_change: 25, cb_ratio: 0.45, segment: 'SaaS/Digital', last_access: new Date(Date.now() - 1800000) },
  { id: '12350', trade_name: 'Educação Plus', business_name: 'Educação Plus Ltda', document: '33444555000177', status: 'active', methods: ['card', 'pix', 'boleto'], tpv_30d: 1250000, tpv_change: 8, cb_ratio: 0.68, segment: 'Educação', last_access: new Date(Date.now() - 7200000) },
  { id: '12351', trade_name: 'Marketplace Pro', business_name: 'Marketplace Pro S.A.', document: '66777888000188', status: 'suspended', methods: ['card', 'pix'], tpv_30d: 450000, tpv_change: -15, cb_ratio: 1.12, segment: 'Marketplace', last_access: new Date('2026-01-20T14:30:00') },
  { id: '12352', trade_name: 'Saúde Total', business_name: 'Saúde Total Serviços', document: '99000111000199', status: 'kyc_incomplete', methods: ['pix'], tpv_30d: 0, cb_ratio: 0, segment: 'Saúde', last_access: new Date('2026-01-25T10:00:00') },
  { id: '12353', trade_name: 'Games Universe', business_name: 'Games Universe Digital', document: '22333444000100', status: 'active', methods: ['card', 'pix'], tpv_30d: 780000, tpv_change: 45, cb_ratio: 0.55, segment: 'Games', last_access: new Date(Date.now() - 300000) },
  { id: '12354', trade_name: 'Viagens Online', business_name: 'Viagens Online Turismo', document: '55666777000111', status: 'active', methods: ['card', 'pix', 'boleto'], tpv_30d: 2100000, tpv_change: 18, cb_ratio: 0.78, segment: 'Viagens', last_access: new Date(Date.now() - 5400000) },
  { id: '12355', trade_name: 'Fintech Pay', business_name: 'Fintech Pay Ltda', document: '88999000000122', status: 'lead', methods: [], tpv_30d: 0, cb_ratio: 0, segment: 'Financeiro', last_access: null },
  { id: '12356', trade_name: 'Serviços Express', business_name: 'Serviços Express Ltda', document: '11000222000133', status: 'active', methods: ['pix'], tpv_30d: 320000, tpv_change: 5, cb_ratio: 0.12, segment: 'Serviços', last_access: new Date(Date.now() - 43200000) },
];

const mockStats = {
  total: 1234,
  active: 987,
  kyc_pending: 78,
  kyc_incomplete: 45,
  blocked: 22,
  suspended: 23,
  lead: 45,
  inactive: 12,
  cancelled: 22
};

export default function AdminIntMerchantsList() {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState('trade_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Filter merchants
  const filteredMerchants = useMemo(() => {
    let result = [...mockMerchants];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.trade_name?.toLowerCase().includes(term) ||
        m.business_name?.toLowerCase().includes(term) ||
        m.document?.includes(term) ||
        m.id?.includes(term)
      );
    }

    // Apply status filter
    if (filters.status?.length > 0) {
      result = result.filter(m => filters.status.includes(m.status));
    }

    // Apply method filter
    if (filters.methods?.length > 0) {
      result = result.filter(m =>
        filters.methods.some(method => m.methods?.includes(method))
      );
    }

    // Apply segment filter
    if (filters.segment) {
      result = result.filter(m => 
        m.segment?.toLowerCase() === filters.segment.toLowerCase()
      );
    }

    // Apply TPV filters
    if (filters.tpvMin) {
      result = result.filter(m => (m.tpv_30d || 0) >= Number(filters.tpvMin));
    }
    if (filters.tpvMax) {
      result = result.filter(m => (m.tpv_30d || 0) <= Number(filters.tpvMax));
    }

    // Apply CB Ratio filter
    if (filters.cbRatioMax) {
      result = result.filter(m => (m.cb_ratio || 0) <= Number(filters.cbRatioMax));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [mockMerchants, filters, searchTerm, sortField, sortDirection]);

  // Paginate
  const paginatedMerchants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMerchants.slice(start, start + itemsPerPage);
  }, [filteredMerchants, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);

  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleFilterByStatus = (statuses) => {
    setFilters({ ...filters, status: statuses });
  };

  const handleBulkAction = (action, data) => {
    console.log('Bulk action:', action, data);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PageHeader
          title="Merchants"
          subtitle="Gestão completa de clientes"
          breadcrumbs={[
            { label: 'Admin Interno', page: 'AdminIntDashboard' },
            { label: 'Merchants', page: 'AdminIntMerchantsList' }
          ]}
        />

        <div className="flex items-center gap-2">
          <Link to={createPageUrl('AdminIntNewMerchant')}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Novo Merchant
            </Button>
          </Link>
          
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Importar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" /> Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <File className="w-4 h-4 mr-2" /> CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" /> PDF (Relatório)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <MerchantSummary stats={mockStats} onFilterByStatus={handleFilterByStatus} />

      {/* Filters */}
      <MerchantFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={setSearchTerm}
      />

      {/* Bulk Actions */}
      <MerchantBulkActions
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onAction={handleBulkAction}
      />

      {/* Table */}
      <MerchantTable
        merchants={paginatedMerchants}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Pagination */}
      <MerchantPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredMerchants.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}