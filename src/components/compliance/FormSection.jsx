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
  icon: Icon 
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader 
        className={cn(
          "pb-4",
          collapsible && "cursor-pointer hover:bg-gray-50 transition-colors"
        )}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-[#00D26A]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#00D26A]" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
              {subtitle && <CardDescription className="text-gray-500 mt-0.5">{subtitle}</CardDescription>}
            </div>
          </div>
          {collapsible && (
            <div className="text-gray-400">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          )}
        </div>
      </CardHeader>
      {(!collapsible || isOpen) && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
}