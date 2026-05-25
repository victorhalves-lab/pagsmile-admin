import React from 'react';
import { cn } from '@/lib/utils';

/**
 * V9 Reference Card — Pulse V9 / VF official.
 * Hero card com gradient + watermark icon no canto superior direito.
 *
 * Props:
 *  - variant: 'mint' | 'blue' | 'deep' | 'glow'
 *  - size: 'sm' | 'md' (default) | 'lg'
 *  - label, value, suffix, prefix (ccy), pct, description, watermarkPath (SVG d=)
 *  - watermarkSvg: ReactNode (svg children) opcional alternativa a watermarkPath
 */
export default function V9ReferenceCard({
  variant = 'mint',
  size = 'md',
  label,
  prefix,
  value,
  suffix,
  pct,
  description,
  watermarkSvg,
  className,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'v9rc',
        variant === 'mint' && 'v9rc-mint',
        variant === 'blue' && 'v9rc-blue',
        variant === 'deep' && 'v9rc-deep',
        variant === 'glow' && 'v9rc-glow',
        size === 'sm' && 'v9rc-sm',
        size === 'lg' && 'v9rc-lg',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {watermarkSvg && <div className="wm"><svg viewBox="0 0 24 24">{watermarkSvg}</svg></div>}
      <div>
        {label && <div className="lab">{label}</div>}
        <div className="v">
          {prefix && <span className="ccy">{prefix}</span>}
          {value}
          {suffix && <span className="sfx">{suffix}</span>}
          {pct && <span className="pct">{pct}</span>}
        </div>
      </div>
      {description && <div className="desc">{description}</div>}
    </div>
  );
}