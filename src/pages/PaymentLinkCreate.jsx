import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  ArrowLeft, Eye, Info, DollarSign, Package, Clock,
  Target, Palette, CreditCard, Check, Sparkles, ShoppingBag, Repeat, TicketPercent,
  Smartphone, Monitor, Tablet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import PaymentLinkPreview from '@/components/payment-links/PaymentLinkPreview';

import OrderBumpsSection from '@/components/payment-links/create/OrderBumpsSection';
import RecurrenceTrialSection from '@/components/payment-links/create/RecurrenceTrialSection';

const tabs = [
  { id: 'basic', label: 'Informações', icon: Info, group: 'core' },
  { id: 'value', label: 'Valor', icon: DollarSign, group: 'core' },
  { id: 'quantity', label: 'Quantidade', icon: Package, group: 'optional' },
  { id: 'validity', label: 'Validade', icon: Clock, group: 'optional' },
  { id: 'coupons', label: 'Cupons', icon: TicketPercent, group: 'optional' },
  { id: 'order_bumps', label: 'Bumps & Upsells', icon: ShoppingBag, group: 'advanced', isNew: true },
  { id: 'recurrence', label: 'Recorrência', icon: Repeat, group: 'advanced', isNew: true },
  { id: 'tracking', label: 'Rastreamento', icon: Target, group: 'advanced' },
  { id: 'personalization', label: 'Personalização', icon: Palette, group: 'advanced' },
  { id: 'payment', label: 'Pagamento', icon: CreditCard, group: 'core' },
];

