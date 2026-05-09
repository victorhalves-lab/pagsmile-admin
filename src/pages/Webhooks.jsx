import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Webhook, 
  Plus, 
  Eye, 
  MoreHorizontal,
  Copy,
  Trash2,
  Play,
  Pause,
  Activity,
  RefreshCw,
  Zap,
  Code as CodeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SideDrawer from '@/components/common/SideDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import EventCatalogPicker from '@/components/integrations/webhooks/EventCatalogPicker';
import WebhookLogsDrawer from '@/components/integrations/webhooks/WebhookLogsDrawer';
import TestWebhookDialog from '@/components/integrations/webhooks/TestWebhookDialog';
import WebhookHealthBadge from '@/components/integrations/webhooks/WebhookHealthBadge';

export default function Webhooks() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    description: '',
    events: [],
    tags: '',
    auth_method: 'signature',
    custom_headers: '',
    retry_policy: 'exponential_5x',
    filter_rules: '',
  });
  const [logsOpen, setLogsOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [activeWebhook, setActiveWebhook] = useState(null);

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
      setNewWebhook({ name: '', url: '', description: '', events: [], tags: '', auth_method: 'signature', custom_headers: '', retry_policy: 'exponential_5x', filter_rules: '' });
      toast.success('Webhook criado com sucesso!');
    }
  });

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
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate">{value}</p>
              <WebhookHealthBadge successRate={row.success_rate || 100} />
            </div>
            <p className="text-xs text-gray-500 truncate max-w-[280px]">{row.url}</p>
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
        <span className="text-sm text-gray-600 dark:text-slate-400">
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
            <DropdownMenuItem onClick={() => { setActiveWebhook(row); setLogsOpen(true); }}>
              <Activity className="w-4 h-4 mr-2" />
              Ver logs & detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setActiveWebhook(row); setTestOpen(true); }}>
              <Zap className="w-4 h-4 mr-2" />
              Testar evento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success('Replay 24h iniciado')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Replay últimas 24h
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              navigator.clipboard.writeText(row.secret || '');
              toast.success('Secret copiado!');
            }}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Secret
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
      toast.error('Nome, URL e ao menos 1 evento são obrigatórios');
      return;
    }
    createMutation.mutate(newWebhook);
  };

  const totalDeliveries = webhooks.reduce((s, w) => s + (w.total_sent || 0), 0);
  const totalFailed = webhooks.reduce((s, w) => s + (w.total_failed || 0), 0);
  const avgSuccess = webhooks.length > 0 ? Math.round(webhooks.reduce((s, w) => s + (w.success_rate || 100), 0) / webhooks.length) : 100;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webhooks"
        subtitle="Configure notificações HTTP em tempo real para seus sistemas"
        breadcrumbs={[
          { label: 'Integrações', page: 'Integrations' },
          { label: 'Webhooks', page: 'Webhooks' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Exemplos de código em 6 linguagens em breve')}>
              <CodeIcon className="w-4 h-4 mr-1" /> Code samples
            </Button>
            <Button 
              className="bg-[#2bc196] hover:bg-[#239b7a]"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Webhook
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Endpoints Ativos</p>
          <p className="text-2xl font-bold mt-1">{webhooks.filter(w => w.status === 'active').length}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Entregas (24h)</p>
          <p className="text-2xl font-bold mt-1">{totalDeliveries.toLocaleString('pt-BR')}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Taxa de Sucesso</p>
          <p className={cn('text-2xl font-bold mt-1', avgSuccess >= 95 ? 'text-emerald-600' : avgSuccess >= 80 ? 'text-amber-600' : 'text-red-600')}>{avgSuccess}%</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Falhas (24h)</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{totalFailed}</p>
        </div>
      </div>

      {/* Info Card - kept verbatim */}
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

      {/* Create Side Drawer - enriched */}
      <SideDrawer
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Novo Webhook"
        description="Configure URL, eventos e políticas avançadas"
        icon={Webhook}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#2bc196] hover:bg-[#239b7a]"
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Criando...' : 'Criar Webhook'}
            </Button>
          </div>
        }
      >
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="basic" className="text-xs">Básico</TabsTrigger>
            <TabsTrigger value="events" className="text-xs">Eventos</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Avançado</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input
                placeholder="Ex: CRM Sync"
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
              <Label>Descrição (opcional)</Label>
              <Textarea
                placeholder="Para que serve este webhook?"
                value={newWebhook.description}
                onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                className="min-h-[60px]"
              />
            </div>

            <div>
              <Label className="text-xs">Tags (opcional)</Label>
              <Input
                placeholder="crm, billing, marketing"
                value={newWebhook.tags}
                onChange={(e) => setNewWebhook({ ...newWebhook, tags: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Label className="mb-2 block">Eventos para Notificar *</Label>
            <EventCatalogPicker
              selected={newWebhook.events}
              onChange={(events) => setNewWebhook({ ...newWebhook, events })}
            />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label className="text-xs">Filtros Condicionais (opcional)</Label>
              <Input
                placeholder="Ex: amount > 1000 AND currency = BRL"
                value={newWebhook.filter_rules}
                onChange={(e) => setNewWebhook({ ...newWebhook, filter_rules: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Só notifica eventos que matcham esta condição</p>
            </div>

            <div>
              <Label className="text-xs">Política de Retry</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={newWebhook.retry_policy}
                onChange={(e) => setNewWebhook({ ...newWebhook, retry_policy: e.target.value })}
              >
                <option value="exponential_5x">Exponential backoff · 5 tentativas (recomendado)</option>
                <option value="linear_3x">Linear · 3 tentativas</option>
                <option value="aggressive_10x">Agressivo · 10 tentativas</option>
                <option value="only_5xx">Só fazer retry em erros 5xx</option>
                <option value="none">Sem retry</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Auth Method</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                value={newWebhook.auth_method}
                onChange={(e) => setNewWebhook({ ...newWebhook, auth_method: e.target.value })}
              >
                <option value="signature">HMAC Signature (padrão)</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="mtls">mTLS / Client Certificate</option>
              </select>
            </div>

            <div>
              <Label className="text-xs">Custom Headers (opcional, JSON)</Label>
              <Textarea
                placeholder='{"X-Custom-Header": "value"}'
                value={newWebhook.custom_headers}
                onChange={(e) => setNewWebhook({ ...newWebhook, custom_headers: e.target.value })}
                className="min-h-[60px] font-mono text-xs"
              />
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
              💡 <strong>Templates prontos:</strong> Slack · Discord · Teams · Email · PagerDuty
            </div>
          </TabsContent>
        </Tabs>
      </SideDrawer>

      {/* Drawers / Dialogs */}
      <WebhookLogsDrawer open={logsOpen} onOpenChange={setLogsOpen} webhook={activeWebhook} />
      <TestWebhookDialog open={testOpen} onOpenChange={setTestOpen} webhook={activeWebhook} />
    </div>
  );
}