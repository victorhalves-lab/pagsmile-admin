import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * 6 input boxes individuais com auto-tab e auto-paste.
 */
export default function CodeInput({ value = '', onChange, length = 6 }) {
  const inputs = useRef([]);

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    const arr = value.split('');
    arr[idx] = val;
    const next = arr.join('').slice(0, length);
    onChange(next);
    if (val && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(paste);
    const focusIdx = Math.min(paste.length, length - 1);
    inputs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={el => inputs.current[idx] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={(e) => handleChange(idx, e)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            "w-12 h-14 text-center text-2xl font-bold font-mono",
            "border-2 border-slate-200 rounded-xl",
            "focus:border-[#2bc196] focus:ring-2 focus:ring-[#2bc196]/20 focus:outline-none",
            "transition-all bg-white",
            value[idx] && "border-[#2bc196] bg-[#2bc196]/5"
          )}
        />
      ))}
    </div>
  );
}