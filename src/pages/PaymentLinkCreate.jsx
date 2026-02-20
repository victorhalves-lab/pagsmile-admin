import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, 
  Save, 
  Eye,
  Link2,
  Info,
  DollarSign,
  Package,
  Clock,
  Target,
  Palette,
  CreditCard,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import BasicInfoSection from '@/components/payment-links/BasicInfoSection';
import ValueConfigSection from '@/components/payment-links/ValueConfigSection';
import QuantityVariationsSection from '@/components/payment-links/QuantityVariationsSection';
import ValidityLimitsSection from '@/components/payment-links/ValidityLimitsSection';
import TrackingSection from '@/components/payment-links/TrackingSection';
import PersonalizationSection from '@/components/payment-links/PersonalizationSection';
import PaymentMethodsSection from '@/components/payment-links/PaymentMethodsSection';
import CouponBindingSection from '@/components/payment-links/CouponBindingSection';
import { TicketPercent } from 'lucide-react';

const tabs = [
  { id: 'basic', label: 'Informações', icon: Info },
  { id: 'value', label: 'Valor', icon: DollarSign },
  { id: 'quantity', label: 'Quantidade', icon: Package },
  { id: 'validity', label: 'Validade', icon: Clock },
  { id: 'coupons', label: 'Cupons', icon: TicketPercent },
  { id: 'tracking', label: 'Rastreamento', icon: Target },
  { id: 'personalization', label: 'Personalização', icon: Palette },
  { id: 'payment', label: 'Pagamento', icon: CreditCard },
];

export default function PaymentLinkCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkId = searchParams.get('id');
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    long_description: '',
    main_image_url: '',
    gallery_image_urls: [],
    value_type: 'fixed',
    amount: null,
    min_amount: null,
    max_amount: null,
    suggested_amounts: [],
    currency: 'BRL',
    allow_quantity: false,
    min_quantity: 1,
    max_quantity: null,
    variations: [],
    custom_fields: [],
    expiration_date: null,
    usage_limit_type: 'unlimited',
    usage_limit_count: null,
    stock: null,
    operating_hours: null,
    external_reference: '',
    metadata: null,
    utm_parameters: {},
    pixel_ids: {},
    slug: '',
    custom_domain: '',
    use_default_checkout: true,
    checkout_layout_type: 'default',
    logo_url: '',
    brand_color: '#00D26A',
    success_message: '',
    success_redirect_url: '',
    error_message: '',
    payment_methods: ['card', 'pix'],
    method_order: ['card', 'pix'],
    max_installments: 12,
    interest_free_installments: 1,
    promotional_installments: false,
    pix_discount_percentage: 0,
    pix_expiration_minutes: 30,
    linked_coupon_ids: [],
    auto_apply_coupon_id: '',
    status: 'draft',
  });

  // Load existing link if editing
  const { data: existingLink, isLoading: loadingLink } = useQuery({
    queryKey: ['payment-link', linkId],
    queryFn: () => base44.entities.PaymentLink.get(linkId),
    enabled: !!linkId,
  });

  useEffect(() => {
    if (existingLink) {
      setFormData({ ...formData, ...existingLink });
    }
  }, [existingLink]);

  const createMutation = useMutation({
    mutationFn: (data) => {
      const linkData = {
        ...data,
        link_id: `link_${Date.now()}`,
        url: `https://pay.pagsmile.com/${data.slug || Date.now()}`,
        short_url: `https://pag.sm/${Date.now().toString(36)}`,
      };
      return base44.entities.PaymentLink.create(linkData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
      toast.success('Link criado com sucesso!');
      navigate(createPageUrl('PaymentLinks'));
    },
    onError: (err) => {
      toast.error('Erro ao criar link');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.update(linkId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-links']);
      toast.success('Link atualizado com sucesso!');
      navigate(createPageUrl('PaymentLinks'));
    },
    onError: (err) => {
      toast.error('Erro ao atualizar link');
    }
  });

  const handleSave = (status = 'draft') => {
    if (!formData.name) {
      toast.error('Nome é obrigatório');
      setActiveTab('basic');
      return;
    }

    if (formData.value_type === 'fixed' && !formData.amount) {
      toast.error('Valor é obrigatório para links de valor fixo');
      setActiveTab('value');
      return;
    }

    const dataToSave = { ...formData, status };

    if (linkId) {
      updateMutation.mutate(dataToSave);
    } else {
      createMutation.mutate(dataToSave);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title={linkId ? 'Editar Link' : 'Novo Link de Pagamento'}
        subtitle={linkId ? `Editando: ${formData.name}` : 'Crie um link para receber pagamentos'}
        breadcrumbs={[
          { label: 'Links de Pagamento', page: 'PaymentLinks' },
          { label: linkId ? 'Editar' : 'Novo' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(createPageUrl('PaymentLinks'))}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={isLoading}>
              Salvar Rascunho
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]" 
              onClick={() => handleSave('active')}
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {linkId ? 'Atualizar e Ativar' : 'Criar e Ativar'}
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-2 sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-[#00D26A]/10 text-[#00D26A]"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {activeTab === 'basic' && (
              <BasicInfoSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'value' && (
              <ValueConfigSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'quantity' && (
              <QuantityVariationsSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'validity' && (
              <ValidityLimitsSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'coupons' && (
              <CouponBindingSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'tracking' && (
              <TrackingSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'personalization' && (
              <PersonalizationSection formData={formData} setFormData={setFormData} />
            )}
            {activeTab === 'payment' && (
              <PaymentMethodsSection formData={formData} setFormData={setFormData} />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={activeTab === tabs[0].id}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              disabled={activeTab === tabs[tabs.length - 1].id}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}