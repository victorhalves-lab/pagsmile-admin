import React from 'react';
import { TrendUp, TrendDown } from '@phosphor-icons/react';

/**
 * vfHelpers — Pulse VF · Brand 2026.
 * Tokens, formatters e átomos visuais reaproveitados nos analytics views.
 * Mantém estritamente paleta brand (mint #00C194, navy #002443, deep #0F2B2B, glow #5CF7CF)
 * + system colors apenas para warning/danger.
 */

export const fmtCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    notation: 'compact', maximumFractionDigits: 1,
  }).format(v || 0);

export const fmtCurrencyFull = (v) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(v || 0);

export const fmtInt = (v) => new Intl.NumberFormat('pt-BR').format(v || 0);

/* ─── Tokens VF compartilhados ─── */
export const VF = {
  mint: '#00C194',
  mintDark: '#007A5C',
  mintLight: '#B4FCE8',
  mintBorder: '#80E5C6',
  navy: '#001124',
  navy2: '#002443',
  deep: '#0F2B2B',
  glow: '#5CF7CF',
  muted: '#547C9D',
  faint: '#8AA5BD',
  surface: '#fff',
  surfaceTint: 'linear-gradient(135deg, #fff, #F0FAF6)',
  amber: '#B45309',
  amberBg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
  amberBorder: '#FDE68A',
  red: '#B91C1C',
  redBg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)',
  redBorder: '#FCA5A5',
};

