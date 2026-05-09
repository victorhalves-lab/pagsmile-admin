import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Save, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import RecoveryLadderEditor from '@/components/orchestration/RecoveryLadderEditor';

export default function RecoveryLadderConfig() {
  const [savedAt, setSavedAt] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recovery Ladder · Cross-Method Recovery"
        subtitle="Configure a escada de retentativas. Quando o método falhar, o próximo é ofertado automaticamente"
        icon={Sparkles}
        breadcrumbs={[{ label: 'Checkout', page: 'CheckoutBuilder' }, { label: 'Converter Agent' }]}
        actions={
          <Button onClick={() => setSavedAt(new Date().toLocaleTimeString('pt-BR'))}>
            <Save className="w-4 h-4 mr-2" />
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

      <RecoveryLadderEditor onChange={() => setSavedAt(null)} />

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
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Aplicar sugestão
          </Button>
        </CardContent>
      </Card>

      {savedAt && (
        <div className="text-xs text-emerald-700 text-right">Salvo às {savedAt}</div>
      )}
    </div>
  );
}