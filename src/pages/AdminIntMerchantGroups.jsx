import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus, Search, FolderOpen, MoreVertical, Edit, Trash2, Users, DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';

const mockGroups = [
  { id: 1, name: 'VIP', description: 'Clientes premium com atendimento prioritário', color: 'purple', merchantCount: 45, tpv30d: 12300000, responsible: 'Maria Santos' },
  { id: 2, name: 'Parceria ABC', description: 'Merchants do parceiro ABC Marketplaces', color: 'blue', merchantCount: 123, tpv30d: 8700000, responsible: 'João Silva' },
  { id: 3, name: 'Taxa Promo Q1', description: 'Promoção primeiro trimestre 2026', color: 'green', merchantCount: 67, tpv30d: 3400000, responsible: 'Ana Costa' },
  { id: 4, name: 'Monitoramento', description: 'Merchants em observação de risco', color: 'red', merchantCount: 12, tpv30d: 890000, responsible: 'Carlos Risco' },
  { id: 5, name: 'Região Sul', description: 'Merchants do Sul do Brasil', color: 'cyan', merchantCount: 234, tpv30d: 15200000, responsible: 'Pedro Regional' },
  { id: 6, name: 'Piloto v2.0', description: 'Beta testers da nova versão do checkout', color: 'orange', merchantCount: 8, tpv30d: 450000, responsible: 'Tech Team' }
];

const COLOR_OPTIONS = [
  { value: 'blue', label: '🔵 Azul', class: 'bg-blue-500' },
  { value: 'green', label: '🟢 Verde', class: 'bg-green-500' },
  { value: 'yellow', label: '🟡 Amarelo', class: 'bg-yellow-500' },
  { value: 'orange', label: '🟠 Laranja', class: 'bg-orange-500' },
  { value: 'red', label: '🔴 Vermelho', class: 'bg-red-500' },
  { value: 'purple', label: '🟣 Roxo', class: 'bg-purple-500' },
  { value: 'gray', label: '⚪ Cinza', class: 'bg-gray-500' },
  { value: 'cyan', label: '🔷 Ciano', class: 'bg-cyan-500' }
];

export default function AdminIntMerchantGroups() {
  const [groups, setGroups] = useState(mockGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    responsible: '',
    specialRate: false,
    cardRate: '',
    pixRate: '',
    settlementDays: '',
    retentionPercent: ''
  });

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMerchants = groups.reduce((sum, g) => sum + g.merchantCount, 0);
  const ungroupedCount = 745; // Mock value

  const handleCreateGroup = () => {
    const newGroup = {
      id: groups.length + 1,
      ...formData,
      merchantCount: 0,
      tpv30d: 0
    };
    setGroups([...groups, newGroup]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditGroup = () => {
    setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...formData } : g));
    setEditingGroup(null);
    resetForm();
  };

  const handleDeleteGroup = (id) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: 'blue',
      responsible: '',
      specialRate: false,
      cardRate: '',
      pixRate: '',
      settlementDays: '',
      retentionPercent: ''
    });
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      color: group.color,
      responsible: group.responsible,
      specialRate: false,
      cardRate: '',
      pixRate: '',
      settlementDays: '',
      retentionPercent: ''
    });
  };

  const getColorClass = (color) => {
    return COLOR_OPTIONS.find(c => c.value === color)?.class || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PageHeader
          title="Grupos de Merchants"
          subtitle="Organize merchants em categorias personalizadas"
          breadcrumbs={[
            { label: 'Admin Interno', page: 'AdminIntDashboard' },
            { label: 'Merchants', page: 'AdminIntMerchantsList' },
            { label: 'Grupos', page: 'AdminIntMerchantGroups' }
          ]}
        />

        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Grupo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar grupos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary */}
      <div className="flex items-center gap-6 text-sm text-slate-600">
        <span>Total: <strong>{groups.length}</strong> grupos</span>
        <span>•</span>
        <span><strong>{totalMerchants}</strong> merchants agrupados</span>
        <span>•</span>
        <span><strong>{ungroupedCount}</strong> sem grupo</span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Merchants</TableHead>
                <TableHead className="text-right">TPV 30d</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getColorClass(group.color)}`} />
                      <FolderOpen className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{group.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{group.description}</TableCell>
                  <TableCell className="text-right font-medium">{group.merchantCount}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(group.tpv30d)}</TableCell>
                  <TableCell className="text-slate-600">{group.responsible}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(group)}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" /> Ver Merchants
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteGroup(group.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || editingGroup !== null} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setEditingGroup(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? '✏️ Editar Grupo' : '📁 Novo Grupo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome do Grupo *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Parceria ABC"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o propósito deste grupo..."
                rows={3}
              />
            </div>

            <div>
              <Label>Cor do Grupo</Label>
              <div className="flex gap-2 mt-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      formData.color === color.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Responsável pelo Grupo</Label>
              <Select
                value={formData.responsible}
                onValueChange={(v) => setFormData({ ...formData, responsible: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria">Maria Santos (Comercial)</SelectItem>
                  <SelectItem value="joao">João Silva (Gerente)</SelectItem>
                  <SelectItem value="ana">Ana Costa (Operações)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="special-rates"
                  checked={formData.specialRate}
                  onCheckedChange={(checked) => setFormData({ ...formData, specialRate: checked })}
                />
                <Label htmlFor="special-rates" className="font-medium">
                  Aplicar configurações especiais
                </Label>
              </div>

              {formData.specialRate && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label className="text-xs">Taxa Cartão (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.cardRate}
                      onChange={(e) => setFormData({ ...formData, cardRate: e.target.value })}
                      placeholder="4.49"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Taxa PIX (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.pixRate}
                      onChange={(e) => setFormData({ ...formData, pixRate: e.target.value })}
                      placeholder="0.99"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Liquidação (dias)</Label>
                    <Input
                      type="number"
                      value={formData.settlementDays}
                      onChange={(e) => setFormData({ ...formData, settlementDays: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Retenção (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.retentionPercent}
                      onChange={(e) => setFormData({ ...formData, retentionPercent: e.target.value })}
                      placeholder="5.00"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              setEditingGroup(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button onClick={editingGroup ? handleEditGroup : handleCreateGroup}>
              {editingGroup ? '💾 Salvar' : '📁 Criar Grupo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}