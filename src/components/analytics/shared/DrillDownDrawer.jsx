import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * Drawer universal para drill-down de qualquer KPI/gráfico.
 */
export default function DrillDownDrawer({ open, onOpenChange, title, subtitle, badge, children, onExport, onViewAll }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-5 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SheetTitle className="text-lg">{title}</SheetTitle>
                {badge && <Badge>{badge}</Badge>}
              </div>
              {subtitle && <SheetDescription className="text-xs">{subtitle}</SheetDescription>}
            </div>
            <div className="flex gap-1">
              {onExport && (
                <Button size="sm" variant="outline" onClick={onExport} className="h-8 gap-1">
                  <Download className="w-3.5 h-3.5" /> Exportar
                </Button>
              )}
              {onViewAll && (
                <Button size="sm" variant="outline" onClick={onViewAll} className="h-8 gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> Ver tudo
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-5">{children}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}