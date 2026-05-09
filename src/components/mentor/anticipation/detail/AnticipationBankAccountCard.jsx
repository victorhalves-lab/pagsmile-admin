import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Banknote, CheckCircle2, AlertTriangle, History } from 'lucide-react';

export default function AnticipationBankAccountCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Banknote className="w-5 h-5 text-violet-600" />
          Conta Bancária de Destino
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500">Banco</p>
            <p className="font-semibold">{data.bank}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Agência / Conta</p>
            <p className="font-mono font-semibold">1234 / 56789-0</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tipo</p>
            <p className="font-semibold">Corrente</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Titular</p>
            <p className="font-semibold text-xs">{data.merchant.name}</p>
            <p className="text-[10px] text-slate-400">{data.merchant.cnpj}</p>
          </div>
        </div>

        <div className="border-t pt-3 flex items-center justify-between">
          <Badge className="bg-green-100 text-green-700 gap-1">
            <CheckCircle2 className="w-3 h-3" /> Validada em 02/05/2026
          </Badge>
          <span className="text-xs text-slate-400">Cadastro: 15/03/2025</span>
        </div>

        {/* F3399 — alerta de mudança recente */}
        <div className="border rounded-lg p-2 bg-amber-50 flex items-center gap-2 text-xs">
          <History className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Última alteração há 47 dias — fora da janela de risco</span>
        </div>
      </CardContent>
    </Card>
  );
}