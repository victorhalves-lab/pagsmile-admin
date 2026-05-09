import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Plug, Search, ExternalLink, Download, Check, Settings, Zap,
  Sparkles, Plus, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import PluginCardEnhanced from '@/components/integrations/plugins/PluginCardEnhanced';
import PluginDetailDrawer from '@/components/integrations/plugins/PluginDetailDrawer';
import PluginRequestDialog from '@/components/integrations/plugins/PluginRequestDialog';
import PluginRecommendations from '@/components/integrations/plugins/PluginRecommendations';
import { pluginCategories, pluginCatalog, filterPlugins, getPluginById } from '@/components/integrations/plugins/pluginCatalog';

export default function Plugins() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const { data: installedPlugins = [] } = useQuery({
    queryKey: ['plugins'],
    queryFn: () => base44.entities.Plugin.filter({ is_installed: true }),
  });

  const installedIds = installedPlugins.map(p => p.plugin_id);

  const filtered = useMemo(
    () => filterPlugins(pluginCatalog, { category: selectedCategory, search: searchTerm, tab: activeTab }),
    [searchTerm, selectedCategory, activeTab]
  );

  const featured = pluginCatalog.filter((p) => p.is_popular).slice(0, 3);

  // Recommendations: BR plugins not yet installed (mock logic)
  const recommendations = pluginCatalog
    .filter((p) => p.is_br && !installedIds.includes(p.id))
    .slice(0, 3)
    .map((p) => ({ ...p, reason: `Plugin brasileiro nativo · ${p.installs?.toLocaleString('pt-BR')} instalações` }));

  const handleInstall = (plugin) => {
    toast.success(`Instalando ${plugin.name}... Wizard em breve.`);
    setDetailOpen(false);
  };

  const handleConfigure = (plugin) => {
    toast.info(`Abrindo configuração de ${plugin.name}...`);
    setDetailOpen(false);
  };

  const handleSelect = (plugin) => {
    setSelectedPlugin(plugin);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plugins e Conectores"
        subtitle={`${pluginCatalog.length} integrações disponíveis · ${pluginCatalog.filter(p => p.is_br).length} brasileiras nativas`}
        breadcrumbs={[
          { label: 'Integrações', page: 'Integrations' },
          { label: 'Plugins', page: 'Plugins' }
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => setRequestOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Solicitar integração
          </Button>
        }
      />

      {/* AI Recommendations */}
      {recommendations.length > 0 && <PluginRecommendations recommendations={recommendations} onSelect={handleSelect} />}

      {/* Hero featured row */}
      {activeTab === 'all' && !searchTerm && selectedCategory === 'all' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Em destaque</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featured.map((p) => {
              const isInstalled = installedIds.includes(p.id);
              return (
                <PluginCardEnhanced
                  key={p.id}
                  plugin={p}
                  isInstalled={isInstalled}
                  onInstall={handleInstall}
                  onConfigure={handleConfigure}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Search + Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, descrição ou feature (ex: 'PIX automático')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Discovery Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border h-9">
            <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="popular" className="text-xs">🔥 Populares</TabsTrigger>
            <TabsTrigger value="new" className="text-xs">✨ Novos</TabsTrigger>
            <TabsTrigger value="br" className="text-xs">🇧🇷 Brasileiros</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {pluginCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn('h-8 text-xs', selectedCategory === cat.id && 'bg-[#2bc196] hover:bg-[#239b7a]')}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Installed Plugins */}
      {installedPlugins.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Instalados ({installedPlugins.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {installedPlugins.map((plugin) => {
              const info = getPluginById(plugin.plugin_id);
              return (
                <Card key={plugin.id} className="border-emerald-200 bg-emerald-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 border">
                        {info?.logo ? (
                          <img src={info.logo} alt={plugin.name} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <span className="text-2xl">{info?.emoji || '🔌'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{plugin.name}</h4>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 mr-1" />
                            Instalado
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{info?.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] text-emerald-700 font-medium">Saudável · 0 erros · v2.3.1</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSelect(info)}>
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Plugins Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            {selectedCategory === 'all' ? 'Todos os Plugins' : pluginCategories.find(c => c.id === selectedCategory)?.label}
            <span className="text-slate-400 ml-2">({filtered.length})</span>
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto mb-3 flex items-center justify-center">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold mb-1">Nenhum plugin encontrado</p>
            <p className="text-xs text-slate-500 mb-4">
              Não encontramos "{searchTerm}". Que tal solicitar essa integração?
            </p>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setRequestOpen(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Solicitar integração
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((plugin) => {
              const isInstalled = installedIds.includes(plugin.id);
              return (
                <PluginCardEnhanced
                  key={plugin.id}
                  plugin={plugin}
                  isInstalled={isInstalled}
                  onInstall={handleInstall}
                  onConfigure={handleConfigure}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Sandbox Section - kept verbatim */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-100 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <CardTitle className="text-base">Ambiente Sandbox</CardTitle>
              <CardDescription>Teste suas integrações sem processar transações reais</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Cartões de Teste</h4>
              <p className="text-sm text-gray-500 mb-3">Use números especiais para simular cenários</p>
              <code className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded block">
                4111 1111 1111 1111 (Aprova)
              </code>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Pix de Teste</h4>
              <p className="text-sm text-gray-500 mb-3">Simule pagamentos Pix instantâneos</p>
              <Button size="sm" variant="outline">Gerar QR de Teste</Button>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Webhooks de Teste</h4>
              <p className="text-sm text-gray-500 mb-3">Dispare eventos de teste</p>
              <Button size="sm" variant="outline">Testar Webhook</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PluginDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        plugin={selectedPlugin}
        isInstalled={selectedPlugin && installedIds.includes(selectedPlugin.id)}
        onInstall={handleInstall}
        onConfigure={handleConfigure}
      />

      <PluginRequestDialog open={requestOpen} onOpenChange={setRequestOpen} prefill={searchTerm} />
    </div>
  );
}