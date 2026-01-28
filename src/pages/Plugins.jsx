import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Plug,
  Search,
  ExternalLink,
  Download,
  Check,
  Settings,
  ShoppingCart,
  Building2,
  Zap,
  MoreHorizontal,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';

const pluginCategories = [
  { id: 'all', label: 'Todos' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'erp', label: 'ERP/CRM' },
  { id: 'automation', label: 'Automação' },
];

const availablePlugins = [
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    description: 'Plugin para WordPress/WooCommerce',
    category: 'ecommerce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/WooCommerce_logo.svg/1200px-WooCommerce_logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/woocommerce',
    features: ['Checkout transparente', 'Pix automático', 'Webhooks'],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'App oficial para Shopify',
    category: 'ecommerce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png',
    documentation_url: 'https://docs.pagsmile.com/shopify',
    features: ['Instalação via App Store', 'Sincronização automática'],
  },
  {
    id: 'magento',
    name: 'Magento 2',
    description: 'Extensão para Magento 2',
    category: 'ecommerce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Magento_Logo.svg/2560px-Magento_Logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/magento',
    features: ['Suporte a multi-store', 'Checkout customizável'],
  },
  {
    id: 'vtex',
    name: 'VTEX',
    description: 'Conector nativo para VTEX IO',
    category: 'ecommerce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/VTEX_Logo.svg/2560px-VTEX_Logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/vtex',
    features: ['VTEX IO nativo', 'SmartCheckout'],
  },
  {
    id: 'nuvemshop',
    name: 'Nuvemshop',
    description: 'App para Nuvemshop/Tiendanube',
    category: 'ecommerce',
    logo: 'https://logovector.net/wp-content/uploads/2023/04/Nuvemshop-Logo.png',
    documentation_url: 'https://docs.pagsmile.com/nuvemshop',
    features: ['Instalação em 1 clique', 'Suporte em português'],
  },
  {
    id: 'prestashop',
    name: 'PrestaShop',
    description: 'Módulo para PrestaShop',
    category: 'ecommerce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/PrestaShop_Logo.svg/2560px-PrestaShop_Logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/prestashop',
    features: ['Multi-idioma', 'Fácil instalação'],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sincronize clientes e pagamentos',
    category: 'erp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/salesforce',
    features: ['Sync de clientes', 'Histórico de pagamentos'],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Integre pagamentos ao CRM',
    category: 'erp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/hubspot',
    features: ['Deals automáticos', 'Timeline de pagamentos'],
  },
  {
    id: 'sap',
    name: 'SAP',
    description: 'Conector para SAP Business One',
    category: 'erp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/2560px-SAP_2011_logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/sap',
    features: ['Sincronização contábil', 'Conciliação automática'],
  },
  {
    id: 'totvs',
    name: 'TOTVS',
    description: 'Integração com Protheus',
    category: 'erp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/TOTVS_logo.svg/2560px-TOTVS_logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/totvs',
    features: ['Integração financeira', 'Lançamentos automáticos'],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Conecte a milhares de apps',
    category: 'automation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Zapier_logo.svg/2560px-Zapier_logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/zapier',
    features: ['5000+ apps', 'Triggers e Actions', 'No-code'],
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    description: 'Automações avançadas',
    category: 'automation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Make_Logo_RGB.svg/2560px-Make_Logo_RGB.svg.png',
    documentation_url: 'https://docs.pagsmile.com/make',
    features: ['Cenários complexos', 'Visual builder'],
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Automação self-hosted',
    category: 'automation',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/N8n-logo.svg/2560px-N8n-logo.svg.png',
    documentation_url: 'https://docs.pagsmile.com/n8n',
    features: ['Open source', 'Self-hosted', 'Workflows'],
  },
];

export default function Plugins() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlugin, setSelectedPlugin] = useState(null);

  const { data: installedPlugins = [] } = useQuery({
    queryKey: ['plugins'],
    queryFn: () => base44.entities.Plugin.filter({ is_installed: true }),
  });

  const installedIds = installedPlugins.map(p => p.plugin_id);

  const filteredPlugins = availablePlugins.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (plugin) => {
    toast.success(`Instalando ${plugin.name}...`);
  };

  const handleConfigure = (plugin) => {
    setSelectedPlugin(plugin);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plugins e Conectores"
        subtitle="Integre com suas plataformas favoritas"
        breadcrumbs={[
          { label: 'Integrações', page: 'Integrations' },
          { label: 'Plugins', page: 'Plugins' }
        ]}
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar plugins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {pluginCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? "bg-[#00D26A] hover:bg-[#00A854]" : ""}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Installed Plugins */}
      {installedPlugins.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Instalados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installedPlugins.map((plugin) => {
              const pluginInfo = availablePlugins.find(p => p.id === plugin.plugin_id);
              return (
                <Card key={plugin.id} className="border-emerald-200 bg-emerald-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 border">
                        {pluginInfo?.logo ? (
                          <img src={pluginInfo.logo} alt={plugin.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <Plug className="w-6 h-6 text-gray-400" />
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
                        <p className="text-sm text-gray-500 mt-1">{pluginInfo?.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
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

      {/* Available Plugins */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {selectedCategory === 'all' ? 'Todos os Plugins' : pluginCategories.find(c => c.id === selectedCategory)?.label}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlugins.map((plugin) => {
            const isInstalled = installedIds.includes(plugin.id);
            return (
              <Card key={plugin.id} className={cn(
                "hover:shadow-md transition-shadow",
                isInstalled && "opacity-60"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-2 border">
                      {plugin.logo ? (
                        <img src={plugin.logo} alt={plugin.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <Plug className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{plugin.name}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {plugin.category === 'ecommerce' ? 'E-commerce' : 
                           plugin.category === 'erp' ? 'ERP/CRM' : 'Automação'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{plugin.description}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {plugin.features.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {isInstalled ? (
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        <Check className="w-4 h-4 mr-2" />
                        Instalado
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="flex-1 bg-[#00D26A] hover:bg-[#00A854]"
                        onClick={() => handleInstall(plugin)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Instalar
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(plugin.documentation_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sandbox Section */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
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
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Cartões de Teste</h4>
              <p className="text-sm text-gray-500 mb-3">Use números especiais para simular cenários</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                4111 1111 1111 1111 (Aprova)
              </code>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Pix de Teste</h4>
              <p className="text-sm text-gray-500 mb-3">Simule pagamentos Pix instantâneos</p>
              <Button size="sm" variant="outline">Gerar QR de Teste</Button>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Webhooks de Teste</h4>
              <p className="text-sm text-gray-500 mb-3">Dispare eventos de teste</p>
              <Button size="sm" variant="outline">Testar Webhook</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}