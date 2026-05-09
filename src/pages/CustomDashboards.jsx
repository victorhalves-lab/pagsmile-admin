import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  LayoutDashboard, Plus, Settings, Share2, Trash2, Eye, EyeOff, Copy, MoreHorizontal,
  Globe, Lock, Edit, Save, ArrowLeft, Layers, Calendar as CalendarIcon, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import TemplateGallery from '@/components/custom-dashboards/TemplateGallery';
import WidgetLibrary from '@/components/custom-dashboards/WidgetLibrary';
import DashboardCanvas from '@/components/custom-dashboards/DashboardCanvas';
import WidgetPropertiesPanel from '@/components/custom-dashboards/WidgetPropertiesPanel';
import ShareDashboardDialog from '@/components/custom-dashboards/ShareDashboardDialog';
import ScheduleReportDialog from '@/components/custom-dashboards/ScheduleReportDialog';
import GlobalFiltersBar from '@/components/analytics/shared/GlobalFiltersBar';

export default function CustomDashboards() {
  const [view, setView] = useState('gallery'); // gallery | list | builder
  const [editingDashboard, setEditingDashboard] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [period, setPeriod] = useState('30d');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' });

  const queryClient = useQueryClient();

  const { data: dashboards = [] } = useQuery({
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
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CustomDashboard.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['custom-dashboards']);
      toast.success('Dashboard excluído!');
    },
  });

  const handleSelectTemplate = (template) => {
    setEditingDashboard({ name: template.name, id: 'new', template: template.id });
    // Generate sample widgets based on template
    const sampleWidgets = Array.from({ length: template.widgets || 4 }, (_, i) => ({
      id: ['kpi', 'line', 'bar', 'pie'][i % 4],
      instanceId: `w_${Date.now()}_${i}`,
      title: `Widget ${i + 1}`,
      size: i < 4 ? '1x1' : '2x1',
    }));
    setWidgets(sampleWidgets);
    setView('builder');
  };

  const handleStartFromList = (d) => {
    setEditingDashboard(d);
    setWidgets(d.widgets || []);
    setView('builder');
  };

  const selectedWidget = widgets.find(w => w.instanceId === selectedWidgetId);

  // ============ BUILDER VIEW ============
  if (view === 'builder') {
    return (
      <div className="space-y-3">
        <PageHeader
          title={editingDashboard?.name || 'Novo Dashboard'}
          subtitle={isPreview ? 'Modo preview — visualização final' : 'Modo edição — arraste widgets para o canvas'}
          breadcrumbs={[
            { label: 'Analytics' },
            { label: 'Dashboards', page: 'CustomDashboards' },
            { label: editingDashboard?.name || 'Novo' },
          ]}
          actions={
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={() => { setView('list'); setEditingDashboard(null); setWidgets([]); }}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Voltar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
                {isPreview ? <><Edit className="w-3.5 h-3.5 mr-1" /> Editar</> : <><Eye className="w-3.5 h-3.5 mr-1" /> Preview</>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                <Share2 className="w-3.5 h-3.5 mr-1" /> Compartilhar
              </Button>
              <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
                <CalendarIcon className="w-3.5 h-3.5 mr-1" /> Agendar
              </Button>
              <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => toast.success('Dashboard salvo!')}>
                <Save className="w-3.5 h-3.5 mr-1" /> Salvar
              </Button>
            </div>
          }
        />

        <GlobalFiltersBar
          period={period}
          onPeriodChange={setPeriod}
          activeFilters={period !== '30d' ? 1 : 0}
          onClearAll={() => setPeriod('30d')}
        />

        <div className={`grid gap-3 ${isPreview ? 'grid-cols-1' : 'lg:grid-cols-[220px_1fr_240px]'}`}>
          {!isPreview && <WidgetLibrary onAddWidget={(w) => {
            const newW = { ...w, instanceId: `w_${Date.now()}`, title: w.name, size: '2x1' };
            setWidgets([...widgets, newW]);
          }} />}

          <DashboardCanvas
            widgets={widgets}
            onWidgetsChange={setWidgets}
            isPreview={isPreview}
            selectedId={selectedWidgetId}
            onSelectWidget={setSelectedWidgetId}
          />

          {!isPreview && (
            <WidgetPropertiesPanel
              widget={selectedWidget}
              onChange={(updated) => setWidgets(widgets.map(w => w.instanceId === updated.instanceId ? updated : w))}
              onRemove={(id) => { setWidgets(widgets.filter(w => w.instanceId !== id)); setSelectedWidgetId(null); }}
            />
          )}
        </div>

        <ShareDashboardDialog open={shareOpen} onOpenChange={setShareOpen} dashboard={editingDashboard} />
        <ScheduleReportDialog open={scheduleOpen} onOpenChange={setScheduleOpen} dashboardName={editingDashboard?.name} />
      </div>
    );
  }

  // ============ LIST VIEW ============
  if (view === 'list') {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Meus Dashboards"
          subtitle="Visualize, edite ou compartilhe seus dashboards customizados"
          breadcrumbs={[{ label: 'Analytics' }, { label: 'Dashboards' }]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setView('gallery')}>
                <Layers className="w-3.5 h-3.5 mr-1" /> Templates
              </Button>
              <Button className="bg-[#2bc196] hover:bg-[#239b7a]" size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Novo Dashboard
              </Button>
            </div>
          }
        />

        {dashboards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dashboards.map((d) => (
              <Card key={d.id} className="hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => handleStartFromList(d)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-[#2bc196]/20 to-emerald-600/20 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-[#2bc196]" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{d.name}</CardTitle>
                        <CardDescription className="text-xs">{d.widgets?.length || 0} widgets</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStartFromList(d)}>
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingDashboard(d); setShareOpen(true); }}>
                          <Share2 className="w-4 h-4 mr-2" /> Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingDashboard(d); setScheduleOpen(true); }}>
                          <CalendarIcon className="w-4 h-4 mr-2" /> Agendar envio
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteMutation.mutate(d.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {d.description && <p className="text-sm text-gray-500 mb-3">{d.description}</p>}
                  <div className="flex items-center gap-2">
                    {d.is_public ? (
                      <Badge className="bg-emerald-100 text-emerald-700"><Globe className="w-3 h-3 mr-1" /> Público</Badge>
                    ) : (
                      <Badge variant="outline"><Lock className="w-3 h-3 mr-1" /> Privado</Badge>
                    )}
                    {d.is_default && <Badge className="bg-blue-100 text-blue-700">Padrão</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <LayoutDashboard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-1">Nenhum dashboard criado</h3>
              <p className="text-sm text-gray-500 mb-4">Comece com um template pronto ou crie do zero</p>
              <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => setView('gallery')}>
                <Sparkles className="w-4 h-4 mr-2" /> Ver templates
              </Button>
            </CardContent>
          </Card>
        )}

        <ShareDashboardDialog open={shareOpen} onOpenChange={setShareOpen} dashboard={editingDashboard} />
        <ScheduleReportDialog open={scheduleOpen} onOpenChange={setScheduleOpen} dashboardName={editingDashboard?.name} />
      </div>
    );
  }

  // ============ GALLERY VIEW (default) ============
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboards Customizados"
        subtitle="Comece com um template pronto ou crie seu dashboard do zero"
        breadcrumbs={[{ label: 'Analytics' }, { label: 'Dashboards' }]}
        actions={
          <div className="flex gap-2">
            {dashboards.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setView('list')}>
                Meus dashboards ({dashboards.length})
              </Button>
            )}
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]" size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Novo do zero
            </Button>
          </div>
        }
      />

      <TemplateGallery
        onSelect={handleSelectTemplate}
        onPreview={(t) => toast.info(`Preview de "${t.name}" em breve...`)}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Dashboard em Branco</DialogTitle>
            <DialogDescription>Crie um dashboard do zero</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
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
              className="bg-[#2bc196] hover:bg-[#239b7a]"
              onClick={() => {
                if (!newDashboard.name) { toast.error('Nome é obrigatório'); return; }
                createMutation.mutate(newDashboard);
              }}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}