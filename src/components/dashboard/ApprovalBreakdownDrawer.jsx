import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Clock, Globe, Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Drawer de drill-down da Taxa de Aprovação por dimensão.
 * Padrão Adyen (referência absoluta) / Stripe.
 *
 * Decompõe aprovação por: bandeira / adquirente / BIN / horário.
 */
export default function ApprovalBreakdownDrawer({ open, onOpenChange, currentRate = 87.4, target = 87.5 }) {
  const byBrand = [
    { name: 'Visa',       rate: 91.2, volume: 1250, share: 45.2 },
    { name: 'Mastercard', rate: 88.5, volume: 980,  share: 35.4 },
    { name: 'Elo',        rate: 79.3, volume: 320,  share: 11.6 },
    { name: 'Amex',       rate: 76.1, volume: 215,  share: 7.8 },
  ];

  const byAcquirer = [
    { name: 'Stone',  rate: 92.4, volume: 1120 },
    { name: 'Cielo',  rate: 88.1, volume: 845  },
    { name: 'Rede',   rate: 86.7, volume: 612  },
    { name: 'Getnet', rate: 79.3, volume: 188  },
  ];

  const byHour = [
    { hour: '00-06h', rate: 81.2 }, { hour: '06-09h', rate: 86.4 },
    { hour: '09-12h', rate: 89.7 }, { hour: '12-15h', rate: 91.2 },
    { hour: '15-18h', rate: 88.9 }, { hour: '18-21h', rate: 86.5 },
    { hour: '21-24h', rate: 82.1 },
  ];

  const byBIN = [
    { bin: '411111', issuer: 'Itaú',     rate: 94.2, volume: 380 },
    { bin: '516259', issuer: 'Bradesco', rate: 89.7, volume: 312 },
    { bin: '548132', issuer: 'Nubank',   rate: 92.8, volume: 580 },
    { bin: '422345', issuer: 'Santander', rate: 78.4, volume: 245 },
    { bin: '551234', issuer: 'Banco BV', rate: 65.1, volume: 87  },
  ];

  const renderBar = (rate) => (
    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-1 max-w-[140px]">
      <div
        className={cn(
          'h-full rounded-full',
          rate >= target ? 'bg-emerald-500' : rate >= target - 5 ? 'bg-amber-500' : 'bg-red-500'
        )}
        style={{ width: `${rate}%` }}
      />
    </div>
  );

  const RateRow = ({ label, sub, rate, extra }) => (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-32 flex-shrink-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{label}</p>
        {sub && <p className="text-[10px] text-slate-500">{sub}</p>}
      </div>
      <div className="flex-1 flex items-center gap-3">
        {renderBar(rate)}
        <span
          className={cn(
            'text-sm font-bold w-14',
            rate >= target ? 'text-emerald-600' : rate >= target - 5 ? 'text-amber-600' : 'text-red-600'
          )}
        >
          {rate.toFixed(1)}%
        </span>
      </div>
      {extra && <span className="text-[11px] text-slate-500 w-20 text-right">{extra}</span>}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#2bc196]" />
            <SheetTitle>Taxa de Aprovação — Drill-down</SheetTitle>
          </div>
          <SheetDescription>Decomposição da taxa por dimensão. Identifique o gargalo.</SheetDescription>
        </SheetHeader>

        {/* Headline */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-200 dark:border-emerald-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Taxa Atual
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{currentRate.toFixed(1)}%</p>
                <span className="text-xs text-slate-500">meta {target}%</span>
              </div>
            </div>
            {currentRate < target && (
              <Badge className="bg-amber-100 text-amber-700 border-0 gap-1">
                <AlertTriangle className="w-3 h-3" />
                {(target - currentRate).toFixed(1)}pp abaixo da meta
              </Badge>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="brand" className="mt-5">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="brand"    className="gap-1 text-xs"><CreditCard className="w-3 h-3" />Bandeira</TabsTrigger>
            <TabsTrigger value="acquirer" className="gap-1 text-xs"><Building2 className="w-3 h-3"  />Adquirente</TabsTrigger>
            <TabsTrigger value="bin"      className="gap-1 text-xs"><Globe className="w-3 h-3"       />Issuer</TabsTrigger>
            <TabsTrigger value="hour"     className="gap-1 text-xs"><Clock className="w-3 h-3"       />Horário</TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="mt-3">
            {byBrand.map((b) => (
              <RateRow key={b.name} label={b.name} sub={`${b.share}% do volume`} rate={b.rate} extra={`${b.volume} tx`} />
            ))}
          </TabsContent>

          <TabsContent value="acquirer" className="mt-3">
            {byAcquirer.map((a) => (
              <RateRow key={a.name} label={a.name} rate={a.rate} extra={`${a.volume} tx`} />
            ))}
          </TabsContent>

          <TabsContent value="bin" className="mt-3">
            {byBIN.map((b) => (
              <RateRow key={b.bin} label={b.issuer} sub={`BIN ${b.bin}`} rate={b.rate} extra={`${b.volume} tx`} />
            ))}
          </TabsContent>

          <TabsContent value="hour" className="mt-3">
            {byHour.map((h) => (
              <RateRow key={h.hour} label={h.hour} rate={h.rate} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Insight */}
        <div className="mt-5 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900">
          <p className="text-[11px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider mb-1">
            Insight
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold">Banco BV (BIN 551234)</span> tem aprovação de apenas 65.1%.
            Investigar regra de antifraude ou contatar o emissor.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}