import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const sizeMap = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[520px]',
  lg: 'sm:max-w-[680px]',
  xl: 'sm:max-w-[900px]',
};

export default function SideDrawer({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconClassName,
  size = 'md',
  children,
  footer,
  className,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'w-full p-0 flex flex-col h-full overflow-hidden',
          sizeMap[size] || sizeMap.md,
          className
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                iconClassName || "bg-[#2bc196]/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  iconClassName ? "" : "text-[#2bc196]"
                )} />
              </div>
            )}
            <div className="flex-1 min-w-0 pr-6">
              <SheetTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </SheetTitle>
              {description && (
                <SheetDescription className="text-sm text-slate-500 mt-1">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
          <Separator className="mt-4" />
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {children}
        </div>

        {/* Footer - Fixed */}
        {footer && (
          <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}