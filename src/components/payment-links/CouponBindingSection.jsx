import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  TicketPercent, Search, Plus, X, Percent, DollarSign, Zap, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCoupons } from '@/components/mockData/couponMocks';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function CouponBindingSection({ formData, setFormData }) {
  const [search, setSearch] = useState('');
  const [enableCoupons, setEnableCoupons] = useState(
    (formData.linked_coupon_ids?.length > 0) || !!formData.auto_apply_coupon_id
  );

  const linkedCoupons = formData.linked_coupon_ids || [];
  const autoApplyCouponId = formData.auto_apply_coupon_id || '';

  const activeCoupons = mockCoupons.filter(c => c.status === 'active');
  const filteredCoupons = activeCoupons.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCoupon = (id) => {
    const current = [...linkedCoupons];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      current.splice(idx, 1);
      // also remove auto-apply if it was this coupon
      if (autoApplyCouponId === id) {
        setFormData(prev => ({ ...prev, linked_coupon_ids: current, auto_apply_coupon_id: '' }));
        return;
      }
    } else {
      current.push(id);
    }
    setFormData(prev => ({ ...prev, linked_coupon_ids: current }));
  };

  const handleAutoApplyChange = (couponId) => {
    setFormData(prev => ({
      ...prev,
      auto_apply_coupon_id: prev.auto_apply_coupon_id === couponId ? '' : couponId
    }));
  };

  const handleToggleEnable = (val) => {
    setEnableCoupons(val);
    if (!val) {
      setFormData(prev => ({ ...prev, linked_coupon_ids: [], auto_apply_coupon_id: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TicketPercent className="w-5 h-5 text-[#2bc196]" />
          Cupons e Descontos
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Vincule cupons existentes ou crie novos para aplicar neste link de pagamento.
        </p>
      </div>

      {/* Enable/Disable */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
        <div>
          <p className="font-medium text-sm">Habilitar cupons neste link</p>
          <p className="text-xs text-slate-500 mt-0.5">Permitir que clientes apliquem cupons de desconto</p>
        </div>
        <Switch checked={enableCoupons} onCheckedChange={handleToggleEnable} />
      </div>

      {enableCoupons && (
        <>
          {/* Search + Create */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar cupons por nome ou código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link to={createPageUrl('CouponForm')}>
              <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                Criar Cupom
              </Button>
            </Link>
          </div>

          {/* Coupon List */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCoupons.map(coupon => {
              const isSelected = linkedCoupons.includes(coupon.id);
              const isAutoApply = autoApplyCouponId === coupon.id;
              return (
                <div
                  key={coupon.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    isSelected ? "bg-emerald-50 dark:bg-emerald-900/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleCoupon(coupon.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{coupon.code}</span>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        coupon.type === 'percentage' ? 'text-blue-600 border-blue-200' : 'text-amber-600 border-amber-200'
                      )}>
                        {coupon.type === 'percentage'
                          ? <><Percent className="w-3 h-3 mr-0.5" />{coupon.value}%</>
                          : <><DollarSign className="w-3 h-3 mr-0.5" />{formatCurrency(coupon.value)}</>
                        }
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{coupon.name}</p>
                  </div>
                  {isSelected && (
                    <button
                      onClick={() => handleAutoApplyChange(coupon.id)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all border",
                        isAutoApply
                          ? "bg-[#2bc196] text-white border-[#2bc196]"
                          : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:text-[#2bc196]"
                      )}
                      title="Aplicar automaticamente ao abrir o link"
                    >
                      <Zap className="w-3 h-3" />
                      {isAutoApply ? 'Auto-aplicado' : 'Auto-aplicar'}
                    </button>
                  )}
                </div>
              );
            })}
            {filteredCoupons.length === 0 && (
              <div className="p-6 text-center">
                <TicketPercent className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Nenhum cupom ativo encontrado.</p>
                <Link to={createPageUrl('CouponForm')}>
                  <Button variant="link" size="sm" className="mt-1">
                    <Plus className="w-4 h-4 mr-1" /> Criar novo cupom
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Selected Summary */}
          {linkedCoupons.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-emerald-700 uppercase">
                {linkedCoupons.length} cupom(ns) vinculado(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {linkedCoupons.map(id => {
                  const coupon = activeCoupons.find(c => c.id === id);
                  if (!coupon) return null;
                  return (
                    <Badge key={id} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-emerald-200 gap-1 pr-1">
                      <TicketPercent className="w-3 h-3 text-emerald-600" />
                      {coupon.code}
                      {autoApplyCouponId === id && (
                        <span className="text-[9px] bg-[#2bc196] text-white px-1 rounded ml-1">AUTO</span>
                      )}
                      <button onClick={() => toggleCoupon(id)} className="ml-1 hover:bg-slate-100 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
              {autoApplyCouponId && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  O cupom <strong>{activeCoupons.find(c => c.id === autoApplyCouponId)?.code}</strong> será aplicado automaticamente ao abrir o link.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}