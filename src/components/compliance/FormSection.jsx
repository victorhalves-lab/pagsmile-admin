import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FormSection({ 
  title, 
  subtitle, 
  children, 
  collapsible = false, 
  defaultOpen = true,
  icon: Icon,
  className
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Card className={cn("border border-slate-200 shadow-lg bg-white", className)}>
      <CardHeader 
        className={cn(
          "pb-6 pt-6",
          collapsible && "cursor-pointer hover:bg-slate-50 transition-colors"
        )}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2bc196] to-emerald-500 flex items-center justify-center shadow-lg shadow-[#2bc196]/20">
                <Icon className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
              {subtitle && <CardDescription className="text-slate-500 mt-1 text-sm">{subtitle}</CardDescription>}
            </div>
          </div>
          {collapsible && (
            <div className="text-slate-400">
              {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
          )}
        </div>
      </CardHeader>
      {(!collapsible || isOpen) && (
        <CardContent className="pt-0 pb-8 px-6">
          {children}
        </CardContent>
      )}
    </Card>
  );
}