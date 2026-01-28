import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, Eye, Bell, Phone, 
  MoreHorizontal, PlayCircle 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminIntSelfService() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch Subaccounts
  const { data: subaccounts, isLoading } = useQuery({
    queryKey: ['subaccounts_self_service', statusFilter],
    queryFn: async () => {
      // In a real app we would use filters in the query
      // For now we fetch list and filter in frontend or use simplified filter
      const all = await base44.entities.Subaccount.list(100);
      return all.filter(s => s.onboarding_source === 'self_service');
    },
  });

  const filteredData = subaccounts?.filter(item => {
    const matchesSearch = 
        item.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.document?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const columns = [
    {
      accessorKey: "subaccount_id",
      header: "ID",
      cell: ({ row }) => <span className="text-xs font-mono text-slate-500">{row.original.subaccount_id.slice(0, 8)}</span>
    },
    {
      accessorKey: "business_name",
      header: "Empresa",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{row.original.business_name || 'Sem nome'}</div>
          <div className="text-xs text-slate-500">{row.original.document}</div>
        </div>
      )
    },
    {
      accessorKey: "plan_chosen",
      header: "Plano",
      cell: ({ row }) => <span className="capitalize">{row.original.plan_chosen || '-'}</span>
    },
    {
      accessorKey: "account_type",
      header: "Tipo",
      cell: ({ row }) => (
        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
            {row.original.account_type === 'pix_only' ? 'Só Pix' : 'Pix + Cartão'}
        </span>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      accessorKey: "kyc_score",
      header: "Score KYC",
      cell: ({ row }) => {
        const score = row.original.kyc_score;
        if (!score) return <span className="text-slate-400">-</span>;
        
        let color = "text-red-500";
        if (score >= 80) color = "text-emerald-500";
        else if (score >= 50) color = "text-amber-500";

        return <span className={`font-bold ${color}`}>{score}</span>
      }
    },
    {
      accessorKey: "created_date",
      header: "Criado em",
      cell: ({ row }) => <span className="text-xs text-slate-500">{new Date(row.original.created_date).toLocaleDateString()}</span>
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
            <Eye className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Bell className="w-4 h-4 mr-2" /> Enviar Lembrete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="w-4 h-4 mr-2" /> Registrar Contato
              </DropdownMenuItem>
              {['manual_review', 'kyc_in_analysis'].includes(row.original.status) && (
                  <DropdownMenuItem>
                    <PlayCircle className="w-4 h-4 mr-2" /> Analisar KYC
                  </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contas Self-Service" 
        subtitle="Gestão de contas criadas via site"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar por empresa ou CNPJ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filtros
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          loading={isLoading}
        />
      </div>
    </div>
  );
}