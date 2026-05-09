import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wallet, Eye, EyeOff, History, ArrowRightLeft, ShieldCheck, Clock, AlertTriangle, KeyRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Aba "Liquidação" — Mentor F0211–F0215, F0297.
 * Settlement destination com mascaramento + reveal autenticado, histórico,
 * cool-down ativo se troca foi recente, botão para abrir o fluxo formal de troca.
 */
export default function TabLiquidacao({ merchant }) {
  const [revealed, setRevealed] = useState(false);

  // Mock: dados de liquidação
  const settlement = {
    method: 'pix',
    pix_key_type: 'cnpj',
    pix_key_masked: '12.***.***/0001-**',
    pix_key_full: '12.345.678/0001-90',
    bank_name: 'Itaú Unibanco',
    bank_code: '341',
    agency: '0001',
    account_masked: '****-*',
    account_full: '12345-6',
    holder_name: 'EMPRESA EXEMPLO LTDA',
    holder_document: '12345678000190',
    same_ownership_validated: true,
    spb_dict_validated: true,
    last_change_date: '2026-05-06',
    cool_down_until: '2026-05-08T15:00:00',
  };

  const history = [
    { date: '2026-05-06 15:00', action: 'Conta alterada', from: 'Banco do Brasil 0001/9876-5', to: 'Itaú 0001/12345-6', by: 'analista@pagsmile.com', otp: true },
    { date: '2025-11-12 09:30', action: 'Conta alterada', from: 'Caixa 0001/0001-2', to: 'Banco do Brasil 0001/9876-5', by: 'analista@pagsmile.com', otp: true },
    { date: '2025-03-18 14:20', action: 'Cadastro inicial', to: 'Caixa 0001/0001-2', by: 'sistema (onboarding)', otp: false },
  ];

  const coolDownActive = new Date(settlement.cool_down_until) > new Date();

  return (
    <div className="space-y-6">
      {/* Cool-down ativo */}
      {coolDownActive && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-900">Cool-down ativo — nova alteração bloqueada até 08/05/2026 15:00</p>
            <p className="text-xs text-amber-800 mt-0.5">
              Política antifraude: troca de settlement bloqueada por 48h após última alteração. Redução de risco de tomada de conta.
            </p>
          </div>
        </div>
      )}

      {/* Conta atual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-[#2bc196]" />
              Destino de Liquidação Atual
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setRevealed(v => !v)}>
                {revealed ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {revealed ? 'Ocultar' : 'Exibir completa'}
              </Button>
              <Link to={createPageUrl(`AdminIntSettlementChangeFlow?id=${merchant?.id}`)}>
                <Button size="sm" disabled={coolDownActive}>
                  <ArrowRightLeft className="w-4 h-4 mr-1" />
                  Trocar conta
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Método" value={settlement.method.toUpperCase()} />
            <Field label="Banco" value={`${settlement.bank_code} — ${settlement.bank_name}`} />
            <Field label="Tipo de chave Pix" value={settlement.pix_key_type.toUpperCase()} />
            <Field label="Chave Pix" value={revealed ? settlement.pix_key_full : settlement.pix_key_masked} mono />
            <Field label="Agência" value={settlement.agency} />
            <Field label="Conta" value={revealed ? settlement.account_full : settlement.account_masked} mono />
            <Field label="Titular" value={settlement.holder_name} />
            <Field label="Documento titular" value={revealed ? settlement.holder_document : '••.•••.•••/****-**'} mono />
          </div>

          <div className="border-t pt-4 flex flex-wrap gap-2">
            {settlement.same_ownership_validated && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Mesma titularidade validada
              </Badge>
            )}
            {settlement.spb_dict_validated && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <KeyRound className="w-3 h-3 mr-1" />
                Cross-validation SPB/DICT OK
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="w-5 h-5 text-slate-500" />
            Histórico de Alterações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-bold text-slate-900">{h.action}</p>
                    <span className="text-xs text-slate-500">{h.date}</span>
                  </div>
                  {h.from && <p className="text-xs text-slate-600 mt-1">De: <code className="text-xs">{h.from}</code></p>}
                  <p className="text-xs text-slate-600">Para: <code className="text-xs">{h.to}</code></p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-slate-500">por <strong>{h.by}</strong></span>
                    {h.otp && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                        OTP + alçada dupla
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className={`text-sm text-slate-900 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</p>
    </div>
  );
}