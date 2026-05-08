import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Password strength indicator com checklist visual.
 * Score: 0=fraca, 1=média, 2=forte, 3=muito forte
 */
export default function PasswordStrength({ password = '' }) {
  const checks = [
    { id: 'length', label: '8+ caracteres', test: (p) => p.length >= 8 },
    { id: 'mix', label: 'Maiúscula e minúscula', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
    { id: 'number', label: 'Pelo menos 1 número', test: (p) => /\d/.test(p) },
    { id: 'symbol', label: 'Símbolo (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const passed = checks.filter(c => c.test(password)).length;
  const score = passed; // 0..4

  const levels = [
    { color: 'bg-slate-200', text: 'Digite uma senha', textColor: 'text-slate-400' },
    { color: 'bg-red-400', text: 'Fraca', textColor: 'text-red-600' },
    { color: 'bg-orange-400', text: 'Razoável', textColor: 'text-orange-600' },
    { color: 'bg-yellow-400', text: 'Boa', textColor: 'text-yellow-600' },
    { color: 'bg-emerald-500', text: 'Forte', textColor: 'text-emerald-600' },
  ];
  const level = levels[score];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-1">
      {/* Bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= score ? level.color : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-semibold", level.textColor)}>
          {level.text}
        </span>
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1 mt-1">
        {checks.map(c => {
          const ok = c.test(password);
          return (
            <div key={c.id} className="flex items-center gap-1.5 text-xs">
              {ok ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              ) : (
                <Circle className="w-3 h-3 text-slate-300 flex-shrink-0" />
              )}
              <span className={cn(ok ? 'text-emerald-700' : 'text-slate-400')}>
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}