import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, Search, Filter, Eye, CheckCircle, 
  Clock, XCircle, Upload, Building2, Calendar
} from 'lucide-react';
import { mockMerchants } from '@/components/mockData/adminInternoMocks';

export default function AdminIntDocs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Flatten all documents from all merchants
  const allDocuments = mockMerchants.flatMap(merchant => 
    (merchant.documents || []).map(doc => ({
      ...doc,
      merchant_id: merchant.id,
      merchant_name: merchant.business_name,
      merchant_document: merchant.document,
      uploaded_at: doc.uploaded_at || merchant.created_at
    }))
  );

  // Filter documents
  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.merchant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.merchant_document.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Aprovado</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" /> Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns = [
    {
      header: 'Documento',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-slate-500">{row.original.type || 'PDF'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Merchant',
      accessorKey: 'merchant_name',
      cell: ({ row }) => (
        <div>
          <Link 
            to={createPageUrl('AdminIntMerchantProfile') + '?id=' + row.original.merchant_id}
            className="font-medium text-blue-600 hover:underline"
          >
            {row.original.merchant_name}
          </Link>
          <p className="text-xs text-slate-500">{row.original.merchant_document}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => getStatusBadge(row.original.status)
    },
    {
      header: 'Data Upload',
      accessorKey: 'uploaded_at',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Calendar className="w-3 h-3" />
          {new Date(row.original.uploaded_at).toLocaleDateString('pt-BR')}
        </div>
      )
    },
    {
      header: 'Ações',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  // Stats
  const stats = {
    total: allDocuments.length,
    approved: allDocuments.filter(d => d.status === 'approved').length,
    pending: allDocuments.filter(d => d.status === 'pending').length,
    rejected: allDocuments.filter(d => d.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Documentos" 
        subtitle="Repositório central de documentos de merchants"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'KYC & Compliance', page: 'AdminIntKYC' },
          { label: 'Documentação', page: 'AdminIntDocs' }
        ]}
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Exportar Relatório
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('all')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total de Documentos</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${filterStatus === 'approved' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setFilterStatus('approved')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${filterStatus === 'pending' ? 'ring-2 ring-amber-500' : ''}`} onClick={() => setFilterStatus('pending')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-300" />
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer hover:shadow-md transition-shadow ${filterStatus === 'rejected' ? 'ring-2 ring-red-500' : ''}`} onClick={() => setFilterStatus('rejected')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Todos os Documentos</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar documento ou merchant..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {filterStatus !== 'all' && (
                <Button variant="outline" size="sm" onClick={() => setFilterStatus('all')}>
                  Limpar filtro
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <DataTable 
              columns={columns}
              data={filteredDocuments}
            />
          ) : (
            <div className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Nenhum documento encontrado</h3>
              <p className="text-slate-500 mt-2">
                {searchTerm ? 'Tente buscar com outros termos.' : 'Não há documentos cadastrados.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}