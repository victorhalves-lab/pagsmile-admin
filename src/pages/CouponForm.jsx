import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TicketPercent,
  Save,
  X,
  Shuffle,
  Copy,
  LinkIcon,
  Mail,
  Percent,
  DollarSign,
  Calendar,
  Shield,
  Target,
  Info
} from 'lucide-react';
import { mockCoupons } from '@/components/mockData/couponMocks';
import CouponLinkBinding from '@/components/coupons/CouponLinkBinding';

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

export default function CouponForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');
  const isEditing = !!editId;

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
  });

  useEffect(() => {
    if (isEditing) {
      const coupon = mockCoupons.find(c => c.id === editId);
      if (coupon) {
        setForm({
          code: coupon.code,
          name: coupon.name,
          description: coupon.description || '',
          type: coupon.type,
          value: coupon.value,
          min_purchase_amount: coupon.min_purchase_amount || '',
          max_discount_amount: coupon.max_discount_amount || '',
          start_date: coupon.start_date ? coupon.start_date.slice(0, 16) : '',
          end_date: coupon.end_date ? coupon.end_date.slice(0, 16) : '',
          usage_limit_total: coupon.usage_limit_total || '',
          usage_limit_per_user: coupon.usage_limit_per_user || '',
          applies_to: coupon.applies_to,
          target_items: coupon.target_items || [],
          is_stackable: coupon.is_stackable,
          is_nominal: coupon.is_nominal,
          assigned_to_email: coupon.assigned_to_email || '',
          link_scope: coupon.link_scope || 'all',
          linked_payment_link_ids: coupon.linked_payment_link_ids || [],
          linked_checkout_ids: coupon.linked_checkout_ids || [],
        });
      }
    }
  }, [editId, isEditing]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const generatedLink = form.is_nominal && form.code
    ? `https://checkout.pagsmile.com/pay/link_auto?coupon=${form.code}`
    : null;

  const handleSave = () => {
    // Simulação - aqui chamaria base44.entities.Coupon.create/update
    alert(isEditing ? 'Cupom atualizado com sucesso!' : 'Cupom criado com sucesso!');
    window.location.href = createPageUrl('CouponList');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Editar Cupom' : 'Criar Novo Cupom'}
        subtitle={isEditing ? `Editando: ${form.code}` : 'Preencha os dados para criar um cupom'}
        icon={TicketPercent}
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'Cupons e Descontos', page: 'CouponsOverview' },
          { label: isEditing ? 'Editar Cupom' : 'Criar Cupom' }
        ]}
        actions={
          <div className="flex gap-2">
            <Link to={createPageUrl('CouponList')}>
              <Button variant="outline"><X className="w-4 h-4 mr-2" />Cancelar</Button>
            </Link>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Salvar Cupom</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código do Cupom *</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input id="code" value={form.code} onChange={(e) => update('code', e.target.value.toUpperCase())} placeholder="EX: DESCONTO10" className="font-mono" />
                    <Button type="button" variant="outline" size="icon" onClick={() => update('code', generateRandomCode())} title="Gerar código aleatório">
                      <Shuffle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Nome do Cupom *</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: 10% OFF Primeira Compra" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição / Termos de Uso</Label>
                <Textarea id="description" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Descreva os termos e condições do cupom..." className="mt-1.5" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Desconto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {form.type === 'percentage' ? <Percent className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                Detalhes do Desconto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Desconto *</Label>
                  <Select value={form.type} onValueChange={(v) => update('type', v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2"><Percent className="w-4 h-4" /> Percentual (%)</div>
                      </SelectItem>
                      <SelectItem value="fixed_amount">
                        <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Valor Fixo (R$)</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Valor do Desconto *</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                      {form.type === 'percentage' ? '%' : 'R$'}
                    </span>
                    <Input id="value" type="number" value={form.value} onChange={(e) => update('value', e.target.value)} placeholder="0" className="pl-10" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_purchase">Valor Mínimo da Compra</Label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">R$</span>
                    <Input id="min_purchase" type="number" value={form.min_purchase_amount} onChange={(e) => update('min_purchase_amount', e.target.value)} placeholder="0,00" className="pl-10" />
                  </div>
                </div>
                {form.type === 'percentage' && (
                  <div>
                    <Label htmlFor="max_discount">Desconto Máximo (teto)</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">R$</span>
                      <Input id="max_discount" type="number" value={form.max_discount_amount} onChange={(e) => update('max_discount_amount', e.target.value)} placeholder="Sem limite" className="pl-10" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validade e Limites */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Validade e Limites de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Data de Início *</Label>
                  <Input id="start_date" type="datetime-local" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="end_date">Data de Expiração</Label>
                  <Input id="end_date" type="datetime-local" value={form.end_date} onChange={(e) => update('end_date', e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="limit_total">Limite de Uso Total</Label>
                  <Input id="limit_total" type="number" value={form.usage_limit_total} onChange={(e) => update('usage_limit_total', e.target.value)} placeholder="Sem limite" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="limit_user">Limite por Cliente</Label>
                  <Input id="limit_user" type="number" value={form.usage_limit_per_user} onChange={(e) => update('usage_limit_per_user', e.target.value)} placeholder="Sem limite" className="mt-1.5" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Empilhável com outros descontos</p>
                  <p className="text-xs text-slate-500 mt-0.5">Permitir combinar com outros cupons ou promoções ativas</p>
                </div>
                <Switch checked={form.is_stackable} onCheckedChange={(v) => update('is_stackable', v)} />
              </div>
            </CardContent>
          </Card>

          {/* Vinculação a Links e Checkouts */}
          <CouponLinkBinding form={form} update={update} />

          {/* Escopo de Aplicação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Escopo de Aplicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Aplicável a</Label>
                <Select value={form.applies_to} onValueChange={(v) => update('applies_to', v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_products">Todos os Produtos</SelectItem>
                    <SelectItem value="specific_products">Produtos Específicos</SelectItem>
                    <SelectItem value="specific_categories">Categorias Específicas</SelectItem>
                    <SelectItem value="specific_plans">Planos de Assinatura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.applies_to !== 'all_products' && (
                <div>
                  <Label>
                    {form.applies_to === 'specific_products' ? 'Produtos' : form.applies_to === 'specific_categories' ? 'Categorias' : 'Planos'}
                  </Label>
                  <Input
                    value={form.target_items.join(', ')}
                    onChange={(e) => update('target_items', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Separe por vírgula (ex: Roupas, Acessórios)"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-slate-500 mt-1">Separe os itens por vírgula</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Nominal / Preview */}
        <div className="space-y-6">
          {/* Cupom Nominal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Cupom Nominal
              </CardTitle>
              <CardDescription>Restringir cupom a um destinatário específico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div>
                  <p className="font-medium text-sm">Cupom Nominal/Exclusivo</p>
                  <p className="text-xs text-slate-500 mt-0.5">Restrito a um e-mail ou link único</p>
                </div>
                <Switch checked={form.is_nominal} onCheckedChange={(v) => update('is_nominal', v)} />
              </div>

              {form.is_nominal && (
                <>
                  <div>
                    <Label htmlFor="email">E-mail do Destinatário</Label>
                    <Input id="email" type="email" value={form.assigned_to_email} onChange={(e) => update('assigned_to_email', e.target.value)} placeholder="cliente@email.com" className="mt-1.5" />
                  </div>

                  {generatedLink && (
                    <div>
                      <Label>Link com Cupom Automático</Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input value={generatedLink} readOnly className="font-mono text-xs bg-slate-50" />
                        <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(generatedLink)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Envie este link ao cliente - o cupom será aplicado automaticamente no checkout
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-lg mb-3">
                    <TicketPercent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="font-mono font-bold text-2xl text-slate-900 dark:text-white">
                    {form.code || 'CÓDIGO'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {form.name || 'Nome do Cupom'}
                  </p>
                  <div className="mt-3">
                    <span className="text-3xl font-black text-emerald-600">
                      {form.value ? (form.type === 'percentage' ? `${form.value}% OFF` : `R$${form.value} OFF`) : '-- OFF'}
                    </span>
                  </div>
                  {form.min_purchase_amount && (
                    <p className="text-xs text-slate-500 mt-2">Compra mínima: R${form.min_purchase_amount}</p>
                  )}
                  {form.is_nominal && form.assigned_to_email && (
                    <Badge variant="outline" className="mt-2 border-purple-300 text-purple-600">
                      <Mail className="w-3 h-3 mr-1" />
                      {form.assigned_to_email}
                    </Badge>
                  )}
                  {form.end_date && (
                    <p className="text-xs text-slate-400 mt-2">
                      Válido até {new Date(form.end_date).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button - mobile */}
          <div className="lg:hidden">
            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Salvar Cupom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}