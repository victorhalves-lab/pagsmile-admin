import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { House, CaretRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import EditorialHeading from './EditorialHeading';

/**
 * EditorialPageHeader · Pagsmile 2026
 * Header padrão das páginas no estilo editorial fintech.
 * - Breadcrumb mono (Phosphor icons)
 * - Headline ALL CAPS com palavra-destaque
 * - Subtítulo mono uppercase
 * - Actions area à direita
 *
 * Uso:
 *   <EditorialPageHeader
 *     titleWords={["PAINEL", "EXECUTIVO"]}
 *     accentIndex={1}
 *     subtitle="VISÃO 360 DA SUA OPERAÇÃO"
 *     breadcrumbs={[{ label: 'Dashboard', page: 'Dashboard' }]}
 *     actions={<Button>...</Button>}
 *   />
 */
export default function EditorialPageHeader({
  titleWords,
  accentIndex = 1,
  subtitle,
  eyebrow,
  breadcrumbs = [],
  actions,
  className,
}) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 mb-3 font-mono text-[11px] text-[#7a9b97] dark:text-[#7a9b97]">
          <Link
            to={createPageUrl('Dashboard')}
            className="hover:text-[#00c194] transition-colors inline-flex items-center"
          >
            <House className="w-3.5 h-3.5" weight="duotone" />
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <CaretRight className="w-3 h-3 opacity-50" weight="bold" />
                {isLast ? (
                  <span className="font-semibold text-pag-navy-900 dark:text-white uppercase tracking-wider">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={createPageUrl(crumb.page)}
                    className="hover:text-[#00c194] transition-colors uppercase tracking-wider"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <EditorialHeading
          text={titleWords}
          accentIndex={accentIndex}
          subtitle={subtitle}
          eyebrow={eyebrow}
          size="lg"
        />
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}