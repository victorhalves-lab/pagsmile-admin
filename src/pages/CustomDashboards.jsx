import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  LayoutDashboard,
  Plus,
  Settings,
  Share2,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  MoreHorizontal,
  GripVertical,
  BarChart3,
  LineChart,
  PieChart,
  Hash,
  Table,
  Globe,
  Lock,
  Edit,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';

const widgetTypes = [
  { id: 'kpi', name: 'KPI Card', icon: Hash, description: 'Número com variação' },
  { id: 'line', name: 'Gráfico de Linha', icon: LineChart, description: 'Tendências ao longo do tempo' },
  { id: 'bar', name: 'Gráfico de Barras', icon: BarChart3, description: 'Comparações entre categorias' },
  { id: 'pie', name: 'Gráfico de Pizza', icon: PieChart, description: 'Distribuição percentual' },
  { id: 'table', name: 'Tabela', icon: Table, description: 'Dados tabulares detalhados' },
];

const availableMetrics = [
  { id: 'gmv', name: 'GMV', category: 'Vendas' },
  { id: 'transactions', name: 'Transações', category: 'Vendas' },
  { id: 'approval_rate', name: 'Taxa de Aprovação', category: 'Performance' },
  { id: 'avg_ticket', name: 'Ticket Médio', category: 'Vendas' },
  { id: 'disputes', name: 'Disputas', category: 'Risco' },
  { id: 'chargeback_rate', name: 'Taxa de Chargeback', category: 'Risco' },
  { id: 'new_customers', name: 'Novos Clientes', category: 'Clientes' },
  { id: 'recurring_customers', name: 'Clientes Recorrentes', category: 'Clientes' },
];

export default function CustomDashboards() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' });
  const [newWidget, setNewWidget] = useState({ type: 'kpi', title: '', metric: '' });

  const queryClient = useQueryClient();

  const { data: dashboards = [], isLoading } = useQuery({
    queryKey: ['custom-dashboards'],
    queryFn: () => base44.entities.CustomDashboard.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CustomDashboard.create({
      ...data,
      dashboard_id: `dash_${Date.now()}`,
      widgets: [],
      is_default: false,
      is_public: false,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['custom-dashboards']);
      setIsCreateOpen(false);
      setNewDashboard({ name: '', description: '' });
      toast.success('Dashboard criado!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CustomDashboard.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['custom-dashboards']);
      toast.success('Dashboard atualizado!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CustomDashboard.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['custom-dashboards']);
      toast.success('Dashboard excluído!');
    }
  });

  const handleCreate = () => {
    if (!newDashboard.name) {
      toast.error('Nome é obrigatório');
      return;
    }
    createMutation.mutate(newDashboard);
  };

  const handleAddWidget = () => {
    if (!newWidget.title || !newWidget.metric) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    const dashboard = dashboards.find(d => d.id === selectedDashboard);
    if (!dashboard) return;

    const widget = {
      id: `widget_${Date.now()}`,
      type: newWidget.type,
      title: newWidget.title,
      config: { metric: newWidget.metric },
      position: { x: 0, y: (dashboard.widgets?.length || 0), w: 1, h: 1 }
    };

    updateMutation.mutate({
      id: selectedDashboard,
      data: { widgets: [...(dashboard.widgets || []), widget] }
    });

    setIsAddWidgetOpen(false);
    setNewWidget({ type: 'kpi', title: '', metric: '' });
  };

  const togglePublic = (dashboard) => {
    updateMutation.mutate({
      id: dashboard.id,
      data: { 
        is_public: !dashboard.is_public,
        public_url: !dashboard.is_public ? `https://app.pagsmile.com/public/${dashboard.dashboard_id}` : null
      }
    });
  };

  const copyPublicUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiada!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboards Customizados"
        subtitle="Crie e gerencie seus próprios dashboards"
        breadcrumbs={[
          { label: 'Analytics', page: 'Analytics' },
          { label: 'Dashboards', page: 'CustomDashboards' }
        ]}
        actions={
          <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Dashboard
          </Button>
        }
      />

      {/* Dashboards Grid */}
      {dashboards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <Card key={dashboard.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-[#00D26A]/20 to-[#00A854]/20 rounded-lg">
                      <LayoutDashboard className="w-5 h-5 text-[#00D26A]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{dashboard.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {dashboard.widgets?.length || 0} widgets
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedDashboard(dashboard.id);
                        setIsAddWidgetOpen(true);
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Widget
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => togglePublic(dashboard)}>
                        {dashboard.is_public ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Tornar Privado
                          </>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 mr-2" />
                            Tornar Público
                          </>
                        )}
                      </DropdownMenuItem>
                      {dashboard.is_public && dashboard.public_url && (
                        <DropdownMenuItem onClick={() => copyPublicUrl(dashboard.public_url)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar URL
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => deleteMutation.mutate(dashboard.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {dashboard.description && (
                  <p className="text-sm text-gray-500 mb-4">{dashboard.description}</p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {dashboard.is_public ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <Globe className="w-3 h-3 mr-1" />
                      Público
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Lock className="w-3 h-3 mr-1" />
                      Privado
                    </Badge>
                  )}
                  {dashboard.is_default && (
                    <Badge className="bg-blue-100 text-blue-700">Padrão</Badge>
                  )}
                </div>

                {/* Widget Preview */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(dashboard.widgets || []).slice(0, 6).map((widget, idx) => {
                    const WidgetIcon = widgetTypes.find(w => w.id === widget.type)?.icon || Hash;
                    return (
                      <div 
                        key={idx}
                        className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center"
                      >
                        <WidgetIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}
                  {(!dashboard.widgets || dashboard.widgets.length === 0) && (
                    <div className="col-span-3 py-4 text-center text-sm text-gray-400">
                      Nenhum widget
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <LayoutDashboard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum dashboard criado</h3>
            <p className="text-gray-500 mb-4">Crie seu primeiro dashboard personalizado</p>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Widget Library */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Biblioteca de Widgets</CardTitle>
          <CardDescription>Componentes disponíveis para seus dashboards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {widgetTypes.map((widget) => (
              <div 
                key={widget.id}
                className="p-4 border border-gray-100 rounded-lg text-center hover:border-[#00D26A]/50 hover:bg-[#00D26A]/5 transition-colors cursor-pointer"
              >
                <widget.icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="font-medium text-sm">{widget.name}</p>
                <p className="text-xs text-gray-500">{widget.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Dashboard Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Dashboard</DialogTitle>
            <DialogDescription>Crie um dashboard personalizado</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome *</Label>
              <Input
                placeholder="Ex: Dashboard de Vendas"
                value={newDashboard.name}
                onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição opcional..."
                value={newDashboard.description}
                onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              Criar Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Widget Dialog */}
      <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Widget</DialogTitle>
            <DialogDescription>Escolha o tipo e configure o widget</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de Widget</Label>
              <Select 
                value={newWidget.type} 
                onValueChange={(v) => setNewWidget({ ...newWidget, type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {widgetTypes.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      <div className="flex items-center gap-2">
                        <w.icon className="w-4 h-4" />
                        {w.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título</Label>
              <Input
                placeholder="Ex: GMV Total"
                value={newWidget.title}
                onChange={(e) => setNewWidget({ ...newWidget, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Métrica</Label>
              <Select 
                value={newWidget.metric} 
                onValueChange={(v) => setNewWidget({ ...newWidget, metric: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma métrica" />
                </SelectTrigger>
                <SelectContent>
                  {availableMetrics.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddWidgetOpen(false)}>Cancelar</Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={handleAddWidget}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}