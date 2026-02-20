import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Link2, CreditCard, Search, Plus, ExternalLink, X, ShoppingCart, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockPaymentLinksForCoupon, mockCheckoutsForCoupon } from '@/components/mockData/couponMocks';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function CouponLinkBinding({ form, update }) {
  const [searchLink, setSearchLink] = useState('');
  const [searchCheckout, setSearchCheckout] = useState('');

  const scope = form.link_scope || 'all';
  const linkedLinks = form.linked_payment_link_ids || [];
  const linkedCheckouts = form.linked_checkout_ids || [];

  const filteredLinks = mockPaymentLinksForCoupon.filter(l =>
    l.name.toLowerCase().includes(searchLink.toLowerCase())
  );
  const filteredCheckouts = mockCheckoutsForCoupon.filter(c =>
    c.name.toLowerCase().includes(searchCheckout.toLowerCase())
  );

  const toggleLink = (id) => {
    const current = [...linkedLinks];
    const idx = current.indexOf(id);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(id);
    update('linked_payment_link_ids', current);
  };

  const toggleCheckout = (id) => {
    const current = [...linkedCheckouts];
    const idx = current.indexOf(id);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(id);
    update('linked_checkout_ids', current);
  };

  const showLinksSection = scope === 'specific_links' || scope === 'specific_both';
  const showCheckoutsSection = scope === 'specific_checkouts' || scope === 'specific_both';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#2bc196]" />
          Vinculação a Links e Checkouts
        </CardTitle>
        <CardDescription>
          Defina onde este cupom pode ser utilizado. Cupons são vinculados a Links de Pagamento e/ou Checkouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Scope selector */}
        <div>
          <Label>Onde este cupom pode ser usado?</Label>
          <Select value={scope} onValueChange={(v) => update('link_scope', v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-green-500" /> Todos os Links e Checkouts</div>
              </SelectItem>
              <SelectItem value="specific_links">
                <div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-blue-500" /> Links de Pagamento específicos</div>
              </SelectItem>
              <SelectItem value="specific_checkouts">
                <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-purple-500" /> Checkouts específicos</div>
              </SelectItem>
              <SelectItem value="specific_both">
                <div className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-orange-500" /> Links e Checkouts específicos</div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {scope === 'all' && (
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Este cupom será aceito em <strong>todos</strong> os links de pagamento e checkouts ativos.
            </p>
          </div>
        )}

        {/* Payment Links Selection */}
        {showLinksSection && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-500" />
                Links de Pagamento
                {linkedLinks.length > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">{linkedLinks.length} selecionado(s)</Badge>
                )}
              </Label>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar links de pagamento..."
                value={searchLink}
                onChange={(e) => setSearchLink(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-[240px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLinks.map(link => {
                const isSelected = linkedLinks.includes(link.id);
                return (
                  <label
                    key={link.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                      isSelected ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleLink(link.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.name}</p>
                      <p className="text-xs text-slate-500">{formatCurrency(link.amount)}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      link.status === 'active' ? 'text-green-600 border-green-200' : 'text-slate-400 border-slate-200'
                    )}>
                      {link.status === 'active' ? 'Ativo' : 'Rascunho'}
                    </Badge>
                  </label>
                );
              })}
              {filteredLinks.length === 0 && (
                <p className="text-sm text-slate-400 p-4 text-center">Nenhum link encontrado.</p>
              )}
            </div>
          </div>
        )}

        {/* Checkouts Selection */}
        {showCheckoutsSection && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-500" />
                Checkouts
                {linkedCheckouts.length > 0 && (
                  <Badge className="bg-purple-100 text-purple-700 text-xs">{linkedCheckouts.length} selecionado(s)</Badge>
                )}
              </Label>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar checkouts..."
                value={searchCheckout}
                onChange={(e) => setSearchCheckout(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-[200px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCheckouts.map(chk => {
                const isSelected = linkedCheckouts.includes(chk.id);
                return (
                  <label
                    key={chk.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                      isSelected ? "bg-purple-50 dark:bg-purple-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleCheckout(chk.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chk.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{chk.type}</p>
                    </div>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      chk.status === 'active' ? 'text-green-600 border-green-200' : 'text-slate-400 border-slate-200'
                    )}>
                      {chk.status === 'active' ? 'Ativo' : 'Rascunho'}
                    </Badge>
                  </label>
                );
              })}
              {filteredCheckouts.length === 0 && (
                <p className="text-sm text-slate-400 p-4 text-center">Nenhum checkout encontrado.</p>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        {(showLinksSection || showCheckoutsSection) && (linkedLinks.length > 0 || linkedCheckouts.length > 0) && (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Resumo de vinculação</p>
            <div className="flex flex-wrap gap-2">
              {linkedLinks.map(id => {
                const link = mockPaymentLinksForCoupon.find(l => l.id === id);
                return link ? (
                  <Badge key={id} className="bg-blue-100 text-blue-700 gap-1 pr-1">
                    <Link2 className="w-3 h-3" />
                    {link.name}
                    <button onClick={() => toggleLink(id)} className="ml-1 hover:bg-blue-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
              {linkedCheckouts.map(id => {
                const chk = mockCheckoutsForCoupon.find(c => c.id === id);
                return chk ? (
                  <Badge key={id} className="bg-purple-100 text-purple-700 gap-1 pr-1">
                    <CreditCard className="w-3 h-3" />
                    {chk.name}
                    <button onClick={() => toggleCheckout(id)} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}