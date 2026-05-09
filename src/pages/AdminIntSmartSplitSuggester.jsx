import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, TrendingDown, Users, Check, X, Brain } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PreviewBanner from '@/components/common/PreviewBanner';
import { mockSmartSplitSuggestions } from '@/components/orchestration/mockData';

export default function AdminIntSmartSplitSuggester() {
  const [applied, setApplied] = useState([]);
  const [rejected, setRejected] = useState([]);

  const apply = (id) => setApplied([...applied, id]);
  const reject = (id) => setRejected([...rejected, id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Split Suggester"
        subtitle="IA recomenda ajustes de split para maximizar receita PagSmile e retenção de sub-lojistas"
        icon={Brain}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Marketplace' }]}
      />

      <PreviewBanner message="A Tuna entrega split por transação (§5) e ajustes via Partner API (§18). 'Smart Suggester' baseado em IA é construção PagSmile sobre esses dados, não um endpoint Tuna. Sugestões mostradas são derivadas de heurística interna." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Sugestões Ativas</p>
            <p className="text-3xl font-bold text-violet-600">{mockSmartSplitSuggestions.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Lift Total Projetado</p>
            <p className="text-3xl font-bold text-emerald-600">
              R$ {mockSmartSplitSuggestions.reduce((s, x) => s + Math.max(0, x.expectedRevenueLift), 0).toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Confiança Média</p>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(mockSmartSplitSuggestions.reduce((s, x) => s + x.confidence, 0) / mockSmartSplitSuggestions.length * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {mockSmartSplitSuggestions.map((sgst) => {
          const isApplied = applied.includes(sgst.id);
          const isRejected = rejected.includes(sgst.id);
          const isPositive = sgst.expectedRevenueLift > 0;

          return (
            <Card key={sgst.id} className={isApplied ? 'border-2 border-emerald-300 bg-emerald-50/30' : isRejected ? 'opacity-50' : ''}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-md flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-base">{sgst.merchantName}</p>
                      <Badge className="bg-blue-100 text-blue-700 text-[10px]">
                        {Math.round(sgst.confidence * 100)}% confiança
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{sgst.reason}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Atual</p>
                        <p className="text-sm font-mono">
                          Master: <strong>{sgst.currentSplits.master}%</strong> · Sub: <strong>{sgst.currentSplits.sublojistas}%</strong>
                        </p>
                      </div>
                      <div className="rounded-lg bg-violet-50 p-3 border border-violet-200">
                        <p className="text-[10px] text-violet-600 uppercase mb-1">Sugerido</p>
                        <p className="text-sm font-mono text-violet-900">
                          Master: <strong>{sgst.suggested.master}%</strong> · Sub: <strong>{sgst.suggested.sublojistas}%</strong>
                        </p>
                      </div>
                      <div className={`rounded-lg p-3 border ${isPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                        <p className="text-[10px] uppercase mb-1 flex items-center gap-1">
                          {isPositive ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-amber-600" />}
                          <span className={isPositive ? 'text-emerald-600' : 'text-amber-600'}>
                            {isPositive ? 'Receita +' : 'Receita −'}
                          </span>
                        </p>
                        <p className={`text-sm font-bold ${isPositive ? 'text-emerald-700' : 'text-amber-700'}`}>
                          R$ {Math.abs(sgst.expectedRevenueLift).toLocaleString('pt-BR')}
                        </p>
                        {sgst.expectedRetention && (
                          <p className="text-[10px] text-emerald-600">+{sgst.expectedRetention}pp retenção</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {isApplied ? (
                      <Badge className="bg-emerald-500 text-white">
                        <Check className="w-3 h-3 mr-1" />
                        Aplicada
                      </Badge>
                    ) : isRejected ? (
                      <Badge variant="secondary">
                        <X className="w-3 h-3 mr-1" />
                        Rejeitada
                      </Badge>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => apply(sgst.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          <Check className="w-3 h-3 mr-1" />
                          Aplicar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => reject(sgst.id)}>
                          <X className="w-3 h-3 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}