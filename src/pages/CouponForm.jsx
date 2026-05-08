import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import {
  TicketPercent, Save, X, Shuffle, Copy, Mail, Percent, DollarSign, Calendar,
  Target, Info, Zap, Wand2, Eye, Check, Tag as TagIcon, Clock, Sparkles,
} from 'lucide-react';
import { mockCoupons } from '@/components/mockData/couponMocks';
import CouponLinkBinding from '@/components/coupons/CouponLinkBinding';
import CouponWizard from '@/components/coupons/form/CouponWizard';
import CouponTemplatesPicker from '@/components/coupons/form/CouponTemplatesPicker';
import CouponAIAssistant from '@/components/coupons/form/CouponAIAssistant';
import CouponAdvancedRules from '@/components/coupons/form/CouponAdvancedRules';
import CouponImpactIndicator from '@/components/coupons/form/CouponImpactIndicator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

export default function CouponForm() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const isEditing = !!editId;

  const [mode, setMode] = useState(isEditing ? 'advanced' : 'wizard'); // wizard | simple | advanced
  const [saveStatus, setSaveStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    min_purchase_amount: '',
    max_discount_amount: '',
    start_date: '',
    end_date: '',
    usage_limit_total: '',
    usage_limit_per_user: '',
    applies_to: 'all_products',
    target_items: [],
    is_stackable: false,
    is_nominal: false,
    assigned_to_email: '',
    link_scope: 'all',
    linked_payment_link_ids: [],
    linked_checkout_ids: [],
    // novos
    tags: [],
    owner: '',
    visibility: 'private',
    schedule_activation: false,
    is_tiered: false, tiered_rules: [],
    is_bogo: false, bogo_buy_qty: '', bogo_get_qty: '',
    has_geo_restriction: false, geo_scope: 'states',
    has_method_restriction: false, method_required: 'pix',
    has_trigger: false, trigger_event: 'cart_abandon',
    campaign_budget_total: '',
  });

  useEffect(() => {
    if (isEditing) {
      const coupon = mockCoupons.find((c) => c.id === editId);
      if (coupon) setForm((p) => ({ ...p, ...coupon, value: coupon.value }));
    }
  }, [editId, isEditing]);

  // Auto-save mock
  useEffect(() => {
    if (!form.code || mode === 'wizard') return;
    setSaveStatus('saving');
    const t = setTimeout(() => setSaveStatus('saved'), 800);
    return () => clearTimeout(t);
  }, [form, mode]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const generatedLink = form.code && (form.is_nominal || form.public_link_enabled)
    ? `https://checkout.pagsmile.com/pay/link_auto?coupon=${form.code}`
    : null;

  // Progresso
  const progress = (() => {
    let done = 0; let total = 5;
    if (form.code) done++;
    if (form.name) done++;
    if (form.value) done++;
    if (form.start_date) done++;
    if (form.applies_to) done++;
    return (done / total) * 100;
  })();

  const validate = () => {
    const errs = {};
    if (!form.code) errs.code = 'Obrigatório';
    if (!form.name) errs.name = 'Obrigatório';
    if (!form.value) errs.value = 'Obrigatório';
    if (!form.start_date) errs.start_date = 'Obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (asActive = true) => {
    if (!validate()) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    toast.success(isEditing
      ? 'Cupom atualizado!'
      : asActive ? 'Cupom criado e ativado!' : 'Rascunho salvo'
    );
    setTimeout(() => navigate(createPageUrl('CouponList')), 600);
  };

  const handleSimulate = () => {
    toast.info(`Simulação: cupom aplicaria ${form.type === 'percentage' ? form.value + '%' : 'R$ ' + form.value} em uma compra de R$ 200 = R$ ${form.type === 'percentage' ? (200 * (form.value / 100)).toFixed(2) : (200 - form.value).toFixed(2)} final.`);
  };

  const handleWizardComplete = (config) => {
    setForm((prev) => ({ ...prev, ...config }));
    setMode('advanced');
  };

  const handleTemplateOrAI = (config) => {
    setForm((prev) => ({ ...prev, ...config }));
    toast.success('Configuração aplicada — refine os campos abaixo');
  };

  // Modo Wizard
  if (mode === 'wizard' && !isEditing) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Criar Cupom"
          subtitle="Como você prefere criar?"
          icon={TicketPercent}
          breadcrumbs={[
            { label: 'Promoções', page: 'CouponsOverview' },
            { label: 'Criar' },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setMode('simple')}>
                <Zap className="w-3.5 h-3.5 mr-1" /> Modo simples
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMode('advanced')}>
                Modo avançado
              </Button>
              <Link to={createPageUrl('CouponList')}>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
              </Link>
            </div>
          }
        />

        {/* AI Assistant + Templates + Wizard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CouponAIAssistant onApply={(s) => { handleTemplateOrAI(s); setMode('advanced'); }} />
          <CouponTemplatesPicker onPick={(s) => { handleTemplateOrAI(s); setMode('advanced'); }} />
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">ou</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <CouponWizard
          onComplete={handleWizardComplete}
          onCancel={() => setMode('advanced')}
        />
      </div>
    );
  }

  // Modo Simples (4 campos chave)
  if (mode === 'simple' && !isEditing) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Criar Cupom — Modo Simples"
          subtitle="Apenas 4 campos essenciais"
          icon={Zap}
          breadcrumbs={[
            { label: 'Promoções', page: 'CouponsOverview' },
            { label: 'Criar' },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setMode('advanced')}>
                Modo avançado
              </Button>
              <Link to={createPageUrl('CouponList')}>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
              </Link>
            </div>
          }
        />

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base">Cupom rápido</CardTitle>
            <CardDescription>Para 80% dos casos comuns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Código *</Label>
              <div className="flex gap-2 mt-1">
                <Input value={form.code} onChange={(e) => update('code', e.target.value.toUpperCase())} className="font-mono" />
                <Button variant="outline" size="icon" onClick={() => update('code', generateRandomCode())}>
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Valor do desconto *</Label>
              <div className="flex gap-2 mt-1">
                <Select value={form.type} onValueChange={(v) => update('type', v)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed_amount">R$</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" value={form.value} onChange={(e) => update('value', e.target.value)} placeholder="10" />
              </div>
            </div>
            <div>
              <Label>Válido até</Label>
              <Input type="date" value={form.end_date?.slice(0, 10) || ''} onChange={(e) => update('end_date', e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Aplica em</Label>
              <Select value={form.applies_to} onValueChange={(v) => update('applies_to', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_products">Todos os produtos</SelectItem>
                  <SelectItem value="specific_products">Produtos específicos</SelectItem>
                  <SelectItem value="specific_categories">Categorias específicas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => handleSave(false)}>
                Salvar rascunho
              </Button>
              <Button className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => handleSave(true)}>
                <Check className="w-4 h-4 mr-1" /> Criar e ativar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Modo Avançado (default para edição)
  return (
    <div className="space-y-3">
      <PageHeader
        title={isEditing ? 'Editar Cupom' : 'Criar Cupom — Avançado'}
        subtitle={isEditing ? `Editando: ${form.code}` : 'Configure todos os detalhes'}
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Promoções', page: 'CouponsOverview' },
          { label: 'Lista', page: 'CouponList' },
          { label: isEditing ? 'Editar' : 'Criar' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <div className="w-2.5 h-2.5 border border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                Salvando...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Rascunho salvo
              </span>
            )}
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setMode('wizard')}>
                <Wand2 className="w-3.5 h-3.5 mr-1" /> Voltar ao wizard
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleSimulate}>
              <Eye className="w-3.5 h-3.5 mr-1" /> Testar
            </Button>
            <Link to={createPageUrl('CouponList')}>
              <Button variant="outline" size="sm"><X className="w-4 h-4 mr-1" /> Cancelar</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => handleSave(false)}>
              Rascunho
            </Button>
            <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => handleSave(true)}>
              <Save className="w-4 h-4 mr-1" /> {isEditing ? 'Atualizar' : 'Criar e ativar'}
            </Button>
          </div>
        }
      />

      {/* Indicador de progresso */}
      <Card>
        <CardContent className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="w-3.5 h-3.5 text-[#2bc196]" />
            <span className="text-xs font-semibold">Progresso de configuração</span>
            <Progress value={progress} className="h-1.5 max-w-md" />
            <span className="text-[10px] text-slate-500">{Math.round(progress)}%</span>
          </div>
          <CouponImpactIndicator form={form} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main column — sections em accordion */}
        <div className="lg:col-span-2 space-y-3">
          <Accordion type="multiple" defaultValue={['basic', 'discount']} className="space-y-2">
            {/* Básico */}
            <AccordionItem value="basic" className="border rounded-xl bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-semibold">Informações básicas</span>
                  {(errors.code || errors.name) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Código *</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={form.code}
                        onChange={(e) => update('code', e.target.value.toUpperCase())}
                        className={cn('font-mono', errors.code && 'border-red-300')}
                      />
                      <Button variant="outline" size="icon" onClick={() => update('code', generateRandomCode())}>
                        <Shuffle className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.code && <p className="text-[10px] text-red-500 mt-1">{errors.code}</p>}
                  </div>
                  <div>
                    <Label>Nome *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={cn('mt-1', errors.name && 'border-red-300')}
                      placeholder="Ex: 10% OFF Primeira Compra"
                    />
                  </div>
                </div>
                <div>
                  <Label>Descrição / Termos</Label>
                  <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className="mt-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="flex items-center gap-1">
                      <TagIcon className="w-3 h-3" /> Tags
                    </Label>
                    <Input
                      value={(form.tags || []).join(', ')}
                      onChange={(e) => update('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                      placeholder="black-friday, marketing"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Responsável</Label>
                    <Input
                      value={form.owner}
                      onChange={(e) => update('owner', e.target.value)}
                      placeholder="Nome / equipe"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">Cupom público (vitrine)</p>
                    <p className="text-[10px] text-slate-500">Aparece em vitrine pública vs apenas com link/código</p>
                  </div>
                  <Switch
                    checked={form.visibility === 'public'}
                    onCheckedChange={(v) => update('visibility', v ? 'public' : 'private')}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Desconto */}
            <AccordionItem value="discount" className="border rounded-xl bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  {form.type === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                  <span className="text-sm font-semibold">Detalhes do desconto</span>
                  {errors.value && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Tipo *</Label>
                    <Select value={form.type} onValueChange={(v) => update('type', v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentual (%)</SelectItem>
                        <SelectItem value="fixed_amount">Valor fixo (R$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Valor *</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        {form.type === 'percentage' ? '%' : 'R$'}
                      </span>
                      <Input
                        type="number" value={form.value}
                        onChange={(e) => update('value', e.target.value)}
                        className={cn('pl-9', errors.value && 'border-red-300')}
                      />
                    </div>
                    {/* Benchmark inline */}
                    {form.value && form.type === 'percentage' && (
                      <p className="text-[10px] text-blue-600 mt-1 flex items-center gap-1">
                        💡 Cupons de {form.value}% têm ~{(15 + form.value * 0.8).toFixed(0)}% de conversão.
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Compra mínima</Label>
                    <Input type="number" value={form.min_purchase_amount} onChange={(e) => update('min_purchase_amount', e.target.value)} placeholder="0,00" className="mt-1" />
                  </div>
                  {form.type === 'percentage' && (
                    <div>
                      <Label>Desconto máx (teto)</Label>
                      <Input type="number" value={form.max_discount_amount} onChange={(e) => update('max_discount_amount', e.target.value)} placeholder="Sem limite" className="mt-1" />
                    </div>
                  )}
                </div>
                <div>
                  <Label>Orçamento total da campanha</Label>
                  <Input
                    type="number"
                    value={form.campaign_budget_total}
                    onChange={(e) => update('campaign_budget_total', e.target.value)}
                    placeholder="Ex: 50000 (em R$). Desativa quando atingir."
                    className="mt-1"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Validade & Limites */}
            <AccordionItem value="validity" className="border rounded-xl bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Validade e limites</span>
                  {errors.start_date && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Início *</Label>
                    <Input
                      type="datetime-local" value={form.start_date}
                      onChange={(e) => update('start_date', e.target.value)}
                      className={cn('mt-1', errors.start_date && 'border-red-300')}
                    />
                  </div>
                  <div>
                    <Label>Expiração</Label>
                    <Input type="datetime-local" value={form.end_date} onChange={(e) => update('end_date', e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Limite total de uso</Label>
                    <Input type="number" value={form.usage_limit_total} onChange={(e) => update('usage_limit_total', e.target.value)} placeholder="Sem limite" className="mt-1" />
                  </div>
                  <div>
                    <Label>Limite por cliente</Label>
                    <Input type="number" value={form.usage_limit_per_user} onChange={(e) => update('usage_limit_per_user', e.target.value)} placeholder="Sem limite" className="mt-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">Empilhável com outros descontos</p>
                    <p className="text-[10px] text-slate-500">Permite combinar com outras promoções</p>
                  </div>
                  <Switch checked={form.is_stackable} onCheckedChange={(v) => update('is_stackable', v)} />
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-xs font-medium">Agendar ativação</p>
                    <p className="text-[10px] text-slate-500">Cupom criado mas só ativa na data de início</p>
                  </div>
                  <Switch checked={form.schedule_activation} onCheckedChange={(v) => update('schedule_activation', v)} />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Vinculação */}
            <AccordionItem value="binding" className="border rounded-xl bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold">Vinculação a links e checkouts</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <CouponLinkBinding form={form} update={update} />
              </AccordionContent>
            </AccordionItem>

            {/* Escopo */}
            <AccordionItem value="scope" className="border rounded-xl bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold">Escopo de aplicação</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-3">
                <Select value={form.applies_to} onValueChange={(v) => update('applies_to', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_products">Todos os produtos</SelectItem>
                    <SelectItem value="specific_products">Produtos específicos</SelectItem>
                    <SelectItem value="specific_categories">Categorias específicas</SelectItem>
                    <SelectItem value="specific_plans">Planos de assinatura</SelectItem>
                    <SelectItem value="exclude_products">Todos exceto produtos X</SelectItem>
                  </SelectContent>
                </Select>
                {form.applies_to !== 'all_products' && (
                  <Input
                    value={form.target_items.join(', ')}
                    onChange={(e) => update('target_items', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                    placeholder="Separe por vírgula"
                  />
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Regras avançadas */}
            <AccordionItem value="rules" className="border rounded-xl bg-white dark:bg-slate-900">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold">Regras avançadas</span>
                  <Badge className="bg-amber-100 text-amber-700 text-[9px] border-0 ml-1">PRO</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <CouponAdvancedRules form={form} update={update} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {/* Cupom Nominal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-600" /> Cupom Nominal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div>
                  <p className="text-xs font-medium">Restringir a destinatário</p>
                  <p className="text-[10px] text-slate-500">E-mail único + link gerado</p>
                </div>
                <Switch checked={form.is_nominal} onCheckedChange={(v) => update('is_nominal', v)} />
              </div>
              {form.is_nominal && (
                <Input
                  type="email" value={form.assigned_to_email}
                  onChange={(e) => update('assigned_to_email', e.target.value)}
                  placeholder="cliente@email.com"
                />
              )}
              {generatedLink && (
                <div>
                  <Label className="text-[10px]">Link auto-aplicado</Label>
                  <div className="flex gap-1 mt-1">
                    <Input value={generatedLink} readOnly className="font-mono text-[10px] h-8" />
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(generatedLink); toast.success('Copiado'); }}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Pré-visualização</span>
                <Button variant="ghost" size="sm" className="text-[10px] h-6">
                  <Eye className="w-3 h-3 mr-1" /> Como cliente
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-emerald-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-md mb-2">
                  <TicketPercent className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-mono font-bold text-lg">{form.code || 'PROMO10'}</p>
                <p className="text-[10px] text-slate-500">{form.name || '10% OFF Primeira Compra'}</p>
                <p className="text-2xl font-black text-emerald-600 mt-2">
                  {form.value
                    ? form.type === 'percentage' ? `${form.value}% OFF` : `R$${form.value} OFF`
                    : '10% OFF'}
                </p>
                {(form.min_purchase_amount || !form.value) && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Compra mínima: R${form.min_purchase_amount || '50'}
                  </p>
                )}
                {form.is_nominal && form.assigned_to_email && (
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    <Mail className="w-2.5 h-2.5 mr-1" /> {form.assigned_to_email}
                  </Badge>
                )}
                {form.end_date && (
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    Válido até {new Date(form.end_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save mobile */}
          <div className="lg:hidden">
            <Button className="w-full bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => handleSave(true)}>
              <Save className="w-4 h-4 mr-1" /> Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}