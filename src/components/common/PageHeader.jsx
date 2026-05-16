import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PageHeader · V7
 * - Breadcrumb estilo "crumb" mono (var(--v7-mute) / ink em negrito)
 * - Sem ícone-cápsula colorido; ícone é neutro/slate
 * - Sem Sparkles decorativo
 * - Título 24px / weight 800 (tracking -0.02em) — alinhado a .title-v7
 */
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  icon: Icon,
  className,
}) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <Link
            to={createPageUrl('Dashboard')}
            className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors inline-flex items-center"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                {isLast ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={createPageUrl(crumb.page)}
                    className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" strokeWidth={1.75} />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-[13px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}