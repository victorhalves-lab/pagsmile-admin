import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import KPICard from '@/components/dashboard/KPICard';
import { ShoppingBag, Users, Clock, AlertTriangle, Eye, DollarSign } from 'lucide-react';
import { mockSubaccounts } from '@/components/mockData/adminInternoMocks';

export default function AdminIntSubaccounts() {
  const marketplaces = [
    { id: 'M-001', name: 'Marketplace A', subaccounts: 350, active: 320, pending: 15, gmv: 8500000, status: 'active' },
    { id: 'M-002', name: 'Marketplace B', subaccounts: 280, active: 265, pending: 8, gmv: 4200000, status: 'active' },
    { id: 'M-003', name: 'Marketplace C', subaccounts: 215, active: 200, pending: 5, gmv: 2300000, status: 'warning' },
  ];

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subcontas & Marketplaces"
        subtitle="Gestão de Sellers e Splits"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchants' },
          { label: 'Subcontas', page: 'AdminIntSubaccounts' }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Marketplaces" value="12" icon={ShoppingBag} />
        <KPICard title="Subcontas Total" value="845" icon={Users} />
        <KPICard title="Aguard. Aprovação" value="28" icon={Clock} className="border-l-4 border-l-amber-500" />
        <KPICard title="GMV Subcontas" value="15M" prefix="R$ " icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Marketplaces */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Marketplaces</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800">
                    <TableHead>Marketplace</TableHead>
                    <TableHead>Subcontas</TableHead>
                    <TableHead>Ativas</TableHead>
                    <TableHead>Pendentes</TableHead>
                    <TableHead>GMV</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketplaces.map((mp) => (
                    <TableRow key={mp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium">{mp.name}</TableCell>
                      <TableCell>{mp.subaccounts}</TableCell>
                      <TableCell className="text-green-600 font-medium">{mp.active}</TableCell>
                      <TableCell className="text-amber-600">{mp.pending}</TableCell>
                      <TableCell className="font-medium">R$ {(mp.gmv / 1000000).toFixed(1)}M</TableCell>
                      <TableCell><StatusBadge status={mp.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Subcontas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Subcontas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800">
                  <TableHead>Vendedor</TableHead>
                  <TableHead>GMV</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubaccounts.map((sub) => (
                  <TableRow key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{sub.name}</div>
                        <div className="text-xs text-slate-500">{sub.marketplace}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatCurrency(sub.gmv)}</TableCell>
                    <TableCell><StatusBadge status={sub.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}