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
          ? "border-2 border-[#00D26A] shadow-xl shadow-[#00D26A]/15 bg-white scale-[1.02] z-10" 
          : "border-slate-100 hover:border-[#00D26A]/30 hover:shadow-lg bg-white/80"
      )}
      onClick={() => onSelect(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <Badge className="bg-[#00D26A] hover:bg-[#00D26A] text-white border-0 shadow-lg shadow-[#00D26A]/30 px-3 py-1 text-xs uppercase tracking-widest font-bold">
            Mais Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-2 pt-8">
        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
        <p className="text-sm text-slate-500 min-h-[40px] flex items-center justify-center">{plan.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Crédito à vista</span>
            <span className="font-bold text-slate-900">{plan.mdr1x}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Crédito 2x-6x</span>
            <span className="font-bold text-slate-900">{plan.mdr2_6x}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-sm text-slate-500 font-medium">Crédito 7x-12x</span>
            <span className="font-bold text-slate-900">{plan.mdr7_12x}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50 bg-[#00D26A]/5 -mx-6 px-6">
            <span className="text-sm font-bold text-[#00D26A]">Taxa PIX</span>
            <span className="font-bold text-[#00D26A]">{plan.pixRate}</span>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-center space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Recebimento</p>
          <p className="text-2xl font-black text-slate-900">{plan.anticipationTerm}</p>
          <p className="text-xs text-slate-400">Taxa antecipação: {plan.anticipationRate}</p>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex justify-center">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
          isSelected 
            ? "bg-[#00D26A] text-white shadow-lg shadow-[#00D26A]/40 scale-110" 
            : "bg-slate-100 text-slate-300 group-hover:bg-slate-200"
        )}>
          <Check className="w-5 h-5" />
        </div>
      </CardFooter>
    </Card>
  );
}