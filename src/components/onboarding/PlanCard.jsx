import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PlanCard({ plan, isSelected, onSelect }) {
  return (
    <Card className={cn(
      "relative flex flex-col transition-all duration-300 cursor-pointer hover:shadow-lg",
      isSelected 
        ? "border-2 border-[#00D26A] shadow-lg shadow-[#00D26A]/10 bg-[#00D26A]/5" 
        : "border border-gray-200 hover:border-gray-300"
    )} onClick={() => onSelect(plan.id)}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#00D26A] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> POPULAR
          </span>
        </div>
      )}
      
      <CardHeader className="text-center pb-4 pt-6">
        <CardTitle className="text-xl font-bold text-gray-800">{plan.name}</CardTitle>
        <p className="text-sm text-gray-500">{plan.description}</p>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">MDR Cartão</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-400">1x</span>
                <p className="font-bold text-gray-800">{plan.mdr1x}</p>
              </div>
              <div>
                <span className="text-gray-400">2-6x</span>
                <p className="font-bold text-gray-800">{plan.mdr2_6x}</p>
              </div>
              <div>
                <span className="text-gray-400">7-12x</span>
                <p className="font-bold text-gray-800">{plan.mdr7_12x}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Taxa Pix</span>
            <span className="font-bold text-gray-800">{plan.pixRate}</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Antecipação</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Prazo</span>
              <span className="font-semibold text-gray-800">{plan.anticipationTerm}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fee</span>
              <span className="font-semibold text-gray-800">{plan.anticipationFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxa</span>
              <span className="font-semibold text-gray-800">{plan.anticipationRate}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className={cn(
            "w-full mt-4",
            isSelected 
              ? "bg-[#00D26A] hover:bg-[#00A854] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          {isSelected ? (
            <><Check className="mr-2 h-4 w-4" /> Selecionado</>
          ) : (
            'Selecionar'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}