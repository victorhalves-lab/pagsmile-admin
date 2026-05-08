import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Rich empty state with icon, title, description, primary action and optional secondary actions / educational links.
 * Used across pages to replace generic "No data" messages.
 */
export default function EmptyStateRich({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryActions = [],
  links = [],
  illustration,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}>
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : Icon ? (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2bc196]/10 to-[#5cf7cf]/10 flex items-center justify-center mb-5 ring-1 ring-[#2bc196]/20">
          <Icon className="w-8 h-8 text-[#2bc196]" />
        </div>
      ) : null}

      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      )}

      {(primaryAction || secondaryActions.length > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              className="bg-[#2bc196] hover:bg-[#25a880] text-white"
            >
              {primaryAction.icon && <primaryAction.icon className="w-4 h-4 mr-2" />}
              {primaryAction.label}
            </Button>
          )}
          {secondaryActions.map((a, i) => (
            <Button key={i} variant="outline" onClick={a.onClick}>
              {a.icon && <a.icon className="w-4 h-4 mr-2" />}
              {a.label}
            </Button>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href || '#'}
              onClick={l.onClick}
              className="hover:text-[#2bc196] underline-offset-4 hover:underline"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}