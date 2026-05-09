import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Store, ExternalLink, CheckCircle2, AlertCircle, Banknote, Users } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function MentorSplitOwnerMerchantCards({ owner, merchant, additionalMerchants = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Owner */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Owner (Lojista Mestre)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{owner.trade_name}</p>
            <p className="text-xs text-slate-500">{owner.legal_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500">CNPJ</p>
              <code className="font-mono text-[11px]">{owner.document}</code>
            </div>
            <div>
              <p className="text-slate-500">Segmento</p>
              <p className="text-slate-700 dark:text-slate-300">{owner.segment}</p>
            </div>
            <div>
              <p className="text-slate-500">Porte</p>
              <Badge variant="outline" className="text-[10px]">{owner.size}</Badge>
            </div>
            <div>
              <p className="text-slate-500">TPV total 30d</p>
              <p className="font-bold text-slate-800 dark:text-slate-100">{formatCurrency(owner.total_tpv_30d)}</p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Plano comercial</p>
            <p className="text-xs text-slate-700 dark:text-slate-300">{owner.plan}</p>
          </div>
          <button className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
            <ExternalLink className="w-3 h-3" /> Ver ficha completa do owner
          </button>
        </CardContent>
      </Card>

      {/* Merchant */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            Merchant Beneficiário Principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{merchant.trade_name}</p>
            <p className="text-xs text-slate-500">{merchant.legal_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-500">CNPJ</p>
              <code className="font-mono text-[11px]">{merchant.document}</code>
            </div>
            <div>
              <p className="text-slate-500">Relação desde</p>
              <p className="text-slate-700 dark:text-slate-300">{new Date(merchant.relationship_start).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500">Tipo de relacionamento</p>
              <p className="text-slate-700 dark:text-slate-300">{merchant.relationship_type}</p>
            </div>
            <div className="col-span-2">
              <p className="text-slate-500">Volume histórico (lifetime)</p>
              <p className="font-bold text-emerald-700">{formatCurrency(merchant.historical_volume)}</p>
            </div>
          </div>
          <div className="pt-2 border-t bg-slate-50 dark:bg-slate-800 -mx-6 px-6 py-2 mt-2">
            <p className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
              <Banknote className="w-3 h-3" /> Conta de liquidação
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {merchant.bank_account.bank} · Ag. {merchant.bank_account.agency} · CC {merchant.bank_account.account}
              </p>
              {merchant.bank_account.holder_match ? (
                <Badge className="bg-emerald-100 text-emerald-700 gap-1 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> Titular OK
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 gap-1 text-[10px]">
                  <AlertCircle className="w-3 h-3" /> Divergência
                </Badge>
              )}
            </div>
          </div>
          <button className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-2">
            <ExternalLink className="w-3 h-3" /> Ver ficha completa do merchant
          </button>
        </CardContent>
      </Card>

      {/* Multi-merchant adicional */}
      {additionalMerchants.length > 0 && (
        <Card className="lg:col-span-2 border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-600" />
              Beneficiários Adicionais ({additionalMerchants.length})
              <Badge className="bg-violet-100 text-violet-700 text-[9px]">multi-merchant</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {additionalMerchants.map((m) => (
              <div key={m.merchant_id} className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{m.trade_name}</p>
                    <code className="text-[10px] font-mono text-slate-500">{m.document}</code>
                  </div>
                  <Badge className="bg-white dark:bg-slate-900 text-violet-700">
                    {m.participation_type === 'percentage' ? `${m.participation_value}%` : `R$ ${m.participation_value}`}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{m.context}</p>
                <p className="text-[10px] text-slate-500 mt-1">Conta destino: {m.bank_account}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}