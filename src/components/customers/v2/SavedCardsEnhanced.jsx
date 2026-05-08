import React from 'react';
import { CreditCard, Star, RefreshCw, Trash2, AlertTriangle, CheckCircle2, History, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function CardItem({ card, isDefault, onRequestNew }) {
  const getExpiryStatus = () => {
    if (!card.expiry) return { status: 'unknown', label: '', color: '' };
    const [m, y] = card.expiry.split('/');
    if (!m || !y) return { status: 'unknown', label: '', color: '' };
    const expDate = new Date(`20${y}`, parseInt(m), 0);
    const days = Math.floor((expDate - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { status: 'expired', label: 'Expirado!', color: 'bg-red-100 text-red-700' };
    if (days < 30) return { status: 'critical', label: `Expira em ${days}d`, color: 'bg-red-100 text-red-700' };
    if (days < 60) return { status: 'warning', label: `Expira em ${days}d`, color: 'bg-yellow-100 text-yellow-700' };
    return { status: 'ok', label: 'OK', color: 'bg-emerald-100 text-emerald-700' };
  };
  const expStatus = getExpiryStatus();

  return (
    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-12 h-9 rounded-md flex items-center justify-center text-white text-[10px] font-bold',
          card.brand?.toLowerCase() === 'visa' ? 'bg-blue-600' :
          card.brand?.toLowerCase() === 'mastercard' ? 'bg-orange-500' :
          card.brand?.toLowerCase() === 'amex' ? 'bg-emerald-700' : 'bg-slate-700'
        )}>
          {card.brand?.toUpperCase().slice(0, 4) || 'CARD'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium font-mono text-sm">•••• •••• •••• {card.last_four}</p>
            {isDefault && (
              <Badge className="bg-yellow-100 text-yellow-700 border-0 text-[10px] gap-1">
                <Star className="w-2.5 h-2.5 fill-current" /> Preferencial
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{card.brand} · Expira {card.expiry}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {expStatus.label && (
              <Badge className={cn('border-0 text-[10px] gap-1', expStatus.color)}>
                {expStatus.status === 'expired' || expStatus.status === 'critical' ? 
                  <AlertTriangle className="w-2.5 h-2.5" /> : 
                  expStatus.status === 'warning' ? <AlertTriangle className="w-2.5 h-2.5" /> : 
                  <CheckCircle2 className="w-2.5 h-2.5" />}
                {expStatus.label}
              </Badge>
            )}
            <Badge className="bg-emerald-50 text-emerald-700 border-0 text-[10px] gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              VAU ativo
            </Badge>
            <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px]">
              3DS: 12/12 ✓
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {(expStatus.status === 'critical' || expStatus.status === 'warning') && (
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => toast.success('Account Updater acionado')}>
            <RefreshCw className="w-3 h-3" />
            Atualizar
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.success('Marcado como preferencial')}>
              <Star className="w-4 h-4 mr-2" /> Marcar como preferencial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success('Account Updater acionado')}>
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar (Account Updater)
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="w-4 h-4 mr-2" /> Ver histórico de uso
            </DropdownMenuItem>
            <DropdownMenuItem className="text-orange-600">
              <Ban className="w-4 h-4 mr-2" /> Bloquear este cartão
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function SavedCardsEnhanced({ customer, onRequestNew }) {
  const cards = customer?.saved_cards || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Cartões Tokenizados</CardTitle>
          <p className="text-xs text-slate-500 mt-1">{cards.length} cartão(ões) · VAU/ABU integrados</p>
        </div>
        <Button size="sm" onClick={onRequestNew} className="bg-[#2bc196] hover:bg-[#239b7a]">
          <Plus className="w-4 h-4 mr-2" />
          Solicitar Cartão
        </Button>
      </CardHeader>
      <CardContent>
        {cards.length > 0 ? (
          <div className="space-y-2">
            {cards.map((card, idx) => (
              <CardItem key={idx} card={card} isDefault={idx === 0} onRequestNew={onRequestNew} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-2">Nenhum cartão salvo</p>
            <p className="text-xs text-slate-400 mb-4">Cliente com cartão tokenizado tem ~30% mais retenção</p>
            <Button variant="outline" onClick={onRequestNew}>
              Solicitar Cadastro de Cartão
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}