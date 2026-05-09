import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Bitcoin, TrendingUp, Activity } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const CRYPTO_KPIS = [
  { coin: 'BTC', symbol: '₿', txs: 142, volume: 1284000, color: 'from-orange-400 to-orange-600' },
  { coin: 'ETH', symbol: 'Ξ', txs: 312, volume: 2840000, color: 'from-blue-400 to-blue-600' },
  { coin: 'USDT', symbol: '₮', txs: 1284, volume: 4820000, color: 'from-emerald-400 to-emerald-600' },
  { coin: 'USDC', symbol: '$', txs: 412, volume: 1840000, color: 'from-cyan-400 to-cyan-600' },
];

const RECENT_TXS = [
  { id: 'cr_001', coin: 'BTC', amount: 0.0142, brlEquivalent: 8420, status: 'confirmed', confirmations: 6, address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', timestamp: '2026-05-09T14:22:00' },
  { id: 'cr_002', coin: 'ETH', amount: 0.84, brlEquivalent: 12480, status: 'confirmed', confirmations: 12, address: '0x742d35Cc6634C0532925a3b844Bc9e7595f6BAdF', timestamp: '2026-05-09T13:45:00' },
  { id: 'cr_003', coin: 'USDT', amount: 250, brlEquivalent: 1280, status: 'pending', confirmations: 1, address: 'TXJgMkVdRbRzPQTCzCgjUFrSppDUvXxYz', timestamp: '2026-05-09T13:12:00' },
  { id: 'cr_004', coin: 'USDC', amount: 1000, brlEquivalent: 5120, status: 'confirmed', confirmations: 24, address: '0x8e23ee67d1332ad560396262c48ffbb01f93d052', timestamp: '2026-05-09T12:18:00' },
];

export default function AdminIntCryptoHub() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Crypto Payments Hub"
        subtitle="Hub de pagamentos em criptomoedas · BTC/ETH/USDT/USDC com conversão automática para BRL"
        icon={Coins}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Transações' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {CRYPTO_KPIS.map((c) => (
          <Card key={c.coin}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {c.symbol}
                </div>
                <div>
                  <p className="font-bold text-base">{c.coin}</p>
                  <p className="text-xs text-slate-500">{c.txs} transações</p>
                </div>
              </div>
              <p className="text-2xl font-bold">R$ {(c.volume/1000).toFixed(0)}k</p>
              <p className="text-xs text-slate-500 mt-1">volume convertido</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Transações Recentes</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {RECENT_TXS.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Bitcoin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{tx.coin}</Badge>
                      <p className="font-bold text-sm">{tx.amount} {tx.coin}</p>
                      <span className="text-xs text-slate-500">≈ R$ {tx.brlEquivalent.toLocaleString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate">{tx.address}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={tx.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                      {tx.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendente'}
                    </Badge>
                    <span className="text-[10px] text-slate-500">{tx.confirmations} confs</span>
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