/* ─── Card base VF (substitui shadcn Card no contexto VF) ─── */
export const VfCard = ({ children, className = '', style = {}, padding = 20 }) => (
  <div
    className={className}
    style={{
      position: 'relative',
      background: VF.surfaceTint,
      border: `1px solid ${VF.mintBorder}`,
      borderRadius: 16,
      padding,
      boxShadow: '0 4px 14px -4px rgba(0,193,148,0.12)',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ─── Section Header VF (eyebrow + título com gradient em palavra-chave) ─── */
export const VfSectionHeader = ({ eyebrow, title, highlight, icon: Icon, rightSlot }) => (
  <div
    style={{
      position: 'relative',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 12,
      marginBottom: 16, paddingBottom: 12,
      borderBottom: `1px solid ${VF.mintBorder}`,
    }}
  >
    <span
      style={{
        position: 'absolute', left: 0, bottom: -1,
        width: 80, height: 2,
        background: `linear-gradient(90deg, ${VF.mint}, ${VF.glow})`,
        borderRadius: 99,
      }}
    />
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {Icon && (
        <div
          style={{
            width: 42, height: 42, borderRadius: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(135deg, ${VF.navy2}, ${VF.navy})`,
            color: VF.glow,
            boxShadow: '0 6px 14px -3px rgba(0,36,67,0.5)',
          }}
        >
          <Icon weight="duotone" size={22} />
        </div>
      )}
      <div>
        <div
          className="font-mono"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 10.5, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: VF.mintDark, marginBottom: 4,
          }}
        >
          <span style={{ width: 18, height: 2, background: VF.mint, borderRadius: 99 }} />
          {eyebrow}
        </div>
        <h3
          style={{
            margin: 0, fontFamily: 'Inter, sans-serif',
            fontSize: 17, fontWeight: 800, letterSpacing: '-0.018em',
            color: VF.navy, lineHeight: 1.2,
          }}
        >
          {title}{' '}
          {highlight && (
            <em
              style={{
                fontStyle: 'normal',
                background: `linear-gradient(135deg, ${VF.mint}, ${VF.mintDark})`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {highlight}
            </em>
          )}
        </h3>
      </div>
    </div>
    {rightSlot}
  </div>
);

/* ─── Eyebrow simples (sem título) ─── */
export const VfEyebrow = ({ children, color = VF.mintDark }) => (
  <p
    className="font-mono"
    style={{
      fontSize: 10.5, fontWeight: 800,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </p>
);

/* ─── KPI tile compacto (linha de KPIs no topo) ─── */
export const VfKpiTile = ({ icon: Icon, label, value, sub, change, inverted, accent }) => {
  const hasChange = typeof change === 'number';
  const positive = hasChange ? (inverted ? change < 0 : change >= 0) : null;
  const accentColor = accent || VF.mintDark;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        padding: 14, borderRadius: 12,
        background: VF.surface,
        border: `1px solid ${VF.mintBorder}`,
      }}
    >
      {/* Top accent line */}
      <span
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${accentColor}, ${VF.glow})`,
        }}
      />
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        {Icon && (
          <div
            style={{
              width: 26, height: 26, borderRadius: 7,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
              color: VF.mintDark,
              border: `1px solid ${VF.mintBorder}`,
            }}
          >
            <Icon weight="duotone" size={14} />
          </div>
        )}
        {hasChange && <VfTrendBadge value={change} inverted={inverted} />}
      </div>
      <p
        className="font-mono"
        style={{
          fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: VF.muted, marginBottom: 2,
        }}
      >
        {label}
      </p>
      <p
        className="font-mono"
        style={{
          fontSize: 18, fontWeight: 800, color: VF.navy,
          fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="font-mono" style={{ fontSize: 10, color: VF.muted, marginTop: 2 }}>
          {sub}
        </p>
      )}
    </div>
  );
};

/* ─── Trend badge (Δ%) com tokens VF ─── */
export const VfTrendBadge = ({ value, inverted = false }) => {
  const positive = inverted ? value < 0 : value >= 0;
  const Icon = value >= 0 ? TrendUp : TrendDown;
  return (
    <span
      className="font-mono inline-flex items-center gap-0.5"
      style={{
        padding: '3px 7px', borderRadius: 99,
        background: positive
          ? 'linear-gradient(135deg, #B3F0DE, #B4FCE8)'
          : 'linear-gradient(135deg, #FEE2E2, #FCA5A5)',
        color: positive ? VF.mintDark : VF.red,
        border: `1px solid ${positive ? '#4DD8AB' : '#FCA5A5'}`,
        fontSize: 9.5, fontWeight: 800,
        letterSpacing: '0.04em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <Icon weight="bold" size={10} />
      {Math.abs(value).toFixed(value < 1 && value > -1 ? 2 : 1)}
      {Math.abs(value) < 1 ? 'pp' : '%'}
    </span>
  );
};

/* ─── Color helpers para rates ─── */
export const rateColor = (r) => (r >= 88 ? VF.mintDark : r >= 82 ? VF.amber : VF.red);
export const convColor = (r) => (r >= 75 ? VF.mintDark : r >= 65 ? VF.amber : VF.red);

export const rateBarGradient = (r) =>
  r >= 88
    ? `linear-gradient(90deg, #1ECB9D, ${VF.mintDark})`
    : r >= 82
      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
      : 'linear-gradient(90deg, #F87171, #DC2626)';

export const convBarGradient = (r) =>
  r >= 75
    ? `linear-gradient(90deg, #1ECB9D, ${VF.mintDark})`
    : r >= 65
      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
      : 'linear-gradient(90deg, #F87171, #DC2626)';

/* ─── Progress bar VF ─── */
export const VfProgress = ({ value, gradient, height = 6, width = '100%' }) => (
  <div
    style={{
      height, width,
      background: '#E0F8F1',
      borderRadius: 99, overflow: 'hidden',
      border: '1px solid #B3F0DE',
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${Math.min(100, Math.max(0, value))}%`,
        background: gradient || `linear-gradient(90deg, ${VF.mint}, ${VF.mintDark})`,
        borderRadius: 99,
        transition: 'width 0.4s ease',
      }}
    />
  </div>
);

/* ─── Pill / badge VF (status, contagem etc) ─── */
export const VfPill = ({ children, variant = 'default', icon: Icon }) => {
  const variants = {
    default: { bg: VF.surface, color: VF.navy, border: '#C0CFDC' },
    mint:    { bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: VF.mintDark, border: '#4DD8AB' },
    navy:    { bg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)', color: VF.navy, border: '#8AA5BD' },
    warn:    { bg: VF.amberBg, color: VF.amber, border: VF.amberBorder },
    err:     { bg: VF.redBg, color: VF.red, border: VF.redBorder },
    deep:    { bg: 'linear-gradient(135deg, #E8EDED, #C0CDCD)', color: '#091818', border: '#8FAAAA' },
    solid:   { bg: `linear-gradient(135deg, ${VF.mint}, ${VF.mintDark})`, color: '#fff', border: 0 },
  };
  const v = variants[variant];
  return (
    <span
      className="font-mono inline-flex items-center gap-1"
      style={{
        padding: '4px 10px', borderRadius: 99,
        background: v.bg, color: v.color, border: v.border ? `1px solid ${v.border}` : 0,
        fontSize: 9.5, fontWeight: 800,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}
    >
      {Icon && <Icon weight="duotone" size={11} />}
      {children}
    </span>
  );
};

/* ─── Inline insight footer (rodapé com Sparkle de insight IA) ─── */
export const VfInsightFooter = ({ children, icon: Icon }) => (
  <div
    className="mt-3 pt-3 flex items-start gap-2"
    style={{
      borderTop: '1px dashed #B3F0DE',
      fontSize: 11.5, color: VF.navy, lineHeight: 1.5,
    }}
  >
    {Icon && (
      <Icon weight="duotone" size={14} style={{ color: VF.mintDark, flexShrink: 0, marginTop: 2 }} />
    )}
    <span>{children}</span>
  </div>
);

/* ─── Number value display (mono, brand gradient text) ─── */
export const VfNumber = ({ children, size = 18, gradient = true }) => (
  <span
    className="font-mono"
    style={{
      fontSize: size, fontWeight: 800,
      letterSpacing: '-0.018em', lineHeight: 1.05,
      fontVariantNumeric: 'tabular-nums',
      ...(gradient
        ? {
            background: `linear-gradient(135deg, ${VF.mintDark}, ${VF.navy})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
          }
        : { color: VF.navy }),
    }}
  >
    {children}
  </span>
);