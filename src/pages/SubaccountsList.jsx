import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Settings,
  DollarSign,
  AlertTriangle,
  Mail,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatCurrency } from '@/components/utils';

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
  pending_documents: { label: 'Docs Pendentes', color: 'bg-yellow-100 text-yellow-700' },
  under_review: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700' },
  active: { label: 'Ativa', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspensa', color: 'bg-orange-100 text-orange-700' },
  blocked: { label: 'Bloqueada', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-600' },
};

export default function SubaccountsList() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubaccount, setSelectedSubaccount] = useState(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionReason, setActionReason] = useState('');

  const { data: subaccounts = [], isLoading, refetch } = useQuery({
    queryKey: ['subaccounts'],
    queryFn: () => base44.entities.Subaccount.list('-created_date', 200)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Subaccount.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subaccounts'] });
      toast.success('Subconta atualizada!');
      setShowActionDialog(false);
      setSelectedSubaccount(null);
      setActionReason('');
    }
  });

  const filteredSubaccounts = useMemo(() => {
    return subaccounts.filter(sub => {
      const matchesSearch = !searchTerm || 
        sub.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.document?.includes(searchTerm) ||
        sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subaccounts, searchTerm, statusFilter]);

  const handleAction = (subaccount, action) => {
    setSelectedSubaccount(subaccount);
    setActionType(action);
    setShowActionDialog(true);
  };

  const executeAction = () => {
    if (!selectedSubaccount || !actionType) return;

    let updateData = {};

    switch (actionType) {
      case 'approve':
        updateData = { status: 'active', approval_date: new Date().toISOString() };
        break;
      case 'reject':
        updateData = { status: 'blocked', rejection_reason: actionReason };
        break;
      case 'suspend':
        updateData = { status: 'suspended', suspension_reason: actionReason };
        break;
      case 'reactivate':
        updateData = { status: 'active', suspension_reason: null };
        break;
    }

    updateMutation.mutate({ id: selectedSubaccount.id, data: updateData });
  };

  const columns = [
    {
      key: 'business_name',
      title: 'Subconta',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Building2 className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium">{row.business_name}</p>
            <p className="text-xs text-gray-500">{row.document}</p>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contato',
      render: (_, row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Mail className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{row.email}</span>
          </div>
          {row.phone && (
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
              <Phone className="w-3 h-3" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'mcc',
      title: 'Categoria',
      render: (_, row) => (
        <div>
          <Badge variant="outline">{row.mcc || '-'}</Badge>
          {row.mcc_description && (
            <p className="text-xs text-gray-500 mt-0.5">{row.mcc_description}</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, row) => {
        const config = statusConfig[row.status] || statusConfig.draft;
        return (
          <Badge className={config.color}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'total_volume',
      title: 'GMV',
      render: (value) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'available_balance',
      title: 'Saldo',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'risk_level',
      title: 'Risco',
      render: (value) => {
        if (!value) return '-';
        const colors = {
          low: 'bg-green-100 text-green-700',
          medium: 'bg-yellow-100 text-yellow-700',
          high: 'bg-red-100 text-red-700'
        };
        return (
          <Badge className={colors[value] || colors.low}>
            {value === 'low' ? 'Baixo' : value === 'medium' ? 'Médio' : 'Alto'}
          </Badge>
        );
      }
    },
    {
      key: 'created_date',
      title: 'Cadastro',
      render: (value) => format(new Date(value), 'dd/MM/yyyy')
    },
    {
      key: 'actions',
      title: '',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {['draft', 'pending_documents', 'under_review'].includes(row.status) && (
              <>
                <DropdownMenuItem onClick={() => handleAction(row, 'approve')}>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Aprovar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction(row, 'reject')}>
                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                  Rejeitar
                </DropdownMenuItem>
              </>
            )}
            {row.status === 'active' && (
              <DropdownMenuItem onClick={() => handleAction(row, 'suspend')}>
                <Pause className="w-4 h-4 mr-2 text-orange-600" />
                Suspender
              </DropdownMenuItem>
            )}
            {row.status === 'suspended' && (
              <DropdownMenuItem onClick={() => handleAction(row, 'reactivate')}>
                <Play className="w-4 h-4 mr-2 text-green-600" />
                Reativar
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Alterar Limites
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DollarSign className="w-4 h-4 mr-2" />
              Alterar Taxas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const actionDialogContent = {
    approve: {
      title: 'Aprovar Subconta',
      description: 'Esta subconta será aprovada e poderá começar a processar transações.',
      buttonText: 'Aprovar',
      buttonClass: 'bg-green-600 hover:bg-green-700',
      requireReason: false
    },
    reject: {
      title: 'Rejeitar Subconta',
      description: 'Esta subconta será rejeitada e não poderá operar.',
      buttonText: 'Rejeitar',
      buttonClass: 'bg-red-600 hover:bg-red-700',
      requireReason: true
    },
    suspend: {
      title: 'Suspender Subconta',
      description: 'Esta subconta será temporariamente impedida de processar transações.',
      buttonText: 'Suspender',
      buttonClass: 'bg-orange-600 hover:bg-orange-700',
      requireReason: true
    },
    reactivate: {
      title: 'Reativar Subconta',
      description: 'Esta subconta será reativada e poderá voltar a processar transações.',
      buttonText: 'Reativar',
      buttonClass: 'bg-green-600 hover:bg-green-700',
      requireReason: false
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subcontas"
        subtitle="Gerencie as subcontas do seu marketplace"
        breadcrumbs={[
          { label: 'Subcontas', page: 'SubaccountsDashboard' },
          { label: 'Lista' }
        ]}
        actions={
          <Button asChild>
            <Link to={createPageUrl('SubaccountOnboarding')}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Subconta
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, CNPJ ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="outline">
              {filteredSubaccounts.length} subcontas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={filteredSubaccounts}
            isLoading={isLoading}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialogContent[actionType]?.title}</DialogTitle>
            <DialogDescription>
              {actionDialogContent[actionType]?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedSubaccount && (
            <div className="py-4">
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <p className="font-medium">{selectedSubaccount.business_name}</p>
                <p className="text-sm text-gray-500">{selectedSubaccount.document}</p>
              </div>

              {actionDialogContent[actionType]?.requireReason && (
                <div className="space-y-2">
                  <Label>Motivo *</Label>
                  <Textarea
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Informe o motivo..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancelar
            </Button>
            <Button
              className={actionDialogContent[actionType]?.buttonClass}
              onClick={executeAction}
              disabled={actionDialogContent[actionType]?.requireReason && !actionReason}
            >
              {actionDialogContent[actionType]?.buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}