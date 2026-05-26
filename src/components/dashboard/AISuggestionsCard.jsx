import React, { useState } from 'react';
import { Sparkle, CaretRight, X } from '@phosphor-icons/react';
import { Target, TrendingDown, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * AISuggestionsCard — Pulse VF.
 * Reference card hero V9 dark navy + watermark Sparkle + items priorizados.
 */
export default function AISuggestionsCard({ suggestions = [] }) {
  const [dismissed, setDismissed] = useState([]);

  const defaults = [
    {
      id: 's1', Icon: Target,
      title: 'Aumente aprovação em 3.2pp',
      message: 'Detectei queda na aprovação Mastercard às quintas à noite. Considere ajustar regras de antifraude.',
      action: 'Ver análise', to: createPageUrl('DeclineAnalysis'),
      priority: 'high',
    },
    {
      id: 's2', Icon: TrendingDown,
      title: 'R$ 12.480 em risco de churn',
      message: '47 assinantes têm cartão expirando em 30 dias. Ative Account Updater pra evitar perda.',
      action: 'Ativar', to: createPageUrl('Subscriptions'),
      priority: 'high',
    },
    {
      id: 's3', Icon: Zap,
      title: 'Antecipação com taxa promocional',
      message: 'Você tem R$ 212k em recebíveis. Taxa de antecipação está 18% abaixo do padrão hoje.',
      action: 'Ver oferta', to: createPageUrl('Anticipation'),
      priority: 'medium',
    },
  ];

  const list = (suggestions.length > 0 ? suggestions : defaults).filter(
    (s) => !dismissed.includes(s.id)
  );

  if (list.length === 0) return null;

  const priorityStyle = {
    high:   { leftBorder: '#DC2626', bg: 'rgba(220,38,38,0.06)', iconBg: 'rgba(220,38,38,0.14)', iconBorder: 'rgba(220,38,38,0.35)', iconColor: '#FCA5A5' },
    medium: { leftBorder: '#F59E0B', bg: 'rgba(245,158,11,0.06)', iconBg: 'rgba(245,158,11,0.14)', iconBorder: 'rgba(245,158,11,0.35)', iconColor: '#FDE68A' },
    low:    { leftBorder: '#013766', bg: 'rgba(1,55,102,0.06)', iconBg: 'rgba(92,247,207,0.14)', iconBorder: 'rgba(92,247,207,0.3)', iconColor: '#5CF7CF' },
  };

  return (
    <div
      className="relative h-full overflow-hidden p-5 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, #002443, #001124)',
        color: '#fff',
        border: 0,
        boxShadow: '0 12px 32px -8px rgba(0,36,67,0.55)',
        minHeight: 320,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: -60, right: -40, width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(92,247,207,0.32), transparent 60%)',
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className="relative inline-flex items-center justify-center"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(92,247,207,0.16)',
              color: '#5CF7CF',
              border: '1px solid rgba(92,247,207,0.35)',
            }}
          >
            <Sparkle weight="duotone" size={18} />
            <span
              style={{
                position: 'absolute', top: -2, right: -2,
                width: 8, height: 8, borderRadius: 99,
                background: '#5CF7CF', boxShadow: '0 0 6px #5CF7CF',
                animation: 'pulse 1.5s infinite',
              }}
            />
          </div>
          <div>
            <p
              className="font-mono"
              style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#5CF7CF',
              }}
            >
              DIA Copilot sugere
            </p>
            <p className="font-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
              {list.length} insight{list.length !== 1 ? 's' : ''} ativo{list.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Link
          to={createPageUrl('DIACopilot')}
          className="inline-flex items-center gap-1 font-mono transition-opacity hover:opacity-100"
          style={{
            color: '#5CF7CF', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            textDecoration: 'none', opacity: 0.85,
          }}
        >
          Ver todos
          <CaretRight weight="bold" size={11} />
        </Link>
      </div>

      {/* List */}
      <div className="relative space-y-2.5">
        <AnimatePresence>
          {list.map((s, idx) => {
            const p = priorityStyle[s.priority] || priorityStyle.medium;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderLeft: `3px solid ${p.leftBorder}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="flex-shrink-0 inline-flex items-center justify-center"
                  style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: p.iconBg,
                    border: `1px solid ${p.iconBorder}`,
                    color: p.iconColor,
                  }}
                >
                  {s.Icon && <s.Icon size={16} strokeWidth={2} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', marginTop: 2, lineHeight: 1.4 }}>
                    {s.message}
                  </p>
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-1 mt-2 transition-all hover:-translate-y-px"
                    style={{
                      padding: '5px 11px', borderRadius: 7,
                      background: 'rgba(92,247,207,0.14)', color: '#5CF7CF',
                      border: '1px solid rgba(92,247,207,0.3)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11, fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    {s.action}
                    <CaretRight weight="bold" size={10} />
                  </Link>
                </div>
                <button
                  onClick={() => setDismissed((prev) => [...prev, s.id])}
                  style={{
                    color: 'rgba(255,255,255,0.4)', background: 'transparent',
                    border: 0, cursor: 'pointer', padding: 4, flexShrink: 0,
                  }}
                  aria-label="Dispensar"
                >
                  <X weight="bold" size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}