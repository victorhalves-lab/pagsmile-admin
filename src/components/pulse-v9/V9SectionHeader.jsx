import React from 'react';
import { cn } from '@/lib/utils';

/**
 * V9 Section Header — eyebrow mono uppercase + title com em accent mint + count pill.
 */
export default function V9SectionHeader({ eyebrow, title, titleEm, count, action, className }) {
  return (
    <header className={cn('pulse-sec-h', className)}>
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        {title && (
          <h2>
            {title}
            {titleEm && <em> {titleEm}</em>}
          </h2>
        )}
      </div>
      {count && <span className="count">{count}</span>}
      {action}
    </header>
  );
}