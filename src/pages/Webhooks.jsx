import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Webhook, 
  Plus, 
  Eye, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

const availableEvents = [
  { id: 'transaction.approved', label: 'Transação Aprovada' },
  { id: 'transaction.declined', label: 'Transação Recusada' },
  { id: 'transaction.refunded', label: 'Transação Estornada' },
  { id: 'chargeback.received', label: 'Chargeback Recebido' },
  { id: 'chargeback.won', label: 'Chargeback Vencido' },
  { id: 'chargeback.lost', label: 'Chargeback Perdido' },
  { id: 'subscription.created', label: 'Assinatura Criada' },
  { id: 'subscription.cancelled', label: 'Assinatura Cancelada' },
  { id: 'subscription.payment_failed', label: 'Pagamento de Assinatura Falhou' },
  { id: 'pix.received', label: 'Pix Recebido' },
  { id: 'withdrawal.completed', label: 'Saque Concluído' },
];

export default function Webhooks() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [],
  });

  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading, refetch } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => base44.entities.Webhook.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Webhook.create({
      ...data,
      webhook_id: `wh_${Date.now()}`,
      secret: `whsec_${Math.random().toString(36).substring(2)}`,
      status: 'active',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['webhooks']);
      setIsCreateOpen(false);
      setNewWebhook({ name: '', url: '', events: [] });
      toast.success('Webhook criado com sucesso!');
    }
  });

  const toggleEvent = (eventId) => {
    setNewWebhook(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }));
  };

  const columns = [
    {
      key: 'name',
      label: 'Webhook',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.status === 'active' ? 'bg-emerald-100' : 
            row.status === 'failing' ? 'bg-red-100' : 'bg-gray-100'
          )}>
            <Webhook className={cn(
              "w-5 h-5",
              row.status === 'active' ? 'text-emerald-600' : 
              row.status === 'failing' ? 'text-red-600' : 'text-gray-400'
            )} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 truncate max-w-[200px]">{row.url}</p>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'events',
      label: 'Eventos',
      render: (value) => (
        <span className="text-sm">{value?.length || 0} eventos</span>
      )
    },
    {
      key: 'success_rate',
      label: 'Taxa de Sucesso',
      render: (value) => {
        const rate = value || 100;
        return (
          <div className="flex items-center gap-2">
            <Progress value={rate} className="w-16 h-2" />
            <span className={cn(
              "text-sm font-medium",
              rate >= 95 ? 'text-emerald-600' : rate >= 80 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {rate}%
            </span>
          </div>
        );
      }
    },
    {
      key: 'total_sent',
      label: 'Enviados',
      render: (value, row) => (
        <div>
          <p className="text-sm font-medium">{value || 0}</p>
          {row.total_failed > 0 && (
            <p className="text-xs text-red-500">{row.total_failed} falhas</p>
          )}
        </div>
      )
    },
    {
      key: 'last_sent_at',
      label: 'Último Envio',
      render: (value) => value ? (
        <span className="text-sm text-gray-600">
          {format(new Date(value), 'dd/MM HH:mm', { locale: ptBR })}
        </span>
      ) : 'Nunca'
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Play className="w-4 h-4 mr-2" />
              Testar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              navigator.clipboard.writeText(row.secret);
              toast.success('Secret copiado!');
            }}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Secret
            </DropdownMenuItem>
            <DropdownMenuItem>
              {row.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Ativar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const handleCreate = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    createMutation.mutate(newWebhook);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhooks"
        subtitle="Configure notificações para seus sistemas"
        breadcrumbs={[
          { label: 'Integrações', page: 'Integrations' },
          { label: 'Webhooks', page: 'Webhooks' }
        ]}
        actions={
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Webhook
          </Button>
        }
      />

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Webhook className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">O que são Webhooks?</h4>
            <p className="text-sm text-blue-800 mt-1">
              Webhooks são notificações HTTP enviadas automaticamente para sua URL quando eventos importantes acontecem, 
              como transações aprovadas, chargebacks recebidos, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={webhooks}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nome ou URL..."
        pagination
        pageSize={25}
        currentPage={1}
        totalItems={webhooks.length}
        onRefresh={refetch}
        emptyMessage="Nenhum webhook configurado"
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Webhook</DialogTitle>
            <DialogDescription>
              Configure uma URL para receber notificações de eventos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input
                placeholder="Ex: Meu Sistema"
                value={newWebhook.name}
                onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
              />
            </div>

            <div>
              <Label>URL de Destino *</Label>
              <Input
                placeholder="https://seu-sistema.com/webhook"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Deve ser uma URL HTTPS acessível publicamente
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Eventos para Notificar *</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {availableEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-2">
                    <Checkbox
                      id={event.id}
                      checked={newWebhook.events.includes(event.id)}
                      onCheckedChange={() => toggleEvent(event.id)}
                    />
                    <label htmlFor={event.id} className="text-sm cursor-pointer">
                      {event.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Criando...' : 'Criar Webhook'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}