import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, Code, Briefcase, Store, ShoppingCart, GraduationCap, Layers, Heart, Plane, Utensils, Palette, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Selector de Business Type com search + sub-categorias.
 * Substitui os 7 botões hardcoded.
 */
const businessTypes = [
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, sub: 'Loja online de produtos' },
  { id: 'saas', label: 'SaaS', icon: Code, sub: 'Software por assinatura' },
  { id: 'services', label: 'Serviços', icon: Briefcase, sub: 'Consultoria, agência, freelance' },
  { id: 'retail', label: 'Varejo físico', icon: Store, sub: 'Loja com endereço físico' },
  { id: 'marketplace', label: 'Marketplace', icon: Layers, sub: 'Múltiplos vendedores' },
  { id: 'infoproducts', label: 'Infoprodutos', icon: GraduationCap, sub: 'Cursos, ebooks, mentoria' },
  { id: 'subscription', label: 'Assinatura', icon: Heart, sub: 'Clube ou recorrência' },
  { id: 'travel', label: 'Turismo', icon: Plane, sub: 'Viagens, hotéis, passagens' },
  { id: 'food', label: 'Alimentação', icon: Utensils, sub: 'Restaurante, delivery' },
  { id: 'creative', label: 'Criativo', icon: Palette, sub: 'Design, arte, conteúdo' },
  { id: 'fashion', label: 'Moda', icon: ShoppingBag, sub: 'Roupas, acessórios' },
  { id: 'other', label: 'Outro', icon: MoreHorizontal, sub: 'Descreva no campo abaixo' },
];

export default function BusinessTypeSelector({ value, onChange }) {
  const [search, setSearch] = useState('');

  const filtered = businessTypes.filter(t => 
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.sub.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar tipo de negócio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.map(bt => {
          const Icon = bt.icon;
          const selected = value === bt.id;
          return (
            <button
              key={bt.id}
              type="button"
              onClick={() => onChange(bt.id)}
              className={cn(
                "flex items-start gap-2 p-3 rounded-xl border-2 text-left transition-all",
                selected
                  ? "border-[#2bc196] bg-[#2bc196]/5 shadow-sm"
                  : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                selected ? "bg-[#2bc196] text-white" : "bg-slate-100 text-slate-500"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "text-sm font-bold leading-tight",
                  selected ? "text-[#2bc196]" : "text-slate-900"
                )}>
                  {bt.label}
                </div>
                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  {bt.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-xs text-slate-400 py-4">
          Nenhum tipo encontrado. Selecione "Outro" e descreva.
        </p>
      )}
    </div>
  );
}