import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Filter, Eye, Clock, AlertTriangle, CheckCircle2,
  MoreHorizontal, Download, UserPlus, Mail
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminIntOnboardingQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: queueItems, isLoading } = useQuery({
    queryKey: ['onboarding_queue'],
    queryFn: async () => {
        const all = await base44.entities.Subaccount.list(100);
        // Filter out active or completely rejected items to keep the queue relevant
        return all.filter(s => !['active', 'blocked', 'cancelled'].includes(s.status));
    },
  });

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox 
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox 
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "business_name",
      header: "Empresa",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{row.original.business_name || 'Prospect'}</div>
          <div className="text-xs text-slate-500">TPV Est: R$ {row.original.expected_monthly_volume ? row.original.expected_monthly_volume.toLocaleString() : '-'}</div>
        </div>
      )
    },
    {
      accessorKey: "onboarding_source",
      header: "Canal",
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="capitalize text-sm">{row.original.onboarding_source === 'commercial' ? 'Comercial' : 'Self-Service'}</span>
            {row.original.representative_name && (
                <span className="text-xs text-slate-400">{row.original.representative_name}</span>
            )}
        </div>
      )
    },
    {
      accessorKey: "status",
      header: "Etapa Atual",
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      id: "time_in_stage",
      header: "Tempo",
      cell: ({ row }) => {
        // Mock calculation - real would diff timestamp
        const days = Math.floor(Math.random() * 5); 
        return <span className="text-sm font-mono text-slate-600">{days}d</span>
      }
    },
    {
      id: "sla",
      header: "SLA",
      cell: ({ row }) => {
        // Mock logic
        const status = Math.random() > 0.8 ? 'warning' : 'ok';
        return status === 'ok' 
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            : <AlertTriangle className="w-4 h-4 text-amber-500" />
      }
    },
    {
      accessorKey: "assigned_analyst_id",
      header: "Responsável",
      cell: ({ row }) => (
          row.original.assigned_analyst_id 
            ? <span className="text-sm">{row.original.assigned_analyst_id}</span> 
            : <span className="text-xs text-slate-400 italic">Não atribuído</span>
      )
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                <DropdownMenuItem>Atribuir</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fila de Onboarding" 
        subtitle="Visão unificada de ativações pendentes"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" /> Lembretes em Massa
           </Button>
           <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Exportar
           </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={queueItems || []} 
          loading={isLoading}
        />
      </div>
    </div>
  );
}