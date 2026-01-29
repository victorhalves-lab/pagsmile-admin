import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '@/components/common/DataTable';
import { 
  Plus, Edit, Trash2, Users, DollarSign, TrendingUp, Building2, Eye, Pause, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function TabSubSellers({ merchant }) {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [formData, setFormData] = useState({
    business_name: '',
    legal_name: '',
    document: '',
    document_type: 'cnpj',
    email: '',
    phone: '',
    split_percentage: 0,
    status: 'active'
  });

  const { data: subSellers = [], isLoading } = useQuery({
    queryKey: ['sub-sellers', merchant.id],
    queryFn: () => base44.entities.SubSeller.filter({ parent_subaccount_id: merchant.id })
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SubSeller.create({
      ...data,
      parent_subaccount_id: merchant.id,
      parent_merchant_name: merchant.business_name,
      subseller_id: `SS-${Date.now()}`
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['sub-sellers']);
      toast.success('Sub-seller adicionado!');
      handleCloseDialog();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SubSeller.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sub-sellers']);
      toast.success('Sub-seller atualizado!');
      handleCloseDialog();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SubSeller.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sub-sellers']);
      toast.success('Sub-seller removido!');
    }
  });

  const handleOpenDialog = (seller = null) => {
    if (seller) {
      setEditingSeller(seller);
      setFormData({
        business_name: seller.business_name,
        legal_name: seller.legal_name,
        document: seller.document,
        document_type: seller.document_type,
        email: seller.email,
        phone: seller.phone,
        split_percentage: seller.split_percentage,
        status: seller.status
      });
    } else {
      setEditingSeller(null);
      setFormData({
        business_name: '',
        legal_name: '',
        document: '',
        document_type: 'cnpj',
        email: '',
        phone: '',
        split_percentage: 0,
        status: 'active'
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingSeller(null);
  };

  const handleSave = () => {
    if (!formData.business_name || !formData.document) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (editingSeller) {
      updateMutation.mutate({ id: editingSeller.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const totalVolume = subSellers.reduce((sum, s) => sum + (s.total_volume_processed || 0), 0);
  const totalClientSpread = subSellers.reduce((sum, s) => sum + (s.client_spread_from_subseller || 0), 0);

  const columns = [
    {
      key: 'business_name',
      label: 'Sub-seller',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-slate-500">{row.document}</p>
          </div>
        </div>
      )
    },
    {
      key: 'total_volume_processed',
      label: 'Volume',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    {
      key: 'total_received',
      label: 'Repassado',
      render: (value) => <span className="text-blue-600">{formatCurrency(value)}</span>
    },
    {
      key: 'client_spread_from_subseller',
      label: 'Spread do Cliente',
      render: (value, row) => {
        const spread = (row.total_volume_processed || 0) - (row.total_received || 0);
        return <span className="font-bold text-emerald-600">{formatCurrency(spread)}</span>;
      }
    },
    {
      key: 'split_percentage',
      label: '% do Sub-seller',
      render: (value) => <Badge variant="outline">{value}%</Badge>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={value === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
          {value === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => updateMutation.mutate({ 
              id: row.id, 
              data: { status: row.status === 'active' ? 'inactive' : 'active' } 
            })}
          >
            {row.status === 'active' ? (
              <Pause className="w-4 h-4 text-orange-600" />
            ) : (
              <Play className="w-4 h-4 text-green-600" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-600"
            onClick={() => {
              if (confirm(`Remover ${row.business_name}?`)) {
                deleteMutation.mutate(row.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sub-sellers</p>
                <p className="text-2xl font-bold">{subSellers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Volume Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Spread do Cliente</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalClientSpread)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Sub-sellers</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Sub-seller
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={subSellers}
            loading={isLoading}
            pagination
            pageSize={20}
            emptyMessage="Nenhum sub-seller cadastrado"
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSeller ? 'Editar Sub-seller' : 'Adicionar Sub-seller'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome Fantasia *</Label>
                <Input
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Razão Social</Label>
                <Input
                  value={formData.legal_name}
                  onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Documento</Label>
                <Select value={formData.document_type} onValueChange={(v) => setFormData({ ...formData, document_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{formData.document_type === 'cpf' ? 'CPF' : 'CNPJ'} *</Label>
                <Input
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Percentual de Split do Sub-seller (%)</Label>
              <Input
                type="number"
                value={formData.split_percentage}
                onChange={(e) => setFormData({ ...formData, split_percentage: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="0.1"
              />
              <p className="text-xs text-slate-500 mt-1">
                Percentual que o sub-seller recebe do valor da transação
              </p>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingSeller ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}