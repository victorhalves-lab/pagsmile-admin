import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, AlertTriangle, CheckCircle2, Plus, Activity } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockShadowTests } from '@/components/orchestration/mockData';

export default function AdminIntShadowMode() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Shadow Mode Testing"
        subtitle="Execute novas regras/adquirentes em paralelo (sem efeito real) para validar antes de produção"
        icon={EyeOff}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Orchestration' }]}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo shadow test
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 text-sm">Como funciona Shadow Mode</p>
            <p className="text-xs text-blue-700 mt-1">
              Em shadow mode, a regra/adquirente recebe uma <strong>cópia</strong> da requisição mas a resposta é descartada. 
              Comparamos divergências entre prod e shadow para detectar bugs antes de promover.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {mockShadowTests.map((test) => {
          const okDivergence = test.divergenceRate < 0.05;
          const okErrors = test.errorsShadow / test.requestsShadow < 0.02;
          const isHealthy = okDivergence && okErrors;

          return (
            <Card key={test.id} className={isHealthy ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-base">{test.name}</p>
                      <Badge className={test.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                        {test.status}
                      </Badge>
                      {isHealthy ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Saudável
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Atenção
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Ver divergências</Button>
                    {isHealthy && test.status === 'running' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Promover para prod</Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Requests Shadow</p>
                    <p className="text-xl font-bold">{test.requestsShadow.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Erros Shadow</p>
                    <p className={`text-xl font-bold ${okErrors ? 'text-emerald-600' : 'text-red-600'}`}>{test.errorsShadow}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Δ Latência</p>
                    <p className={`text-xl font-bold ${test.latencyDeltaMs <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {test.latencyDeltaMs > 0 ? '+' : ''}{test.latencyDeltaMs}ms
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Taxa Divergência</p>
                    <p className={`text-xl font-bold ${okDivergence ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {(test.divergenceRate * 100).toFixed(2)}%
                    </p>
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