import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  LayoutTemplate, 
  Palette, 
  CreditCard, 
  Sparkles, 
  LayoutGrid,
  FileStack,
  Eye,
  Save,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Play
} from 'lucide-react';
import VisualEditor from '@/components/checkout/visual-builder/VisualEditor.jsx';
import ElementPanel from '@/components/checkout/visual-builder/ElementPanel.jsx';
import PropertiesPanel from '@/components/checkout/visual-builder/PropertiesPanel.jsx';
import BrandingSettings from '@/components/checkout/BrandingSettings.jsx';
import LayoutSettings from '@/components/checkout/LayoutSettings.jsx';
import PaymentMethodSettings from '@/components/checkout/PaymentMethodSettings.jsx';
import ExperienceSettings from '@/components/checkout/ExperienceSettings.jsx';
import ConverterAgentTab from '@/components/checkout/ConverterAgentTab.jsx';
import { cn } from '@/lib/utils';

const defaultCheckoutConfig = {
  name: 'Novo Checkout',
  status: 'draft',
  type: 'one-step',
  elements: [],
  branding: {
    logo_url: '',
    favicon_url: '',
    background_image_url: '',
    colors: {
      primary: '#00D26A',
      secondary: '#101F3E',
      background: '#F8FAFC',
      card_background: '#FFFFFF',
      text_primary: '#1F2937',
      text_secondary: '#6B7280',
      success: '#28A745',
      error: '#DC3545',
      warning: '#FFC107'
    },
    typography: {
      font_family: 'Inter',
      title_font: 'Inter',
      base_size: 16,
      title_sizes: { h1: 32, h2: 24, h3: 20 },
      font_weight: 'normal',
      line_height: 1.5
    },
    buttons: {
      bg_color: '#00D26A',
      text_color: '#FFFFFF',
      border_radius: 8,
      size: 'medium',
      hover_style: 'darken',
      icon: 'lock'
    },
    inputs: {
      bg_color: '#FFFFFF',
      border_color: '#E5E7EB',
      focus_border_color: '#00D26A',
      error_border_color: '#DC3545',
      border_width: 1,
      border_radius: 4,
      height: 'normal',
      label_style: 'above'
    },
    custom_css: ''
  },
  layout: {
    flow_type: 'one-step',
    steps: [],
    summary_position: 'right',
    summary_sticky: true,
    summary_items: ['name', 'quantity', 'price'],
    summary_editable: false,
    summary_collapsible_mobile: true,
    breakpoints: { desktop: 1200, tablet: 768, mobile: 375 },
    mobile_font_scale: 1.1,
    mobile_full_width_buttons: true,
    footer: {
      security_badges: true,
      card_brands: true,
      security_text: 'Seus dados estão protegidos com criptografia SSL',
      links: [],
      powered_by: true
    }
  },
  payment_methods: {
    card: {
      enabled: true,
      brands: ['visa', 'mastercard', 'elo', 'amex', 'hipercard'],
      max_installments: 12,
      interest_free_installments: 3,
      interest_rate: 2.99,
      min_installment_value: 10,
      min_value_to_installment: 50,
      soft_descriptor: '',
      require_cvv: true,
      require_name: true,
      three_ds: 'risk',
      allow_save_card: true
    },
    pix: {
      enabled: true,
      expiration_minutes: 30,
      discount_percentage: 5,
      custom_message: '',
      instructions: 'Abra o app do seu banco, escaneie o QR Code ou copie e cole o código Pix.',
      show_copy_paste: true,
      show_timer: true
    },
    display: {
      order: ['card', 'pix'],
      default_method: 'first',
      style: 'tabs',
      show_icons: true,
      show_descriptions: true
    }
  },
  experience: {
    validation: {
      realtime: true,
      delay_ms: 300,
      error_position: 'below',
      error_style: 'default'
    },
    autofill: {
      cep_lookup: true,
      browser_autocomplete: true,
      remember_customer: false
    },
    animations: {
      button_loading: 'spinner',
      success_animation: 'confetti',
      error_shake: true,
      step_transition: 'slide'
    },
    success_page: {
      message: 'Obrigado, {nome}! Seu pedido #{pedido} foi confirmado.',
      buttons: ['back_to_store', 'view_order'],
      redirect_url: '',
      redirect_delay: 0
    },
    error_page: {
      message: 'Não foi possível completar o pagamento.',
      options: ['retry', 'other_card', 'pix', 'support']
    },
    urgency: {
      offer_timer: false,
      offer_timer_minutes: 30,
      stock_limited: false,
      stock_count: 10,
      social_proof: false,
      social_proof_count: 50
    }
  },
  version: 1,
  version_history: []
};

