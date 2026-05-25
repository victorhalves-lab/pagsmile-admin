import React from 'react';
import { cn } from '@/lib/utils';

/**
 * V9 Page Hero — title gigante com em em gradient tri-color + badge eyebrow.
 */
export default function V9PageHero({ badge, title, titleEm, titleAfter, description, actions, className }) {
  return (
    <header className={cn('pulse-hero flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4', className)}>
      <div>
        {badge && <div className="badge">{badge}</div>}
        <h1>
          {title}
          {titleEm && <em> {titleEm}</em>}
          {titleAfter}
        </h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}