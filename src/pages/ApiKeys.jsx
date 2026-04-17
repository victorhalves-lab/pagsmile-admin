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
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SideDrawer from '@/components/common/SideDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export default function ApiKeys() {
  const { t } = useTranslation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showSecret, setShowSecret] = useState({});
  const [newKey, setNewKey] = useState({
    name: '',
    type: 'production',
    key_type: 'secret',
  });
  const [createdKey, setCreatedKey] = useState(null);

  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading, refetch } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => base44.entities.ApiKey.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      const key = {
        ...data,
        key_id: `key_${data.type === 'production' ? 'live' : 'test'}_${Math.random().toString(36).substring(2, 15)}`,
        status: 'active',
      };
      return base44.entities.ApiKey.create(key);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['api-keys']);
      setCreatedKey(result);
      setNewKey({ name: '', type: 'production', key_type: 'secret' });
    }
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const toggleShowSecret = (id) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 12) + '...' + key.substring(key.length - 4);
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.type === 'production' ? 'bg-emerald-100' : 'bg-yellow-100'
          )}>
            <Key className={cn(
              "w-5 h-5",
              row.type === 'production' ? 'text-emerald-600' : 'text-yellow-600'
            )} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 capitalize">
              {row.type === 'production' ? 'Produção' : 'Sandbox'} • {row.key_type === 'secret' ? 'Secret' : 'Public'}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'key_id',
      label: 'Chave',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
            {showSecret[row.id] ? value : maskKey(value)}
          </code>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => toggleShowSecret(row.id)}
          >
            {showSecret[row.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => copyToClipboard(value)}
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
        <span className="text-sm text-gray-600">
          {format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
        </span>
      ) : 'Nunca'
    },
    {
      key: 'created_date',
      label: 'Criada em',
      render: (value) => value ? (
        <span className="text-sm text-gray-600">
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
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('integrations.generate_key')}
          </Button>
        }
      />

      {/* Security Warning */}
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

      {/* Create Side Drawer */}
      <SideDrawer
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setCreatedKey(null);
        }}
        title={createdKey ? 'Chave Criada!' : 'Nova Chave de API'}
        description={createdKey 
          ? 'Copie sua chave agora. Ela não será exibida novamente.'
          : 'Crie uma nova chave para integrar seus sistemas'
        }
        icon={Key}
        footer={
          !createdKey ? (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="bg-[#00D26A] hover:bg-[#00A854]"
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
                <code className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded font-mono break-all">
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
              className="w-full bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => {
                setIsCreateOpen(false);
                setCreatedKey(null);
              }}
            >
              Concluído
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Nome da Chave *</Label>
              <Input
                placeholder="Ex: Sistema Principal"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              />
            </div>

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
                  <SelectItem value="secret">Secret Key (Backend)</SelectItem>
                  <SelectItem value="public">Public Key (Frontend)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                {newKey.key_type === 'secret' 
                  ? 'Use apenas no backend. Nunca exponha no frontend.'
                  : 'Pode ser usada no frontend para operações limitadas.'
                }
              </p>
            </div>
          </div>
        )}
      </SideDrawer>
    </div>
  );
}