export default function CheckoutBuilder() {
  const [activeTab, setActiveTab] = useState('builder');
  const [checkoutConfig, setCheckoutConfig] = useState(defaultCheckoutConfig);
  const [selectedElement, setSelectedElement] = useState(null);
  const [device, setDevice] = useState('desktop');
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState([defaultCheckoutConfig]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const queryClient = useQueryClient();

  // Get checkout ID from URL if editing existing
  const urlParams = new URLSearchParams(window.location.search);
  const checkoutId = urlParams.get('id');

  const { data: existingCheckout } = useQuery({
    queryKey: ['checkout', checkoutId],
    queryFn: () => base44.entities.CheckoutConfig.get(checkoutId),
    enabled: !!checkoutId
  });

  useEffect(() => {
    if (existingCheckout) {
      setCheckoutConfig(existingCheckout);
      setHistory([existingCheckout]);
      setHistoryIndex(0);
    }
  }, [existingCheckout]);

  const saveMutation = useMutation({
    mutationFn: async (config) => {
      if (checkoutId) {
        return base44.entities.CheckoutConfig.update(checkoutId, config);
      }
      return base44.entities.CheckoutConfig.create(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['checkouts']);
      setIsSaving(false);
    }
  });

  const updateConfig = (updates) => {
    const newConfig = { ...checkoutConfig, ...updates };
    setCheckoutConfig(newConfig);
    
    // Add to history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newConfig);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCheckoutConfig(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCheckoutConfig(history[historyIndex + 1]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    saveMutation.mutate(checkoutConfig);
  };

  const handleAddElement = (element) => {
    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      props: { ...element.defaultProps }
    };
    updateConfig({
      elements: [...checkoutConfig.elements, newElement]
    });
    setSelectedElement(newElement);
  };

  const handleUpdateElement = (elementId, updates) => {
    const updatedElements = checkoutConfig.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    updateConfig({ elements: updatedElements });
  };

  const handleDeleteElement = (elementId) => {
    const updatedElements = checkoutConfig.elements.filter(el => el.id !== elementId);
    updateConfig({ elements: updatedElements });
    setSelectedElement(null);
  };

  const handleReorderElements = (newElements) => {
    updateConfig({ elements: newElements });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Builder de Checkout"
        subtitle="Crie e personalize seus checkouts com um editor visual"
        breadcrumbs={[
          { label: 'Checkout', page: 'CheckoutBuilder' },
          { label: 'Builder', page: 'CheckoutBuilder' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex === 0}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
              <Redo2 className="w-4 h-4" />
            </Button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-[#00D26A] hover:bg-[#00B85C]">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button size="sm" className="bg-[#101F3E] hover:bg-[#1a2d52]">
              <Play className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto flex-wrap gap-1 p-1 bg-white border">
          <TabsTrigger value="builder" className="gap-1.5 data-[state=active]:bg-[#00D26A]/10 data-[state=active]:text-[#00D26A]">
            <LayoutTemplate className="w-4 h-4" />
            Editor Visual
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5 data-[state=active]:bg-[#00D26A]/10 data-[state=active]:text-[#00D26A]">
            <Palette className="w-4 h-4" />
            Identidade Visual
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-1.5 data-[state=active]:bg-[#00D26A]/10 data-[state=active]:text-[#00D26A]">
            <LayoutGrid className="w-4 h-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-1.5 data-[state=active]:bg-[#00D26A]/10 data-[state=active]:text-[#00D26A]">
            <CreditCard className="w-4 h-4" />
            Pagamentos
          </TabsTrigger>
          <TabsTrigger value="experience" className="gap-1.5 data-[state=active]:bg-[#00D26A]/10 data-[state=active]:text-[#00D26A]">
            <Sparkles className="w-4 h-4" />
            Experiência
          </TabsTrigger>
          <TabsTrigger value="converter" className="gap-1.5 data-[state=active]:bg-[#00D26A]/10 data-[state=active]:text-[#00D26A]">
            <Sparkles className="w-4 h-4" />
            Converter Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-4">
          {/* Builder Toolbar */}
          <div className="flex items-center justify-between p-3 bg-white border rounded-t-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Dispositivo:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("rounded-none", device === 'desktop' && "bg-gray-100")}
                  onClick={() => setDevice('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("rounded-none border-x", device === 'tablet' && "bg-gray-100")}
                  onClick={() => setDevice('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("rounded-none", device === 'mobile' && "bg-gray-100")}
                  onClick={() => setDevice('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Zoom:</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Builder Layout */}
          <div className="flex h-[calc(100vh-340px)] border border-t-0 rounded-b-lg overflow-hidden">
            <ElementPanel onAddElement={handleAddElement} />
            <VisualEditor 
              config={checkoutConfig}
              elements={checkoutConfig.elements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onReorderElements={handleReorderElements}
              device={device}
              zoom={zoom}
            />
            <PropertiesPanel 
              element={selectedElement}
              config={checkoutConfig}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
            />
          </div>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <BrandingSettings 
            branding={checkoutConfig.branding}
            onChange={(branding) => updateConfig({ branding })}
          />
        </TabsContent>

        <TabsContent value="layout" className="mt-4">
          <LayoutSettings 
            layout={checkoutConfig.layout}
            onChange={(layout) => updateConfig({ layout })}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <PaymentMethodSettings 
            paymentMethods={checkoutConfig.payment_methods}
            onChange={(payment_methods) => updateConfig({ payment_methods })}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          <ExperienceSettings 
            experience={checkoutConfig.experience}
            onChange={(experience) => updateConfig({ experience })}
          />
        </TabsContent>

        <TabsContent value="converter" className="mt-4">
          <ConverterAgentTab checkoutId={checkoutId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}