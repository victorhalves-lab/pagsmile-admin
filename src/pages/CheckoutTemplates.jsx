import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Paintbrush, ShoppingCart, ArrowRight, Layout, Monitor, Smartphone } from 'lucide-react';
import PageHeader from "@/components/common/PageHeader";

// Placeholder patterns for checkout backgrounds
const AbstractPattern1 = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
    <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="#00D26A" />
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M0 100 L100 0" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const AbstractPattern2 = () => (
  <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
    <rect x="0" y="0" width="100" height="100" fill="#101F3E" />
    <path d="M0 0 Q 50 100 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const CheckoutMockup = ({ style = "default" }) => (
  <div className="w-full h-48 bg-slate-50 rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden border border-slate-100">
    <div className="flex justify-between items-center mb-2">
       <div className="w-20 h-4 bg-slate-200 rounded-md animate-pulse" />
       <div className="w-8 h-8 rounded-full bg-slate-200" />
    </div>
    <div className="flex gap-4 h-full">
        <div className="flex-1 flex flex-col gap-2">
            <div className="w-full h-8 bg-white border border-slate-200 rounded-md" />
            <div className="w-full h-8 bg-white border border-slate-200 rounded-md" />
            <div className="flex gap-2">
                 <div className="flex-1 h-8 bg-white border border-slate-200 rounded-md" />
                 <div className="flex-1 h-8 bg-white border border-slate-200 rounded-md" />
            </div>
             <div className="w-full h-10 bg-[#00D26A] rounded-md mt-auto opacity-80" />
        </div>
        <div className="w-1/3 bg-slate-100 rounded-md hidden sm:block p-2">
             <div className="w-full h-20 bg-slate-200 rounded-md mb-2" />
             <div className="w-full h-3 bg-slate-200 rounded-md" />
        </div>
    </div>
    
    {/* Style Overlays */}
    {style === 'dark' && <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />}
    {style === 'minimal' && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />}
  </div>
);

export default function CheckoutTemplates() {
  const templates = [
    { id: 1, name: "PagSmile Default", type: "Standard", style: "default" },
    { id: 2, name: "Dark High Conversion", type: "Dark Mode", style: "dark" },
    { id: 3, name: "Minimalist Pro", type: "Minimal", style: "minimal" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <PageHeader 
        title="Templates de Checkout" 
        subtitle="Escolha um design otimizado para sua loja"
        breadcrumbs={[{ label: 'Checkout', page: 'CheckoutBuilder' }, { label: 'Templates', page: 'CheckoutTemplates' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            {/* Visual Preview Area */}
            <div className="h-56 bg-slate-50 dark:bg-slate-900 relative p-6 flex items-center justify-center overflow-hidden">
                {template.style === 'default' && <AbstractPattern1 />}
                {template.style === 'dark' && <AbstractPattern2 />}
                
                <div className="relative z-10 w-full transform group-hover:scale-105 transition-transform duration-500">
                    <CheckoutMockup style={template.style} />
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{template.name}</h3>
                  <Badge variant="secondary" className="font-normal">
                    {template.type}
                  </Badge>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500">
                   {template.style === 'default' && <Layout className="w-5 h-5" />}
                   {template.style === 'dark' && <Monitor className="w-5 h-5" />}
                   {template.style === 'minimal' && <Smartphone className="w-5 h-5" />}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                   Pré-visualizar
                </Button>
                <Button className="flex-1 bg-[#00D26A] hover:bg-[#00A854] text-white">
                   Usar Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}