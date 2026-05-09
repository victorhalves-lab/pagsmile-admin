import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Save, TrendingUp, CheckCircle2, Rocket } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import RecoveryLadderEditor from '@/components/orchestration/RecoveryLadderEditor';
import { ConfirmActionDrawer } from '@/components/common/drawers';
import { toast } from 'sonner';

export default function RecoveryLadderConfig() {
  const [savedAt, setSavedAt] = useState(null);
  const [steps, setSteps] = useState(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [aiApplying, setAiApplying] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavedAt(new Date().toLocaleTimeString('pt-BR'));
    setPublishing(false);
    setPublishOpen(false);
    toast.success('Recovery Ladder publicada com sucesso! As próximas transações usarão a nova escada.');
  };

  const handleApplyAiSuggestion = async () => {
    setAiApplying(true);
    await new Promise((r) => setTimeout(r, 600));
    setAiApplying(false);
    setAiSuggestionOpen(false);
    toast.success('Sugestão da IA aplicada à escada — revise e clique em Publicar.');
  };

  const stepsCount = steps?.length || 5;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recovery Ladder · Cross-Method Recovery"
        subtitle="Configure a escada de retentativas. Quando o método falhar, o próximo é ofertado automaticamente"
        icon={Sparkles}
        breadcrumbs={[{ label: 'Checkout', page: 'CheckoutBuilder' }, { label: 'Converter Agent' }]}
        actions={
          <Button onClick={() => setPublishOpen(true)} className="gap-2">
            <Save className="w-4 h-4" />
            Publicar
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Recovery Rate Atual</p>
            <p className="text-2xl font-bold text-emerald-600">18.4%</p>
            <p className="text-xs text-slate-500">+5.2pp vs mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Receita Recuperada</p>
            <p className="text-2xl font-bold text-[#2bc196]">R$ 612k</p>
            <p className="text-xs text-slate-500">últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Método #1 Vencedor</p>
            <p className="text-2xl font-bold">PIX 5% off</p>
            <p className="text-xs text-slate-500">48% das recuperações</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Steps Médios</p>
            <p className="text-2xl font-bold">2.3</p>
            <p className="text-xs text-slate-500">passos até converter</p>
          </CardContent>
        </Card>
      </div>

      <RecoveryLadderEditor onChange={(s) => { setSteps(s); setSavedAt(null); }} />

      <Card className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
        <CardContent className="p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-900 text-sm">💡 IA recomenda</p>
            <p className="text-xs text-emerald-700 mt-1">
              Mover <strong>PIX (5% off)</strong> para a posição #2 (após Cartão A) pode aumentar recovery em <strong>+8.4pp</strong>.
              Histórico mostra que clientes que tiveram cartão recusado convertem 41% mais em PIX com desconto que em outro cartão.
            </p>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setAiSuggestionOpen(true)}>
            Aplicar sugestão
          </Button>
        </CardContent>
      </Card>

      {savedAt && (
        <div className="flex items-center justify-end gap-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Publicado às {savedAt}
        </div>
      )}

      {/* Drawer: Publicar */}
      <ConfirmActionDrawer
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publicar Recovery Ladder"
        description="Esta escada passará a ser aplicada em todas as próximas transações com falha"
        icon={Rocket}
        tone="success"
        confirmLabel="Publicar agora"
        submitting={publishing}
        onConfirm={handlePublish}
        size="md"
        checklist={[
          { label: `${stepsCount} passos configurados`, ok: stepsCount >= 1, hint: stepsCount < 1 ? 'Adicione ao menos 1 passo antes de publicar' : null },
          { label: 'Cartão principal definido como step #1', ok: true },
          { label: 'Pelo menos 1 método alternativo pós-cartão', ok: stepsCount >= 2 },
          { label: 'Sem ciclos infinitos detectados', ok: true, hint: 'Validação automática OK' },
        ]}
        impactBefore={
          <div>
            <p className="text-xs text-slate-500">Recovery rate</p>
            <p className="text-xl font-bold">13.2%</p>
            <p className="text-[10px] text-slate-500">configuração anterior</p>
          </div>
        }
        impactAfter={
          <div>
            <p className="text-xs text-emerald-700">Recovery rate projetado</p>
            <p className="text-xl font-bold text-emerald-700">18.4%</p>
            <p className="text-[10px] text-emerald-600">+5.2pp · ~R$ 612k/mês</p>
          </div>
        }
        infoBlock="Após publicar, o efeito é imediato. Você pode reverter para a versão anterior em até 24h pelo histórico."
      />

      {/* Drawer: Aplicar sugestão IA */}
      <ConfirmActionDrawer
        open={aiSuggestionOpen}
        onOpenChange={setAiSuggestionOpen}
        title="Aplicar sugestão da IA"
        description="A IA vai reordenar a escada com base em padrões históricos de conversão"
        icon={Sparkles}
        tone="default"
        confirmLabel="Aplicar à escada"
        submitting={aiApplying}
        onConfirm={handleApplyAiSuggestion}
        size="md"
        impactBefore={
          <div className="space-y-1 text-xs">
            <p>1. Cartão A</p>
            <p>2. Cartão B</p>
            <p>3. Apple Pay</p>
            <p>4. <strong>PIX 5% off</strong></p>
            <p>5. Boleto</p>
          </div>
        }
        impactAfter={
          <div className="space-y-1 text-xs">
            <p>1. Cartão A</p>
            <p className="text-emerald-700"><strong>2. PIX 5% off ⬆</strong></p>
            <p>3. Cartão B</p>
            <p>4. Apple Pay</p>
            <p>5. Boleto</p>
          </div>
        }
        infoBlock="Mover PIX 5% off para a posição #2 prioriza o método que mais converte após cartão recusado. Você ainda precisará clicar em Publicar para que a mudança entre em produção."
      />
    </div>
  );
}