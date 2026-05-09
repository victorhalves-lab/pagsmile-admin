import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

export default function MentorSettlementBankAccountCard({ account }) {
  const validated = account.validation_status === 'validated';
  const recentChange = account.recent_changes?.length > 0;

  return (
    <Card className={recentChange ? 'border-amber-200 bg-amber-50/30' : ''}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-violet-600" /> Conta de destino
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-base font-bold text-slate-800">{account.bank_name}</p>
          <p className="text-xs text-slate-600 font-mono">
            Cód {account.bank_code} · Ag {account.agency} · CC {account.account_number} · {account.account_type === 'checking' ? 'Corrente' : 'Poupança'}
          </p>
        </div>
        <div className="text-[11px]">
          <p className="text-slate-500">Titular</p>
          <p className="font-semibold text-slate-700">{account.account_holder}</p>
          <p className="font-mono text-[10px] text-slate-500">{account.holder_document}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t">
          {validated ? (
            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5" /> Validada {new Date(account.last_validated_at).toLocaleDateString('pt-BR')}
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 text-[10px] gap-0.5">
              <AlertTriangle className="w-2.5 h-2.5" /> Validação pendente
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] gap-0.5">
            <Clock className="w-2.5 h-2.5" /> Cadastrada {new Date(account.registered_at).toLocaleDateString('pt-BR')}
          </Badge>
        </div>
        {recentChange && (
          <div className="bg-amber-100 border border-amber-300 rounded p-2 text-[11px] text-amber-900 flex items-start gap-1.5">
            <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Conta alterada recentemente</strong>
              <p>Risco antifraude · validar mudança com lojista antes da execução</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}