import React from 'react';
import { cn } from '@/lib/utils';

/**
 * V9 Segmented Control — pill cápsula com active gradient mint→mint-700.
 *
 * Props:
 *  - options: [{ id, label }]
 *  - value, onChange
 *  - dark: boolean (toolbar em fundo escuro)
 */
export default function V9Segmented({ options, value, onChange, dark = false, className }) {
  return (
    <div className={cn('v8b-seg', dark && 'dark', className)}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={value === opt.id ? 'on' : ''}
          onClick={() => onChange?.(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}