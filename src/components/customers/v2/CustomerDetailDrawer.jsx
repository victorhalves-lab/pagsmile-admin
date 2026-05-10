import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ChevronLeft, ChevronRight, ExternalLink, Mail, Phone, MapPin,
  ShoppingBag, CreditCard, TrendingUp, AlertTriangle, Tag, Crown, UserPlus, Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const segmentConfig = {
  new: { label: 'Novo', color: 'bg-blue-100 text-blue-700', icon: UserPlus },
  recurring: { label: 'Recorrente', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
  vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700', icon: Crown },
  at_risk: { label: 'Em Risco', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
  inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-700', icon: Clock },
};

/**
 * Drawer compacto de cliente. Para perfil 360° completo, abre página dedicada.
 */
export default function CustomerDetailDrawer({ customer, allRows = [], open, onClose, onNavigate }) {
  if (!customer) return null;

  const idx = allRows.findIndex(r => r.id === customer.id);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < allRows.length - 1;

  const seg = segmentConfig[customer.segment] || segmentConfig.new;
  const SegIcon = seg.icon;
  const initials = (customer.name || 'CL').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const riskScore = customer.risk_score || 0;
  const riskColor = riskScore < 30 ? 'text-emerald-600' : riskScore < 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <SideDrawer
      open={open}
      onOpenChange={(v) => !v && onClose?.()}
      title={customer.name || 'Cliente'}
      description={customer.email || '—'}
      icon={SegIcon}
      iconClassName={seg.color.replace('text-', 'text-').replace('bg-', 'bg-').split(' ')[0]}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!hasPrev}
              onClick={() => hasPrev && onNavigate?.(allRows[idx - 1])}
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-500">{idx + 1} de {allRows.length}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!hasNext}
              onClick={() => hasNext && onNavigate?.(allRows[idx + 1])}
              title="Próxima"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success('Email enviado')}>
              <Mail className="w-3.5 h-3.5 mr-1" /> E-mail
            </Button>
            <Button asChild size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Link to={createPageUrl(`CustomerDetail?id=${customer.id}`)}>
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Perfil 360°
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Identificação */}
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-[#101F3E] text-white font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn('font-medium gap-1 text-[10px]', seg.color)}>
                <SegIcon className="w-3 h-3" /> {seg.label}
              </Badge>
              {customer.is_blocked && (
                <Badge variant="destructive" className="text-[10px]">Bloqueado</Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 font-mono">{customer.document || '—'}</p>
            <p className="text-xs text-slate-500 uppercase">{customer.document_type || 'CPF'}</p>
          </div>
        </div>

        {/* KPIs principais */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-emerald-700">LTV</p>
            <p className="text-lg font-bold text-emerald-900">{formatCurrency(customer.total_spent)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-blue-700">Compras</p>
            <p className="text-lg font-bold text-blue-900">{customer.total_purchases || 0}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-slate-600">Risk Score</p>
            <p className={cn('text-lg font-bold', riskColor)}>{riskScore}</p>
          </div>
        </div>

        {/* Contato */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Contato</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{customer.email || '—'}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.phone}</span>
              </div>
            )}
            {(customer.city || customer.state) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{[customer.city, customer.state].filter(Boolean).join(' / ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Última compra */}
        {customer.last_purchase_date && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Última compra</p>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>{format(new Date(customer.last_purchase_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
            </div>
          </div>
        )}

        {/* Cartões salvos */}
        {customer.saved_cards?.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Cartões salvos ({customer.saved_cards.length})
            </p>
            <div className="space-y-1.5">
              {customer.saved_cards.slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">****{c.last4}</span>
                    <span className="text-slate-500 capitalize">{c.brand}</span>
                  </div>
                  <span className="text-slate-500">exp. {c.expiry}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {customer.tags?.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              {customer.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="text-[10px]">
                  <Tag className="w-2.5 h-2.5 mr-1" /> {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* CTA para 360° */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700 flex items-center justify-between">
          <span>Histórico completo, jornada, IA insights e disputas — abra o perfil 360°.</span>
        </div>
      </div>
    </SideDrawer>
  );
}