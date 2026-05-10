import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingCart, CreditCard, FileCheck, Phone } from 'lucide-react';

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function TelemarketingSummaryPanel({ sale, currentStep }) {
  const { customer, items, payments, total } = sale;
  const paid = (payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const remaining = total - paid;

  return (
    <Card className="sticky top-4 shadow-md">
      <CardHeader className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-t-xl">
        <CardTitle className="text-sm flex items-center gap-2">
          <Phone className="w-4 h-4" /> Resumo da Venda
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 text-sm">
        {/* Cliente */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase text-slate-500 font-bold mb-1">
            <User className="w-3 h-3" /> Cliente
          </div>
          {customer?.name ? (
            <div>
              <div className="font-semibold text-slate-800">{customer.name}</div>
              <div className="text-xs text-slate-500">{customer.document || '—'}</div>
              <div className="text-xs text-slate-500">{customer.phone || '—'}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">Aguardando identificação…</div>
          )}
        </div>

        {/* Itens */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase text-slate-500 font-bold mb-1">
            <ShoppingCart className="w-3 h-3" /> Itens ({items?.length || 0})
          </div>
          {items?.length > 0 ? (
            <div className="space-y-1">
              {items.map((it, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="truncate flex-1">{it.qty}x {it.name}</span>
                  <span className="font-mono">{formatBRL(it.qty * it.unit_price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">Nenhum item</div>
          )}
        </div>

        {/* Pagamentos */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] uppercase text-slate-500 font-bold mb-1">
            <CreditCard className="w-3 h-3" /> Pagamentos
          </div>
          {payments?.length > 0 ? (
            <div className="space-y-1">
              {payments.map((p, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{p.method === 'pix' ? 'PIX' : `Cartão ${p.last4 ? `••${p.last4}` : ''}`} {p.installments > 1 ? `(${p.installments}x)` : ''}</span>
                  <span className="font-mono">{formatBRL(p.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">A definir</div>
          )}
        </div>

        {/* Totais */}
        <div className="border-t pt-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-mono">{formatBRL(total)}</span>
          </div>
          {payments?.length > 0 && (
            <>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Pago</span>
                <span className="font-mono text-emerald-700">{formatBRL(paid)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Falta</span>
                <span className={`font-mono ${remaining > 0.01 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {formatBRL(remaining)}
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between text-base font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-[#2bc196]">{formatBRL(total)}</span>
          </div>
        </div>

        <Badge variant="outline" className="w-full justify-center bg-amber-50 border-amber-200 text-amber-800">
          <FileCheck className="w-3 h-3 mr-1" /> Transação MOTO
        </Badge>
      </CardContent>
    </Card>
  );
}