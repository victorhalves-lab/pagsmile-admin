import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function PlanCard({ plan, isSelected, onSelect }) {
  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:-translate-y-1",
        isSelected 
        ? "border-2 border-[#00c295] shadow-xl shadow-[#00c295]/15 bg-white scale-[1.02] z-10" 
        : "border-slate-100 hover:border-[#00c295]/30 hover:shadow-lg bg-white/80"
        )}
        onClick={() => onSelect(plan.id)}
        >
        {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <Badge className="bg-[#00c295] hover:bg-[#00c295] text-white border-0 shadow-lg shadow-[#00c295]/30 px-3 py-1 text-xs uppercase tracking-widest font-bold">
          Mais Popular
        </Badge>
        </div>
        )}
      
      <CardHeader className="text-center pb-2 pt-4 px-4">
        <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
        <p className="text-xs text-slate-500 min-h-[32px] flex items-center justify-center leading-tight">{plan.description}</p>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-2">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center py-1 border-b border-slate-50">
            <span className="text-xs text-slate-500 font-medium">Crédito à vista</span>
            <span className="text-sm font-bold text-slate-900">{plan.mdr1x}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-50">
            <span className="text-xs text-slate-500 font-medium">Crédito 2x-6x</span>
            <span className="text-sm font-bold text-slate-900">{plan.mdr2_6x}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-50">
            <span className="text-xs text-slate-500 font-medium">Crédito 7x-12x</span>
            <span className="text-sm font-bold text-slate-900">{plan.mdr7_12x}</span>
          </div>
          <div className="flex justify-between items-center py-1 bg-[#00c295]/5 -mx-4 px-4">
            <span className="text-xs font-bold text-[#00c295]">Taxa PIX</span>
            <span className="text-sm font-bold text-[#00c295]">{plan.pixRate}</span>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-2 text-center flex flex-col items-center justify-center gap-0.5">
          <div className="flex items-baseline gap-2">
             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Recebimento</span>
             <span className="text-lg font-black text-slate-900">{plan.anticipationTerm}</span>
          </div>
          <p className="text-[10px] text-slate-400">Antecipação: {plan.anticipationRate}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 flex justify-center">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
          isSelected 
            ? "bg-[#00c295] text-white shadow-lg shadow-[#00c295]/40 scale-110" 
            : "bg-slate-100 text-slate-300 group-hover:bg-slate-200"
        )}>
          <Check className="w-4 h-4" />
        </div>
      </CardFooter>
    </Card>
  );
}