import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PageHeader · V7 (Pagsmile Pulse)
 * - Eyebrow mono uppercase em mint Pagsmile (cor-marca)
 * - Breadcrumb crumb-v7 (slate-muted com último item ink-strong)
 * - Ícone com fundo mint-soft (não slate puro) — traz a cor da marca
 * - Título 24px / w800 / tracking -0.02em
 */
export default function PageHeader({
  title,
  subtitle,
  eyebrow,
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
            className="hover:text-pag-mint-700 dark:hover:text-pag-mint-300 transition-colors inline-flex items-center"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                {isLast ? (
                  <span className="font-semibold text-pag-navy-900 dark:text-white">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={createPageUrl(crumb.page)}
                    className="hover:text-pag-mint-700 dark:hover:text-pag-mint-300 transition-colors"
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
            <div className="w-10 h-10 rounded-lg bg-pag-mint-50 dark:bg-pag-mint-500/15 border border-pag-mint-200/70 dark:border-pag-mint-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5 text-pag-mint-700 dark:text-pag-mint-300" strokeWidth={1.75} />
            </div>
          )}
          <div className="min-w-0">
            {eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-pag-mint-700 dark:text-pag-mint-300 mb-1.5">
                {eyebrow}
              </p>
            )}
            <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-pag-navy-900 dark:text-white leading-tight">
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