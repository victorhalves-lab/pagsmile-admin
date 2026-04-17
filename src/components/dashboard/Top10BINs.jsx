import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Top10BINs({ transactions = [] }) {
  // Filter card transactions with BIN data
  const cardTx = transactions.filter(t => t.type === 'card' && t.card_last_four);
  
  // Mock BIN grouping (in real app, extract first 6 digits)
  const binGroups = {};
  
  cardTx.forEach(tx => {
    const bin = tx.card_brand + '_' + tx.card_last_four; // Mock BIN
    if (!binGroups[bin]) {
      binGroups[bin] = {
        bin: bin,
        brand: tx.card_brand,
        bank: `Banco ${tx.card_brand}`, // Mock bank name
        transactions: [],
        approved: 0,
        declined: 0
      };
    }
    binGroups[bin].transactions.push(tx);
    if (tx.status === 'approved') binGroups[bin].approved++;
    if (tx.status === 'declined') binGroups[bin].declined++;
  });

  // Calculate approval rates
  const binMetrics = Object.values(binGroups).map(group => {
    const total = group.approved + group.declined;
    const approvalRate = total > 0 ? (group.approved / total) * 100 : 0;
    const volume = group.transactions
      .filter(t => t.status === 'approved')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    return {
      ...group,
      total,
      approvalRate,
      volume
    };
  }).filter(m => m.total >= 3); // Minimum 3 transactions

  // Sort for different tabs
  const topApproval = [...binMetrics].sort((a, b) => b.approvalRate - a.approvalRate).slice(0, 10);
  const worstApproval = [...binMetrics].sort((a, b) => a.approvalRate - b.approvalRate).slice(0, 10);
  const topVolume = [...binMetrics].sort((a, b) => b.volume - a.volume).slice(0, 10);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value || 0);
  };

  const brandLabels = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    elo: 'Elo',
    amex: 'Amex',
    hipercard: 'Hipercard'
  };

  const BINRow = ({ data, showAlert = false }) => (
    <div className={cn(
      "flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors",
      showAlert && data.approvalRate < 70 && "bg-red-50 border border-red-100"
    )}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-mono text-sm font-semibold text-gray-900">****{data.bin.split('_')[1]}</p>
          <Badge variant="outline" className="text-xs capitalize">
            {brandLabels[data.brand] || data.brand}
          </Badge>
          {showAlert && data.approvalRate < 70 && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
        <p className="text-xs text-gray-500">{data.bank}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-500">Taxa</p>
          <p className={cn(
            "text-sm font-bold",
            data.approvalRate >= 85 ? 'text-emerald-600' : 
            data.approvalRate >= 75 ? 'text-yellow-600' : 'text-red-600'
          )}>
            {data.approvalRate.toFixed(1)}%
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">Qtd</p>
          <p className="text-sm font-semibold text-gray-900">{data.total}</p>
        </div>
        
        <div className="text-right min-w-[80px]">
          <p className="text-xs text-gray-500">Volume</p>
          <p className="text-sm font-semibold text-gray-900">{formatCurrency(data.volume)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Análise de BINs</h3>
      
      <Tabs defaultValue="top" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="top">Maior Aprovação</TabsTrigger>
          <TabsTrigger value="worst">
            Menor Aprovação
            {worstApproval.filter(b => b.approvalRate < 70).length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {worstApproval.filter(b => b.approvalRate < 70).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="volume">Maior Volume</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="space-y-2">
          {topApproval.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Dados insuficientes</p>
          ) : (
            topApproval.map((bin, idx) => (
              <div key={bin.bin} className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                  idx === 0 ? "bg-yellow-100 text-yellow-700" :
                  idx === 1 ? "bg-gray-100 text-gray-700" :
                  idx === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-500"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <BINRow data={bin} />
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="worst" className="space-y-2">
          {worstApproval.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Dados insuficientes</p>
          ) : (
            <>
              {worstApproval.filter(b => b.approvalRate < 70).length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-xs text-yellow-800">
                    ⚠️ BINs com aprovação crítica detectados. O DIA recomenda análise detalhada.
                  </p>
                </div>
              )}
              {worstApproval.map((bin, idx) => (
                <div key={bin.bin} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-50 text-xs font-bold text-gray-500">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <BINRow data={bin} showAlert />
                  </div>
                </div>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="volume" className="space-y-2">
          {topVolume.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Dados insuficientes</p>
          ) : (
            topVolume.map((bin, idx) => (
              <div key={bin.bin} className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                  idx === 0 ? "bg-blue-100 text-blue-700" : "bg-gray-50 text-gray-500"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <BINRow data={bin} />
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Recovery Opportunity - placeholder */}
    </div>
  );
}