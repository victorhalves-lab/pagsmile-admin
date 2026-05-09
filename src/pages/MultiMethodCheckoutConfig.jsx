import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Save, Sparkles, CheckCircle2, Eye, Rocket } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PaymentSplitter from '@/components/orchestration/PaymentSplitter';
import { CreditCard, QrCode, FileText, Wallet, Coins } from 'lucide-react';
import { ConfirmActionDrawer } from '@/components/common/drawers';
import { toast } from 'sonner';

const PAYMENT_OPTIONS = [
  { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, description: 'Visa, Master, Elo, Amex, Hipercard' },
  { id: 'debit_card', label: 'Cartão de Débito', icon: CreditCard, description: 'Visa Electron, Maestro' },
  { id: 'pix', label: 'PIX', icon: QrCode, description: 'Pagamento instantâneo' },
  { id: 'boleto', label: 'Boleto Bancário', icon: FileText, description: 'D+1 a D+3' },
  { id: 'apple_pay', label: 'Apple Pay', icon: Wallet, description: 'Wallet Apple' },
  { id: 'google_pay', label: 'Google Pay', icon: Wallet, description: 'Wallet Google' },
  { id: 'crypto', label: 'Cripto', icon: Coins, description: 'BTC, ETH, USDT' },
];

const COMBO_TEMPLATES = [
  { id: 'card_pix', label: 'Cartão + PIX', methods: ['credit_card', 'pix'], description: 'Mais comum em high-ticket', conversionLift: '+18%' },
  { id: 'two_cards', label: '2 Cartões', methods: ['credit_card', 'credit_card'], description: 'Cliente com limite distribuído', conversionLift: '+24%' },
  { id: 'card_boleto', label: 'Cartão + Boleto', methods: ['credit_card', 'boleto'], description: 'Empresarial / B2B', conversionLift: '+12%' },
  { id: 'two_cards_pix', label: '2 Cartões + PIX', methods: ['credit_card', 'credit_card', 'pix'], description: 'Enterprise / valores altos', conversionLift: '+31%' },
];

export default function MultiMethodCheckoutConfig() {
  const [enabledMethods, setEnabledMethods] = useState(['credit_card', 'pix', 'boleto', 'apple_pay']);
  const [allowMultiMethod, setAllowMultiMethod] = useState(true);
  const [enabledCombos, setEnabledCombos] = useState(['card_pix', 'two_cards']);
  const [minTicket, setMinTicket] = useState(500);
  const [savedAt, setSavedAt] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const toggleMethod = (id) => {
    setEnabledMethods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const toggleCombo = (id) => {
    setEnabledCombos(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavedAt(new Date().toLocaleTimeString('pt-BR'));
    setPublishing(false);
    setPublishOpen(false);
    toast.success('Configuração multi-método publicada · novos checkouts já usam essa config');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuração Multi-Método de Checkout"
        subtitle="Permita que clientes paguem combinando 2+ métodos para finalizar tickets altos"
        icon={Layers}
        breadcrumbs={[{ label: 'Checkout', page: 'CheckoutBuilder' }]}
        actions={
          <Button onClick={() => setPublishOpen(true)}>
            <Save className="w-4 h-4 mr-2" />
            Salvar configuração
          </Button>
        }
      />

      {/* Master toggle */}
      <Card className="border-l-4 border-l-[#2bc196]">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-base">Habilitar pagamento multi-método</p>
              <p className="text-xs text-slate-500">Cliente pode dividir o valor entre 2+ formas de pagamento</p>
            </div>
          </div>
          <Switch checked={allowMultiMethod} onCheckedChange={setAllowMultiMethod} />
        </CardContent>
      </Card>

      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Métodos Habilitados</TabsTrigger>
          <TabsTrigger value="combos">Combinações Permitidas</TabsTrigger>
          <TabsTrigger value="rules">Regras de Aplicação</TabsTrigger>
          <TabsTrigger value="preview">Preview do Checkout</TabsTrigger>
        </TabsList>

        <TabsContent value="methods">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PAYMENT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const enabled = enabledMethods.includes(opt.id);
              return (
                <Card key={opt.id} className={enabled ? 'border-2 border-[#2bc196]' : 'border-slate-200'}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-[#2bc196] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.description}</p>
                    </div>
                    <Switch checked={enabled} onCheckedChange={() => toggleMethod(opt.id)} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="combos">
          <div className="space-y-3">
            {COMBO_TEMPLATES.map((combo) => {
              const enabled = enabledCombos.includes(combo.id);
              return (
                <Card key={combo.id} className={enabled ? 'border-2 border-violet-300' : 'border-slate-200'}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {combo.methods.map((m, i) => {
                        const opt = PAYMENT_OPTIONS.find(o => o.id === m);
                        const Icon = opt?.icon || CreditCard;
                        return (
                          <div key={i} className="w-9 h-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 text-slate-700" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{combo.label}</p>
                        <Badge className="bg-violet-100 text-violet-700">{combo.conversionLift}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{combo.description}</p>
                    </div>
                    <Switch checked={enabled} onCheckedChange={() => toggleCombo(combo.id)} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regras de Aplicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ticket mínimo para multi-método</Label>
                  <input
                    type="number"
                    value={minTicket}
                    onChange={(e) => setMinTicket(parseFloat(e.target.value))}
                    className="w-full mt-1 h-10 border border-slate-200 rounded-lg px-3"
                  />
                  <p className="text-xs text-slate-500 mt-1">Multi-método só aparece para tickets ≥ R$ {minTicket}</p>
                </div>
                <div>
                  <Label>Máximo de métodos simultâneos</Label>
                  <select className="w-full mt-1 h-10 border border-slate-200 rounded-lg px-3">
                    <option>2 métodos</option>
                    <option>3 métodos</option>
                    <option>4 métodos</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Permitir 2 cartões</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Permitir cartão + PIX</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Permitir cartão + boleto</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Aplicar desconto PIX automaticamente</label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview · Checkout do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentSplitter totalAmount={2500} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {savedAt && (
        <div className="flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4" />
          Configuração publicada às {savedAt}
        </div>
      )}

      {/* Drawer: Publicar configuração */}
      <ConfirmActionDrawer
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publicar configuração multi-método"
        description="Os novos checkouts criados passarão a usar essa configuração"
        icon={Rocket}
        tone="success"
        confirmLabel="Publicar"
        submitting={publishing}
        onConfirm={handlePublish}
        size="md"
        checklist={[
          { label: 'Pagamento multi-método habilitado', ok: allowMultiMethod, hint: !allowMultiMethod ? 'Ative o switch master para publicar' : null },
          { label: `${enabledMethods.length} métodos habilitados`, ok: enabledMethods.length >= 2, hint: enabledMethods.length < 2 ? 'Habilite ao menos 2 métodos' : null },
          { label: `${enabledCombos.length} combos permitidos`, ok: enabledCombos.length >= 1 },
          { label: `Ticket mínimo definido (R$ ${minTicket})`, ok: minTicket > 0 },
        ]}
        infoBlock="Esta configuração se aplica aos novos checkouts. Checkouts existentes mantêm a config atual até serem editados."
      />
    </div>
  );
}