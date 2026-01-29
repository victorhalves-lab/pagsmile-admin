import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Clock, 
  Lock, 
  ArrowUpRight,
  Eye,
  EyeOff
} from 'lucide-react';

export default function BalanceCard({ 
  available = 0, 
  pending = 0, 
  blocked = 0,
  loading = false,
  className 
}) {
  const [showValues, setShowValues] = React.useState(true);

  const formatCurrency = (value) => {
    if (!showValues) return '•••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const total = available + pending + blocked;

  return (
    <div className={cn(
      "bg-gradient-to-br from-[#002443] to-[#003459] rounded-xl p-5 text-white h-full flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/60 text-sm">Saldo Total</p>
        <button
          className="text-white/60 hover:text-white transition-colors p-1"
          onClick={() => setShowValues(!showValues)}
        >
          {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Total Value */}
      <p className="text-2xl md:text-3xl font-bold mb-4 truncate">{formatCurrency(total)}</p>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
        <div className="bg-white/10 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="w-3.5 h-3.5 text-[#2bc196]" />
            <span className="text-[10px] text-white/60">Disponível</span>
          </div>
          <p className="text-sm font-semibold truncate">{formatCurrency(available)}</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] text-white/60">A receber</span>
          </div>
          <p className="text-sm font-semibold truncate">{formatCurrency(pending)}</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[10px] text-white/60">Bloqueado</span>
          </div>
          <p className="text-sm font-semibold truncate">{formatCurrency(blocked)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" className="flex-1 bg-[#2bc196] hover:bg-[#239b7a] text-white text-xs h-9">
          <ArrowUpRight className="w-3.5 h-3.5 mr-1.5" />
          Solicitar Saque
        </Button>
        <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 text-xs h-9">
          Ver Extrato
        </Button>
      </div>
    </div>
  );
}