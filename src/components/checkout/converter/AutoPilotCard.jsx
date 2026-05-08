import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plane, Shield, AlertTriangle, Sparkles } from 'lucide-react';

/**
 * Modo Auto-Pilot — agente roda testes sozinho dentro de guardrails.
 * DIFERENCIAL massivo — ninguém no BR tem isso.
 */
export default function AutoPilotCard() {
  const [enabled, setEnabled] = useState(false);
  const [maxTraffic, setMaxTraffic] = useState([30]);
  const [minConv, setMinConv] = useState([10]);

  return (
    <Card className={enabled ? "border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Auto-Pilot
                <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px]">Pro</Badge>
              </CardTitle>
              <CardDescription className="text-xs">Agente roda testes sozinho dentro de guardrails que você define</CardDescription>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-5 pt-0">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-semibold">Guardrails ativos</p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs">Tráfego máx em variante</Label>
                  <span className="text-xs font-bold text-purple-600">{maxTraffic[0]}%</span>
                </div>
                <Slider value={maxTraffic} onValueChange={setMaxTraffic} min={5} max={50} step={5} />
                <p className="text-[10px] text-slate-500 mt-1">Nunca expor mais que isso a uma variante não-validada</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs">Conversão mínima de proteção</Label>
                  <span className="text-xs font-bold text-purple-600">{minConv[0]}%</span>
                </div>
                <Slider value={minConv} onValueChange={setMinConv} min={5} max={20} step={1} />
                <p className="text-[10px] text-slate-500 mt-1">Auto-rollback se conversão cair abaixo</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-[9px] uppercase tracking-wide text-slate-500">Testes ativos</p>
              <p className="text-lg font-bold text-purple-600">2</p>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-[9px] uppercase tracking-wide text-slate-500">Lift acumulado</p>
              <p className="text-lg font-bold text-emerald-600">+14.2%</p>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-[9px] uppercase tracking-wide text-slate-500">ROI mês</p>
              <p className="text-lg font-bold text-emerald-600">R$ 32k</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 dark:text-amber-300">
              Você será notificado a cada decisão automática. Pode pausar a qualquer momento.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}