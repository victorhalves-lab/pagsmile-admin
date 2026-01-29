import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Clock, 
  Lock, 
  ArrowUpRight,
  Eye,
  EyeOff,
  FileText
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
    if (!showValues) return '•••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const total = available + pending + blocked;

  const balanceItems = [
    { label: 'Disponível', value: available, icon: Wallet, color: 'text-[#2bc196]', bgColor: 'bg-[#2bc196]/10' },
    { label: 'A receber', value: pending, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    { label: 'Bloqueado', value: blocked, icon: Lock, color: 'text-red-400', bgColor: 'bg-red-400/10' },
  ];

  return (
    <div className={cn(
      "bg-gradient-to-r from-[#002443] via-[#003459] to-[#002443] rounded-2xl p-6 text-white",
      className
    )}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Total Balance */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-[#2bc196]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white/60 text-sm">Saldo Total</p>
              <button
                className="text-white/40 hover:text-white transition-colors"
                onClick={() => setShowValues(!showValues)}
              >
                {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight">{formatCurrency(total)}</p>
          </div>
        </div>

        {/* Center: Balance Breakdown */}
        <div className="flex items-center gap-3 lg:gap-6 flex-wrap lg:flex-nowrap">
          {balanceItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="flex items-center gap-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", item.bgColor)}>
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wide">{item.label}</p>
                  <p className="text-base font-semibold">{formatCurrency(item.value)}</p>
                </div>
              </div>
              {index < balanceItems.length - 1 && (
                <div className="hidden lg:block w-px h-10 bg-white/10" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2 lg:flex-shrink-0">
          <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a] text-white font-medium h-10 px-4">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Solicitar Saque
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-medium h-10 px-4">
            <FileText className="w-4 h-4 mr-2" />
            Ver Extrato
          </Button>
        </div>
      </div>
    </div>
  );
}