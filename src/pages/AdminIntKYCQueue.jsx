import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, PlayCircle, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntKYCQueue() {
  const [searchTerm, setSearchTerm] = useState('');

import { mockMerchants } from '@/components/mockData/adminInternoMocks';

// Filter mock merchants for those needing review
const queueItems = mockMerchants.filter(m => ['pending_compliance', 'under_review'].includes(m.compliance_status) || m.kyc_score < 70);
const isLoading = false;

  const columns = [
    {
      accessorKey: "business_name",
      header: "Empresa",
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{row.original.business_name}</div>
          <div className="text-xs text-slate-500">{row.original.document}</div>
        </div>
      )
    },
    {
      accessorKey: "account_type",
      header: "Tipo",
      cell: ({ row }) => <span className="capitalize text-xs">{row.original.account_type?.replace('_', ' ')}</span>
    },
    {
      accessorKey: "kyc_score",
      header: "Score HELENA",
      cell: ({ row }) => {
          const score = row.original.kyc_score;
          const color = score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';
          return <span className={`font-bold ${color}`}>{score || '-'}</span>
      }
    },
    {
      accessorKey: "kyc_decision",
      header: "Decisão IA",
      cell: ({ row }) => (
          <Badge variant={row.original.kyc_decision === 'approved' ? 'success' : 'outline'} className="capitalize">
              {row.original.kyc_decision?.replace('_', ' ') || 'Pendente'}
          </Badge>
      )
    },
    {
      id: "red_flags",
      header: "Red Flags",
      cell: ({ row }) => {
          const count = row.original.ai_red_flags?.length || 0;
          return count > 0 ? (
            <div className="flex items-center text-red-600 text-xs font-medium">
                <AlertCircle className="w-3 h-3 mr-1" />
                {count}
            </div>
          ) : <span className="text-slate-400 text-xs">-</span>
      }
    },
    {
      id: "time_in_queue",
      header: "Tempo Fila",
      cell: () => <span className="text-xs text-slate-500">12h</span> // Mock
    },
    {
      id: "priority",
      header: "Prioridade",
      cell: () => <Badge variant="secondary" className="text-[10px]">Normal</Badge> // Mock
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
          <div className="flex gap-2">
            <Link to={createPageUrl('AdminIntSubaccountDetail', { id: row.original.id })}>
                 <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
            </Link>
            <Link to={createPageUrl('AdminIntKycAnalysis', { id: row.original.id })}>
                 <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <PlayCircle className="w-4 h-4 mr-2" /> Analisar
                 </Button>
            </Link>
          </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Fila de Análise KYC" 
        subtitle="Casos aguardando revisão manual"
      />

      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Buscar empresa ou CNPJ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filtros Avançados
        </Button>
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