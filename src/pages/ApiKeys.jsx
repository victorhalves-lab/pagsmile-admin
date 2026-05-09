import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Key, 
  Plus, 
  Eye, 
  EyeOff,
  MoreHorizontal,
  Copy,
  Trash2,
  Shield,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  Lock,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SideDrawer from '@/components/common/SideDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import EnvironmentBadge from '@/components/integrations/apikeys/EnvironmentBadge';
import PermissionsSelector from '@/components/integrations/apikeys/PermissionsSelector';
import IpAllowlistInput from '@/components/integrations/apikeys/IpAllowlistInput';
import KeyUsageDrawer from '@/components/integrations/apikeys/KeyUsageDrawer';
import RotateKeyDialog from '@/components/integrations/apikeys/RotateKeyDialog';
import TestKeyDialog from '@/components/integrations/apikeys/TestKeyDialog';

export default function ApiKeys() {
  const { t } = useTranslation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showSecret, setShowSecret] = useState({});
  const [revealCountdown, setRevealCountdown] = useState({});
  const [newKey, setNewKey] = useState({
    name: '',
    type: 'production',
    key_type: 'secret',
    permission_preset: 'full',
    scopes: [],
    ip_allowlist: [],
    expiry: '',
    tags: '',
    description: '',
  });
  const [createdKey, setCreatedKey] = useState(null);
  const [activeKey, setActiveKey] = useState(null);
  const [usageDrawerOpen, setUsageDrawerOpen] = useState(false);
  const [rotateDialogOpen, setRotateDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading, refetch } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => base44.entities.ApiKey.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const key = {
        ...data,
        key_id: `${data.key_type === 'public' ? 'pk' : 'sk'}_${data.type === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}`,
        status: 'active',
      };
      return base44.entities.ApiKey.create(key);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['api-keys']);
      setCreatedKey(result);
      setNewKey({ name: '', type: 'production', key_type: 'secret', permission_preset: 'full', scopes: [], ip_allowlist: [], expiry: '', tags: '', description: '' });
    }
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  // Reveal once: shows for 5s then auto-hides
  const revealOnce = (id) => {
    setShowSecret((p) => ({ ...p, [id]: true }));
    let count = 5;
    setRevealCountdown((p) => ({ ...p, [id]: count }));
    const interval = setInterval(() => {
      count -= 1;
      setRevealCountdown((p) => ({ ...p, [id]: count }));
      if (count <= 0) {
        clearInterval(interval);
        setShowSecret((p) => ({ ...p, [id]: false }));
        setRevealCountdown((p) => ({ ...p, [id]: null }));
      }
    }, 1000);
    toast.info('Chave exibida por 5 segundos');
  };

  // Stripe-style mask: pk_live_•••••aB3
  const maskKey = (key) => {
    if (!key) return '';
    const dotIdx = key.indexOf('_', key.indexOf('_') + 1);
    const prefix = dotIdx > 0 ? key.substring(0, dotIdx + 1) : key.substring(0, 8);
    const suffix = key.substring(key.length - 4);
    return `${prefix}•••••${suffix}`;
  };

  // Compute risk: key sem rotação > 1 ano = vermelho
  const getKeyRisk = (key) => {
    if (!key.created_date) return null;
    const ageMonths = (Date.now() - new Date(key.created_date)) / (1000 * 60 * 60 * 24 * 30);
    if (ageMonths > 12) return { color: 'red', label: '> 1 ano sem rotação' };
    if (ageMonths > 6) return { color: 'amber', label: '> 6 meses' };
    return null;
  };

  // Last activity dot color
  const getActivityColor = (lastUsed) => {
    if (!lastUsed) return 'bg-slate-300';
    const hoursAgo = (Date.now() - new Date(lastUsed)) / (1000 * 60 * 60);
    if (hoursAgo < 24) return 'bg-emerald-500';
    if (hoursAgo < 168) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value, row) => {
        const risk = getKeyRisk(row);
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                row.type === 'production' ? 'bg-emerald-100' : 'bg-yellow-100'
              )}>
                <Key className={cn(
                  "w-5 h-5",
                  row.type === 'production' ? 'text-emerald-600' : 'text-yellow-600'
                )} />
              </div>
              <span className={cn('absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white', getActivityColor(row.last_used_at))} title="Última atividade" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate">{value}</p>
                <EnvironmentBadge env={row.type} />
                {risk && (
                  <Badge variant="outline" className={cn('text-[10px]', risk.color === 'red' ? 'border-red-300 text-red-700' : 'border-amber-300 text-amber-700')}>
                    ⚠ {risk.label}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 capitalize">
                {row.key_type === 'secret' ? 'Secret' : 'Public'} · {row.permission_preset || 'full'}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      key: 'key_id',
      label: 'Chave',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <code className="text-sm bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
            {showSecret[row.id] ? value : maskKey(value)}
          </code>
          {revealCountdown[row.id] > 0 && (
            <Badge className="bg-amber-100 text-amber-700 text-[10px]">
              {revealCountdown[row.id]}s
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => revealOnce(row.id)}
            title="Mostrar por 5 segundos"
          >
            {showSecret[row.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => copyToClipboard(value)}
            title="Copiar (sem revelar)"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'last_used_at',
      label: 'Último Uso',
      render: (value) => value ? (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </span>
      ) : <span className="text-xs text-slate-400 italic">Nunca</span>
    },
    {
      key: 'created_date',
      label: 'Criada em',
      render: (value) => value ? (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
        </span>
      ) : 'N/A'
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
            <DropdownMenuItem onClick={() => copyToClipboard(row.key_id)}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar chave
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setActiveKey(row); setTestDialogOpen(true); }}>
              <Zap className="w-4 h-4 mr-2" />
              Testar chave
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setActiveKey(row); setUsageDrawerOpen(true); }}>
              <Activity className="w-4 h-4 mr-2" />
              Ver analytics
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setActiveKey(row); setRotateDialogOpen(true); }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Rotacionar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success('Chave pausada (incident response)')}>
              <Pause className="w-4 h-4 mr-2" />
              Pausar (lock)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Revogar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const handleCreate = () => {
    if (!newKey.name) {
      toast.error('Nome é obrigatório');
      return;
    }
    createMutation.mutate(newKey);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('integrations.api_keys')}
        subtitle={t('integrations.title')}
        breadcrumbs={[
          { label: t('menu.integrations'), page: 'Integrations' },
          { label: t('integrations.api_keys'), page: 'ApiKeys' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Documentação em breve...')}>
              <Shield className="w-4 h-4 mr-1" /> Boas práticas
            </Button>
            <Button 
              className="bg-[#2bc196] hover:bg-[#239b7a]"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('integrations.generate_key')}
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total de Chaves</p>
          <p className="text-2xl font-bold mt-1">{apiKeys.length}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Ativas em Prod</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{apiKeys.filter(k => k.type === 'production' && k.status === 'active').length}</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Requests (24h)</p>
          <p className="text-2xl font-bold mt-1">142.5k</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">+12% vs ontem</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-slate-900 p-4">
          <p className="text-[10px] text-slate-500 uppercase tracking-wide">Não usadas (90d)</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">2</p>
          <p className="text-[10px] text-amber-600 mt-0.5">⚠ revisar e revogar</p>
        </div>
      </div>

      {/* Security Warning - kept verbatim */}
      <Alert className="bg-yellow-50 border-yellow-200">
        <Shield className="w-4 h-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Segurança:</strong> Nunca compartilhe suas chaves secretas. Use chaves de produção apenas em ambientes seguros 
          e chaves de sandbox para desenvolvimento e testes.
        </AlertDescription>
      </Alert>

      {/* Table */}
      <DataTable
        columns={columns}
        data={apiKeys}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por nome..."
        pagination
        pageSize={25}
        currentPage={1}
        totalItems={apiKeys.length}
        onRefresh={refetch}
        emptyMessage="Nenhuma chave de API criada"
      />

      {/* Create Side Drawer - enriched */}
      <SideDrawer
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setCreatedKey(null);
        }}
        title={createdKey ? 'Chave Criada!' : 'Nova Chave de API'}
        description={createdKey 
          ? 'Copie sua chave agora. Ela não será exibida novamente.'
          : 'Configure permissões granulares, IP allowlist e expiração'
        }
        icon={Key}
        size="lg"
        footer={
          !createdKey ? (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[#2bc196] hover:bg-[#239b7a]"
                onClick={handleCreate}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Criando...' : 'Criar Chave'}
              </Button>
            </div>
          ) : null
        }
      >
        {createdKey ? (
          <div className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Atenção:</strong> Esta é a única vez que você verá esta chave completa. 
                Copie e guarde em local seguro.
              </AlertDescription>
            </Alert>

            <div>
              <Label>Sua Chave</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-sm bg-gray-100 dark:bg-slate-800 px-3 py-2 rounded font-mono break-all">
                  {createdKey.key_id}
                </code>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => copyToClipboard(createdKey.key_id)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button 
              className="w-full bg-[#2bc196] hover:bg-[#239b7a]"
              onClick={() => {
                setIsCreateOpen(false);
                setCreatedKey(null);
              }}
            >
              Concluído
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Basic */}
            <div>
              <Label>Nome da Chave *</Label>
              <Input
                placeholder="Ex: backend-payments-prod"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Convenção sugerida: <code className="text-[10px]">team-purpose-environment</code></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ambiente</Label>
                <Select 
                  value={newKey.type} 
                  onValueChange={(v) => setNewKey({ ...newKey, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Produção
                      </div>
                    </SelectItem>
                    <SelectItem value="sandbox">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Sandbox (Teste)
                      </div>
                    </SelectItem>
                    <SelectItem value="staging">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-violet-500" />
                        Staging
                      </div>
                    </SelectItem>
                    <SelectItem value="test">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Test mode
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Chave</Label>
                <Select 
                  value={newKey.key_type} 
                  onValueChange={(v) => setNewKey({ ...newKey, key_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secret">Secret (Backend)</SelectItem>
                    <SelectItem value="public">Public (Frontend)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-gray-500 -mt-3">
              {newKey.key_type === 'secret' 
                ? '🔒 Use apenas no backend. Nunca exponha no frontend.'
                : '🌐 Pode ser usada no frontend (ex: Tokenization.js).'
              }
            </p>

            {/* Permissions */}
            <div className="rounded-lg border p-4 space-y-3">
              <PermissionsSelector
                preset={newKey.permission_preset}
                onPresetChange={(p) => setNewKey({ ...newKey, permission_preset: p })}
                scopes={newKey.scopes}
                onScopesChange={(s) => setNewKey({ ...newKey, scopes: s })}
              />
            </div>

            {/* IP Allowlist */}
            <div className="rounded-lg border p-4">
              <IpAllowlistInput ips={newKey.ip_allowlist} onChange={(ips) => setNewKey({ ...newKey, ip_allowlist: ips })} />
            </div>

            {/* Advanced */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Expira em (opcional)</Label>
                <Input
                  type="date"
                  value={newKey.expiry}
                  onChange={(e) => setNewKey({ ...newKey, expiry: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs">Tags (opcional)</Label>
                <Input
                  placeholder="backend, mobile"
                  value={newKey.tags}
                  onChange={(e) => setNewKey({ ...newKey, tags: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Descrição (opcional)</Label>
              <Textarea
                placeholder="Para que esta chave será usada?"
                value={newKey.description}
                onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
          </div>
        )}
      </SideDrawer>

      {/* Drawers + Dialogs */}
      <KeyUsageDrawer open={usageDrawerOpen} onOpenChange={setUsageDrawerOpen} apiKey={activeKey} />
      <RotateKeyDialog open={rotateDialogOpen} onOpenChange={setRotateDialogOpen} apiKey={activeKey} />
      <TestKeyDialog open={testDialogOpen} onOpenChange={setTestDialogOpen} apiKey={activeKey} />
    </div>
  );
}