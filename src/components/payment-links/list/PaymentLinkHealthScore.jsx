import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Score de saúde por link (0-100).
 * Decompõe: config completa + performance recente + tracking
 */
export function calcLinkHealth(link) {
  if (!link) return { score: 0, status: 'unknown' };

  let score = 50;

  // Config básica
  if (link.main_image_url) score += 8;
  if (link.description) score += 6;
  if (link.payment_methods && link.payment_methods.length >= 2) score += 6;

  // Performance
  const conversion = link.views_count > 0 ? (link.usage_count || 0) / link.views_count : 0;
  if (conversion >= 0.05) score += 15;
  else if (conversion >= 0.02) score += 8;
  else if (link.views_count > 30 && conversion < 0.01) score -= 20;

  // Tracking
  if (link.utm_parameters && Object.keys(link.utm_parameters).length > 0) score += 5;
  if (link.pixel_ids && Object.keys(link.pixel_ids).length > 0) score += 5;

  // Estado
  if (link.status === 'inactive' || link.status === 'expired') score -= 25;

  score = Math.max(0, Math.min(100, score));

  let status = 'good';
  if (score >= 75) status = 'great';
  else if (score >= 55) status = 'good';
  else if (score >= 35) status = 'attention';
  else status = 'critical';

  return { score, status };
}

const statusConfig = {
  great: { color: 'bg-emerald-500', text: 'text-emerald-600', label: 'Saudável' },
  good: { color: 'bg-blue-500', text: 'text-blue-600', label: 'OK' },
  attention: { color: 'bg-amber-500', text: 'text-amber-600', label: 'Atenção' },
  critical: { color: 'bg-red-500', text: 'text-red-600', label: 'Crítico' },
  unknown: { color: 'bg-slate-300', text: 'text-slate-500', label: '—' },
};

export default function PaymentLinkHealthScore({ link, size = 'sm' }) {
  const { score, status } = calcLinkHealth(link);
  const cfg = statusConfig[status];

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200" />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(score / 100) * 175.93} 175.93`}
              className={cfg.text}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-lg font-bold', cfg.text)}>{score}</span>
          </div>
        </div>
        <div>
          <p className={cn('font-semibold text-sm', cfg.text)}>{cfg.label}</p>
          <p className="text-xs text-slate-500">Saúde do link</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1.5 cursor-help">
            <span className={cn('w-2 h-2 rounded-full', cfg.color)} />
            <span className={cn('text-xs font-semibold', cfg.text)}>{score}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            <p className="font-semibold">{cfg.label} — {score}/100</p>
            <p className="text-slate-300 mt-1">Inclui config, performance e tracking</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}