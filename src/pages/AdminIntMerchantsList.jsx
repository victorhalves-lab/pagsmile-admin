import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Search, Filter, Eye, Settings, BarChart2, Plus, Download, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockMerchants } from '@/components/mockData/adminInternoMocks';

export default function AdminIntMerchantsList() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter by search term
  const filteredData = mockMerchants.filter(m =>
    m.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.document.includes(searchTerm) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Merchants"
        subtitle="Gestão da Base de Clientes"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchants' },
          { label: 'Lista', page: 'AdminIntMerchantsList' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
            <Link to={createPageUrl('AdminIntNewMerchant')}>
              <Button className="bg-[#00D26A] hover:bg-[#00b059]"><Plus className="w-4 h-4 mr-2" /> Novo Merchant</Button>
            </Link>
          </div>
        }
      />

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por nome, CNPJ, ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-slate-600">
                {filteredData.length} merchants
              </Badge>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Empresa</TableHead>
                  <TableHead className="font-semibold">MCC</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">TPV (Mês)</TableHead>
                  <TableHead className="font-semibold">Aprovação</TableHead>
                  <TableHead className="font-semibold">CB %</TableHead>
                  <TableHead className="font-semibold">Saldo</TableHead>
                  <TableHead className="font-semibold">Plano</TableHead>
                  <TableHead className="font-semibold">Vendedor</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center text-slate-500">
                      Nenhum merchant encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((merchant) => (
                    <TableRow key={merchant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-mono text-xs text-slate-500">{merchant.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{merchant.business_name}</div>
                          <div className="text-xs text-slate-500">{merchant.document}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                          {merchant.mcc}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={merchant.status} />
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(merchant.tpv_month)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${merchant.approval_rate}%` }}
                            />
                          </div>
                          <span className="text-xs">{merchant.approval_rate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={merchant.cb_ratio > 0.5 ? "text-red-600 font-bold" : "text-slate-600"}>
                          {merchant.cb_ratio}%
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(merchant.balance)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{merchant.plan_name}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{merchant.commercial_agent}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + merchant.id}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" /> Configurações
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart2 className="w-4 h-4 mr-2" /> Analytics
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}