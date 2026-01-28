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
          breadcrum