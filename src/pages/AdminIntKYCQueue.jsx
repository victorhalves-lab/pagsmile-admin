import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, PlayCircle, Eye, AlertCircle, Clock, Users, 
  Sparkles, CheckCircle2, XCircle, ArrowUpRight, Building2, RefreshCw
} from 'lucide-react';
import { mockMerchants } from '@/components/mockData/adminInternoMocks';
import { cn } from '@/lib/utils';

const KPICard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600", border: "border-blue-100 dark:border-blue-800" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600", border: "border-red-100 dark:border-red-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600", border: "border-amber-100 dark:border-amber-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600", border: "border-purple-100 dark:border-purple-800" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600", border: "border-emerald-100 dark:border-emerald-800" },
  };
  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={cn("p-4 rounded-xl border bg-white dark:bg-slate-900", colors.border)}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
        {trend && (
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-0.5">{title}</p>
      <p className={cn("text-lg font-bold", `text-${color}-600`)}>{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
};

export default function AdminIntKYCQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const queueItems = mockMerchants.filter(m => 
    ['pending_compliance', 'under_review'].includes(m.compliance_status) || 
    m.kyc_score < 70
  );

  const filteredQueue = queueItems.filter(m => {
    const matchSearch = m.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.document.includes(searchTerm);
    const matchTab = activeTab === 'all' || 
      (activeTab === 'high' && m.kyc_score < 50) ||
      (activeTab === 'medium' && m.kyc_score >= 50 && m.kyc_score < 70) ||
      (activeTab === 'flags' && m.ai_red_flags?.length > 0);
    return matchSearch && matchTab;
  });

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
      accessorKey: "category",
      header: "Tipo",
      cell: ({ row }) => <span className="capitalize text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{row.original.category || 'PJ'}</span>
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
      cell: ({ row }) => {
        const decision = row.original.kyc_decision;
        const variant = decision === 'approved' ? 'default' : decision === 'rejected' ? 'destructive' : 'secondary';
        return (
          <Badge variant={variant} className="capitalize">
            {decision?.replace('_', ' ') || 'Pendente'}
          </Badge>
        );
      }
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
      cell: ({ row }) => {
        const created = new Date(row.original.created_at);
        const now = new Date();
        const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        return (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {days}d
          </span>
        );
      }
    },
    {
      id: "priority",
      header: "Prioridade",
      cell: ({ row }) => {
        const score = row.original.kyc_score;
        const priority = score < 50 ? 'Alta' : score < 70 ? 'Média' : 'Normal';
        const className = score < 50 ? 'bg-red-100 text-red-700' : score < 70 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700';
        return <Badge className={`text-[10px] ${className}`}>{priority}</Badge>;
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
          <div className="flex gap-2">
            <Link to={createPageUrl('AdminIntSubaccountDetail') + '?id=' + row.original.id}>
                 <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
            </Link>
            <Link to={createPageUrl('AdminIntKycAnalysis') + '?id=' + row.original.id}>
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
        breadcrumbs={[
          { label: 'KYC & Compliance', page: 'AdminIntKYC' },
          { label: 'Fila de Análise', page: 'AdminIntKYCQueue' }
        ]}
      />

      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border">
          <div className="text-sm text-slate-500">Total na Fila</div>
          <div className="text-2xl font-bold">{filteredQueue.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-l-4 border-l-red-500">
          <div className="text-sm text-slate-500">Alta Prioridade</div>
          <div className="text-2xl font-bold text-red-600">{filteredQueue.filter(m => m.kyc_score < 50).length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-l-4 border-l-amber-500">
          <div className="text-sm text-slate-500">Média Prioridade</div>
          <div className="text-2xl font-bold text-amber-600">{filteredQueue.filter(m => m.kyc_score >= 50 && m.kyc_score < 70).length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-l-4 border-l-purple-500">
          <div className="text-sm text-slate-500">Com Red Flags</div>
          <div className="text-2xl font-bold text-purple-600">{filteredQueue.filter(m => m.ai_red_flags?.length > 0).length}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredQueue} 
        />
      </div>
    </div>
  );
}