export default function PaymentLinkCreate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const linkId = params.get('id');
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState('basic');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [validationErrors, setValidationErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved

  const [formData, setFormData] = useState({
    name: '', description: '', long_description: '', main_image_url: '',
    gallery_image_urls: [], value_type: 'fixed', amount: null,
    min_amount: null, max_amount: null, suggested_amounts: [], currency: 'BRL',
    allow_quantity: false, min_quantity: 1, max_quantity: null,
    variations: [], custom_fields: [], expiration_date: null,
    usage_limit_type: 'unlimited', usage_limit_count: null, stock: null,
    operating_hours: null, external_reference: '', metadata: null,
    utm_parameters: {}, pixel_ids: {}, slug: '', custom_domain: '',
    use_default_checkout: true, checkout_layout_type: 'default', logo_url: '',
    brand_color: '#2bc196', success_message: '', success_redirect_url: '', error_message: '',
    payment_methods: ['card', 'pix'], method_order: ['card', 'pix'],
    max_installments: 12, interest_free_installments: 1, promotional_installments: false,
    pix_discount_percentage: 0, pix_expiration_minutes: 30,
    linked_coupon_ids: [], auto_apply_coupon_id: '',
    order_bumps: [], upsells: [],
    is_recurring: false, recurrence_cycle: 'monthly', recurrence_cycles: '',
    has_trial: false, trial_days: 7, require_card_on_trial: true,
    status: 'draft',
  });

  const { data: existingLink } = useQuery({
    queryKey: ['payment-link', linkId],
    queryFn: () => base44.entities.PaymentLink.get(linkId),
    enabled: !!linkId,
  });

  useEffect(() => {
    if (existingLink) setFormData((prev) => ({ ...prev, ...existingLink }));
  }, [existingLink]);

  // Pré-preenche com sugestões da IA via query params (quando vem do AILinkDrawer "Refinar")
  useEffect(() => {
    const aiName = params.get('ai_name');
    if (aiName) {
      setFormData((prev) => ({
        ...prev,
        name: aiName,
        description: params.get('ai_desc') || '',
        amount: parseFloat(params.get('ai_amount')) || null,
        main_image_url: params.get('ai_image') || '',
      }));
    }
  }, [params]);

  // Auto-save de rascunho (debounced)
  useEffect(() => {
    if (!formData.name) return;
    const t = setTimeout(() => {
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 600);
    }, 1500);
    return () => clearTimeout(t);
  }, [formData]);

  const createMutation = useMutation({
    mutationFn: (data) =>
      base44.entities.PaymentLink.create({
        ...data,
        link_id: `link_${Date.now()}`,
        url: `https://pay.pagsmile.com/${data.slug || Date.now()}`,
        short_url: `https://pag.sm/${Date.now().toString(36)}`,
      }),
    onSuccess: (res) => {
      qc.invalidateQueries(['payment-links']);
      toast.success('Link criado com sucesso!');
      navigate(createPageUrl('PaymentLinkDetail') + `?id=${res.id}`);
    },
    onError: () => toast.error('Erro ao criar link'),
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.update(linkId, data),
    onSuccess: () => {
      qc.invalidateQueries(['payment-links']);
      toast.success('Link atualizado!');
      navigate(createPageUrl('PaymentLinks'));
    },
    onError: () => toast.error('Erro ao atualizar'),
  });

  const validateAll = () => {
    const errs = {};
    if (!formData.name) errs.basic = 'Nome obrigatório';
    if (formData.value_type === 'fixed' && !formData.amount) errs.value = 'Valor obrigatório';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (status = 'draft') => {
    if (!validateAll()) {
      const firstErr = Object.keys(validationErrors)[0];
      if (firstErr) setActiveTab(firstErr);
      toast.error('Corrija os campos com erro antes de salvar');
      return;
    }
    const dataToSave = { ...formData, status };
    if (linkId) updateMutation.mutate(dataToSave);
    else createMutation.mutate(dataToSave);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Progresso global
  const completedSections = [
    !!formData.name,
    !!formData.amount || formData.value_type !== 'fixed',
    formData.payment_methods?.length > 0,
    !!formData.main_image_url,
    !!formData.description,
  ].filter(Boolean).length;
  const totalSections = 5;
  const progress = (completedSections / totalSections) * 100;

  return (
    <div className="space-y-4">
      <PageHeader
        title={linkId ? 'Editar Link' : 'Novo Link · Editor Completo'}
        subtitle={linkId ? `Editando: ${formData.name}` : 'Configure todas as opções avançadas com preview em tempo real'}
        breadcrumbs={[
          { label: 'Links de Pagamento', page: 'PaymentLinks' },
          { label: linkId ? 'Editar' : 'Novo' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* Save indicator */}
            {saveStatus === 'saving' && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                Salvando...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Rascunho salvo
              </span>
            )}

            <Button variant="outline" onClick={() => navigate(createPageUrl('PaymentLinks'))}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={isLoading}>
              Rascunho
            </Button>
            <Button
              className="bg-[#2bc196] hover:bg-[#239b7a]"
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

      {/* Indicador de progresso global */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2bc196]" />
            <span className="text-xs font-semibold">Progresso de criação</span>
          </div>
          <span className="text-xs text-slate-500">
            {completedSections} de {totalSections} seções essenciais
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar — agrupada */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border p-2 sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto">
            <SidebarGroup
              title="Essencial"
              items={tabs.filter((t) => t.group === 'core')}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              errors={validationErrors}
            />
            <SidebarGroup
              title="Opcional"
              items={tabs.filter((t) => t.group === 'optional')}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              errors={validationErrors}
            />
            <SidebarGroup
              title="Avançado"
              items={tabs.filter((t) => t.group === 'advanced')}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              errors={validationErrors}
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-xl border p-6">
            {activeTab === 'basic' && <BasicInfoSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'value' && <ValueConfigSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'quantity' && <QuantityVariationsSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'validity' && <ValidityLimitsSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'coupons' && <CouponBindingSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'order_bumps' && <OrderBumpsSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'recurrence' && <RecurrenceTrialSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'tracking' && <TrackingSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'personalization' && <PersonalizationSection formData={formData} setFormData={setFormData} />}
            {activeTab === 'payment' && <PaymentMethodsSection formData={formData} setFormData={setFormData} />}
          </div>

          <div className="flex justify-between mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const i = tabs.findIndex((t) => t.id === activeTab);
                if (i > 0) setActiveTab(tabs[i - 1].id);
              }}
              disabled={activeTab === tabs[0].id}
            >
              ← Anterior
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const i = tabs.findIndex((t) => t.id === activeTab);
                if (i < tabs.length - 1) setActiveTab(tabs[i + 1].id);
                else handleSave('active');
              }}
              className="bg-[#2bc196] hover:bg-[#239b7a]"
            >
              {activeTab === tabs[tabs.length - 1].id ? 'Finalizar →' : 'Próximo →'}
            </Button>
          </div>
        </div>

        {/* Preview com toggle device */}
        <div className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-24 space-y-2">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl border p-2">
              <span className="text-xs font-semibold flex items-center gap-1 px-2">
                <Eye className="w-3 h-3" /> Preview
              </span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                  className="h-7 w-7"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                  className="h-7 w-7"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                  className="h-7 w-7"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className={cn(previewDevice === 'mobile' && 'max-w-xs mx-auto', previewDevice === 'tablet' && 'max-w-md mx-auto')}>
              <PaymentLinkPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarGroup({ title, items, activeTab, setActiveTab, errors }) {
  return (
    <div className="mb-3">
      <p className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5">{title}</p>
      <nav className="space-y-0.5">
        {items.map((tab) => {
          const Icon = tab.icon;
          const hasError = errors?.[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                activeTab === tab.id
                  ? 'bg-[#2bc196]/10 text-[#2bc196]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
              {hasError && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />}
              {tab.isNew && (
                <Badge className="bg-blue-500 text-white text-[8px] ml-auto px-1">NOVO</Badge>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}