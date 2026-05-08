import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CreditCard, AlertTriangle, ShoppingBag, TrendingUp, Mail, Phone } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function CustomerHoverCard({ customer, children }) {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-0">
        <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#101F3E] text-white">
                {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{customer.name}</p>
              <p className="text-xs text-slate-500 truncate">{customer.email}</p>
              <Badge className="mt-1 text-[10px] capitalize" variant="outline">{customer.segment}</Badge>
            </div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-100">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">LTV</p>
            <p className="text-base font-bold text-emerald-600">{formatCurrency(customer.total_spent)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Compras</p>
            <p className="text-base font-bold">{customer.total_purchases || 0}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Ticket Médio</p>
            <p className="text-sm font-semibold text-blue-600">{formatCurrency(customer.average_ticket)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Risk Score</p>
            <p className="text-sm font-semibold text-purple-600">{customer.risk_score || 0}/100</p>
          </div>
        </div>

        {(customer.chargebacks_count > 0 || customer.refunds_count > 0) && (
          <div className="p-3 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              {customer.chargebacks_count || 0} chargeback(s) · {customer.refunds_count || 0} estorno(s)
            </p>
          </div>
        )}

        <div className="p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contato</p>
          <div className="flex items-center gap-2 text-xs">
            <Mail className="w-3 h-3 text-slate-400" />
            <span className="truncate">{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}