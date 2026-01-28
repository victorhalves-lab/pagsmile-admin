import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlayCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntKYCQueue() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: queue, isLoading } = useQuery({
    queryKey: ['kyc_queue'],
    queryFn: async () => {
        const all = await base44.entities.Subaccount.list(100);
        return all.filter(s => ['manual_review', 'kyc_in_analysis', 'reprove_review'].includes(s.status) || s.kyc_decision === 'manual_review');
    }
  });

  const columns = [
    {
      accessorKey: "business_name",
      header: "Empresa",
      cell: ({ row }) => (
        <div>
           <div className="font-medium">{row.original.business_name}</div>
           <div className="text-xs text-slate-500">{row.original.document}</div>
        </div>
      )
    },
    {
      accessorKey: "account_type",
      header: "Tipo",
      cell: ({ row }) => <span className="capitalize">{row.original.account_type?.replace('_', ' + ')}</span>
    },
    {
      accessorKey: "kyc_score",
      header: "Score",
      cell: ({ row }) => (
        <span className={`font-bold ${row.original.kyc_score < 60 ? 'text-red-500' : 'text-amber-500'}`}>
            {row.original.kyc_score}
        </span>
      )
    },
    {
      accessorKey: "kyc_decision",
      header: "Decisão HELENA",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            {row.original.kyc_decision === 'manual_review' ? 'Análise Manual' : row.original.kyc_decision}
        </span>
      )
    },
    {
      id: "red_flags",
      header: "Red Flags",
      cell: ({ row }) => (
          <div className="flex items-center gap-1 text-red-600 font-medium">
             <AlertTriangle className="w-4 h-4" />
             {row.original.ai_red_flags?.length || 0}
          </div>
      )
    },
    {
        id: "priority",
        header: "Prioridade",
        cell: ({ row }) => {
            const priority = row.original.expected_monthly_volume > 500000 ? 'Alta' : 'Normal';
            return <span className={priority === 'Alta' ? 'text-red-600 font-bold' : ''}>{priority}</span>
        }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Link to={`${createPageUrl('AdminIntKycAnalysis')}?id=${row.original.subaccount_id}`}>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <PlayCircle className="w-4 h-4 mr-2" /> Analisar
            </Button>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fila de Análise KYC" 
        subtitle="Processos pendentes de revisão manual"
      />

      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
         <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
                placeholder="Buscar por CNPJ ou Razão Social..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <DataTable columns={columns} data={queue || []} loading={isLoading} />
      </div>
    </div>
  );
}