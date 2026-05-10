import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ExternalLink, CheckCircle2, Trash2, ArrowUpCircle, Clock, FileText, History as HistoryIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHECKUP_TYPES, CHECKUP_SEVERITIES, CHECKUP_STATUS, CHECKUP_RECOMMENDATIONS } from './mocks/checkupMock';

function DiffView({ internal, external }) {
  const fields = ['status', 'captured', 'amount'];
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <div className="text-xs uppercase tracking-wide font-bold text-blue-700 dark:text-blue-400 mb-2">Estado Interno (PagSmile)</div>
        <pre className="text-xs font-mono">{JSON.stringify(internal, null, 2)}</pre>
      </Card>
      <Card className="p-3 bg-orange-50 dark:bg-orange-900/20 border-orange-200">
        <div className="text-xs uppercase tracking-wide font-bold text-orange-700 dark:text-orange-400 mb-2">Estado Externo (Adquirente)</div>
        <pre className="text-xs font-mono">{JSON.stringify(external, null, 2)}</pre>
      </Card>
      <div className="col-span-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-lg">
        <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Divergências detectadas:</div>
        <ul className="text-xs space-y-0.5">
          {fields.filter(f => internal[f] !== external[f]).map(f => (
            <li key={f} className="font-mono">• <strong>{f}</strong>: <span className="text-blue-600">{String(internal[f])}</span> → <span className="text-orange-600">{String(external[f])}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CheckupDetailDrawer({ checkup, open, onOpenChange }) {
  if (!checkup) return null;
  
  const typeCfg = CHECKUP_TYPES[checkup.type];
  const sevCfg = CHECKUP_SEVERITIES[checkup.severity];
  const stCfg = CHECKUP_STATUS[checkup.status];
  const recCfg = CHECKUP_RECOMMENDATIONS[checkup.recommendation];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Diagnóstico {checkup.id}</SheetTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={typeCfg.color}>{typeCfg.label}</Badge>
            <Badge className={sevCfg.color}>{sevCfg.label}</Badge>
            <Badge className={stCfg.color} variant="secondary">{stCfg.label}</Badge>
            {checkup.tags.includes('regulatorio') && <Badge variant="outline">🏛️ Regulatório</Badge>}
            {checkup.tags.includes('pld_ft') && <Badge variant="outline">🚨 PLD-FT</Badge>}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{typeCfg.description}</p>
        </SheetHeader>

        {/* Recomendação IA */}
        <Card className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
          <div className="text-xs uppercase tracking-wide font-bold text-purple-700 dark:text-purple-400 mb-1">✨ Recomendação Mentor IA</div>
          <div className={`text-base font-bold ${recCfg.color}`}>{recCfg.label}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Confiança da detecção: <span className="font-semibold">{checkup.confidence === 'high' ? 'Alta ✓' : checkup.confidence === 'medium' ? 'Média ~' : 'Baixa ⚠'}</span>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link to={`/AdminIntCheckupAuthorizeFlow?ids=${checkup.id}`}>
            <Button className="w-full gap-1 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Autorizar
            </Button>
          </Link>
          <Link to={`/AdminIntCheckupSoftDeleteFlow?ids=${checkup.id}`}>
            <Button variant="destructive" className="w-full gap-1">
              <Trash2 className="w-4 h-4" /> Soft Delete
            </Button>
          </Link>
          <Button variant="outline" className="gap-1">
            <ArrowUpCircle className="w-4 h-4" /> Escalar Sênior
          </Button>
          <Button variant="outline" className="gap-1">
            <Clock className="w-4 h-4" /> Aguardar Auto
          </Button>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="diff">Diff Estado</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="audit">Trilha</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-3">
            <Card className="p-3">
              <h4 className="font-semibold mb-2 text-sm">Transação Afetada</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">ID:</span> <Link to={`/AdminIntTransactionDetail?id=${checkup.transaction_id}`} className="text-cyan-600 hover:underline">{checkup.transaction_id} <ExternalLink className="w-3 h-3 inline" /></Link></div>
                <div><span className="text-slate-500">NSU:</span> <code>{checkup.nsu}</code></div>
                <div><span className="text-slate-500">Auth Code:</span> <code>{checkup.auth_code}</code></div>
                <div><span className="text-slate-500">Bandeira:</span> {checkup.brand}</div>
                <div><span className="text-slate-500">Adquirente:</span> {checkup.acquirer}</div>
                <div><span className="text-slate-500">Captura:</span> {checkup.capture_method}</div>
                <div><span className="text-slate-500">Parcelas:</span> {checkup.installments}x</div>
                <div><span className="text-slate-500">Valor:</span> <strong>R$ {checkup.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></div>
              </div>
            </Card>
            <Card className="p-3">
              <h4 className="font-semibold mb-2 text-sm">Lojista Beneficiário</h4>
              <div className="text-sm font-semibold">{checkup.merchant.name}</div>
              <div className="text-xs text-slate-500">{checkup.merchant.cnpj}</div>
            </Card>
            <Card className="p-3">
              <h4 className="font-semibold mb-2 text-sm">SLA & Atribuição</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">SLA configurado:</span> {checkup.sla_hours}h</div>
                <div><span className="text-slate-500">Aberto há:</span> <span className={checkup.sla_breached ? 'text-red-600 font-bold' : ''}>{checkup.hours_open}h</span></div>
                <div><span className="text-slate-500">Tentativas:</span> {checkup.attempts}</div>
                <div><span className="text-slate-500">Atribuído:</span> {checkup.assigned_to?.name || '-'}</div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="diff" className="mt-3">
            <DiffView internal={checkup.internal_state} external={checkup.external_state} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-3">
            <div className="space-y-2 text-xs">
              {[
                { time: checkup.detected_at, label: 'Detecção automática', icon: '🔍' },
                { time: checkup.transaction_date, label: 'Transação original criada', icon: '💳' },
              ].map((evt, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span>{evt.icon}</span>
                  <div>
                    <div className="font-medium">{evt.label}</div>
                    <div className="text-slate-500">{new Date(evt.time).toLocaleString('pt-BR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="mt-3">
            <Card className="p-3 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2 mb-2">
                <HistoryIcon className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold">Trilha Auditável Completa</span>
              </div>
              <Link to={`/AdminIntHistoryHub?context=transactions&entity_id=${checkup.transaction_id}`}>
                <Button variant="outline" size="sm" className="gap-1 w-full">
                  <FileText className="w-4 h-4" /> Abrir no Hub Universal de Auditoria
                </Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}