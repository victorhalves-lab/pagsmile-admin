import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Plus, Search, Tag, MoreVertical, Edit, Trash2, Lock
} from 'lucide-react';

const mockTags = [
  { id: 1, name: 'VIP', color: 'purple', merchantCount: 45, createdBy: 'Maria Santos', isSystem: false },
  { id: 2, name: 'Alto Risco', color: 'red', merchantCount: 23, createdBy: 'Sistema', isSystem: true },
  { id: 3, name: 'Novo Cliente', color: 'green', merchantCount: 156, createdBy: 'Sistema', isSystem: true },
  { id: 4, name: 'Requer Atenção', color: 'yellow', merchantCount: 34, createdBy: 'João Silva', isSystem: false },
  { id: 5, name: 'Promoção Q1', color: 'blue', merchantCount: 89, createdBy: 'Maria Santos', isSystem: false },
  { id: 6, name: 'Piloto', color: 'cyan', merchantCount: 12, createdBy: 'Admin', isSystem: false },
  { id: 7, name: 'Inativo > 30 dias', color: 'gray', merchantCount: 67, createdBy: 'Sistema', isSystem: true }
];

const COLOR_OPTIONS = [
  { value: 'blue', class: 'bg-blue-500' },
  { value: 'green', class: 'bg-green-500' },
  { value: 'yellow', class: 'bg-yellow-500' },
  { value: 'orange', class: 'bg-orange-500' },
  { value: 'red', class: 'bg-red-500' },
  { value: 'purple', class: 'bg-purple-500' },
  { value: 'gray', class: 'bg-gray-500' },
  { value: 'cyan', class: 'bg-cyan-500' }
];

export default function AdminIntMerchantTags() {
  const [tags, setTags] = useState(mockTags);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: 'blue' });

  const filteredTags = tags.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = () => {
    const newTag = {
      id: tags.length + 1,
      ...formData,
      merchantCount: 0,
      createdBy: 'Você',
      isSystem: false
    };
    setTags([...tags, newTag]);
    setShowCreateModal(false);
    setFormData({ name: '', color: 'blue' });
  };

  const handleEditTag = () => {
    setTags(tags.map(t => t.id === editingTag.id ? { ...t, ...formData } : t));
    setEditingTag(null);
    setFormData({ name: '', color: 'blue' });
  };

  const handleDeleteTag = (id) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const getColorClass = (color) => {
    return COLOR_OPTIONS.find(c => c.value === color)?.class || 'bg-gray-500';
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PageHeader
          title="Tags de Merchants"
          subtitle="Classificações flexíveis para merchants"
          breadcrumbs={[
            { label: 'Admin Interno', page: 'AdminIntDashboard' },
            { label: 'Merchants', page: 'AdminIntMerchantsList' },
            { label: 'Tags', page: 'AdminIntMerchantTags' }
          ]}
        />

        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Tag
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead className="text-right">Merchants</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{tag.name}</span>
                      {tag.isSystem && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`w-6 h-6 rounded ${getColorClass(tag.color)}`} />
                  </TableCell>
                  <TableCell className="text-right font-medium">{tag.merchantCount}</TableCell>
                  <TableCell className="text-slate-600">{tag.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setEditingTag(tag);
                          setFormData({ name: tag.name, color: tag.color });
                        }} disabled={tag.isSystem}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTag(tag.id)} disabled={tag.isSystem}>
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

      <p className="text-sm text-slate-500">
        <Lock className="w-3 h-3 inline mr-1" />
        Tags do sistema não podem ser excluídas ou editadas
      </p>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || editingTag !== null} onOpenChange={(open) => {
        if (!open) {
          setShowCreateModal(false);
          setEditingTag(null);
          setFormData({ name: '', color: 'blue' });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Editar Tag' : 'Nova Tag'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nome da Tag *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: VIP"
              />
            </div>

            <div>
              <Label>Cor</Label>
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              setEditingTag(null);
              setFormData({ name: '', color: 'blue' });
            }}>
              Cancelar
            </Button>
            <Button onClick={editingTag ? handleEditTag : handleCreateTag}>
              {editingTag ? '💾 Salvar' : '🏷️ Criar Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}