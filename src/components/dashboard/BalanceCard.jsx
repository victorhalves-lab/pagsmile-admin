import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Clock, 
  Lock, 
  ArrowUpRight,
  DollarSign,
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
    if (!showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const total = available + pending + blocked;

  return (
    <div className={cn(
      "bg-gradient-to-br from-[#002443] to-[#003459] rounded-xl p-6 text-white",
      className
    )}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/60 text-sm mb-1">Saldo Total</p>
          <p className="text-3xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10"
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#2bc196]" />
            <span className="text-xs text-white/60">Disponível</span>
          </div>
          <p className="font-semibold">{formatCurrency(available)}</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/60">A receber</span>
          </div>
          <p className="font-semibold">{formatCurrency(pending)}</p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-xs text-white/60">Bloqueado</span>
          </div>
          <p className="font-semibold">{formatCurrency(blocked)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-[#2bc196] hover:bg-[#239b7a] text-white">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Solicitar Saque
        </Button>
        <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
          Ver Extrato
        </Button>
      </div>
    </div>
  );
}