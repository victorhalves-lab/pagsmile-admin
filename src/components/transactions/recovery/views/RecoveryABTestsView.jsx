import React from 'react';
import { Beaker, TrendingUp, Award, Plus } from 'lucide-react';

const AB_TESTS = [
  {
    id: 'ab1',
    name: 'Saldo Insuficiente · variante "PIX com desconto"',
    reason_code: '51',
    status: 'running',
    days_running: 8,
    sample_a: 412,
    sample_b: 398,
    rate_a: 58,
    rate_b: 71,
    confidence: 96,
    winner: 'b',
  },
  {
    id: 'ab2',
    name: 'CVV inválido · variante "tom informal com emoji"',
    reason_code: 'N7',
    status: 'running',
    days_running: 4,
    sample_a: 124,
    sample_b: 119,
    rate_a: 54,
    rate_b: 58,
    confidence: 62,
    winner: null,
  },
  {
    id: 'ab3',
    name: 'Bloqueio antifraude · script encurtado (ligação)',
    reason_code: 'FR',
    status: 'running',
    days_running: 12,
    sample_a: 22,
    sample_b: 21,
    rate_a: 36,
    rate_b: 48,
    confidence: 78,
    winner: 'b',
  },
];

function Variant({ label, sample, rate, isWinner }) {
  return (
    <div style={{
      position: 'relative',
      padding: '14px 16px',
      background: isWinner
        ? 'linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)'
        : 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      border: isWinner ? '1px solid rgba(0,193,148,0.42)' : '1px solid #E2E8F0',
      borderRadius: 12,
      boxShadow: isWinner ? '0 4px 12px -3px rgba(0,193,148,0.22)' : 'none',
    }}>
      {isWinner && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 24, height: 24, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)',
          color: '#fff',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 3px 8px -1px rgba(0,193,148,0.42)',
        }}>
          <Award size={12} strokeWidth={2.2} />
        </div>
      )}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: isWinner ? '#007A5C' : '#94A3B8',
      }}>{label}</div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 800,
        color: isWinner ? '#007A5C' : '#0F172A',
        letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums',
        marginTop: 4, lineHeight: 1,
      }}>{rate}%</div>
      <div style={{
        fontSize: 11, color: '#64748B', marginTop: 4,
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        {sample.toLocaleString('pt-BR')} amostras
      </div>
    </div>
  );
}

export default function RecoveryABTestsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        padding: '18px 20px',
        background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
        border: '1px solid rgba(92,247,207,0.22)',
        borderRadius: 16,
        overflow: 'hidden',
        color: '#fff',
      }}>
        <div style={{
          position: 'absolute', right: -90, top: -90, width: 280, height: 280,
          background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
            color: '#002443',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 20px -4px rgba(92,247,207,0.45)',
            flexShrink: 0,
          }}>
            <Beaker size={20} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#5CF7CF',
            }}>A/B TESTS ATIVOS</span>
            <h3 style={{
              fontSize: 17, fontWeight: 800, color: '#fff',
              marginTop: 4, margin: 0, letterSpacing: '-0.018em',
              lineHeight: 1.3,
            }}>
              3 testes em andamento · 1 com vencedor consolidado
            </h3>
          </div>
          <button type="button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 36, padding: '0 16px', borderRadius: 10,
            background: '#FFFFFF',
            border: '1px solid rgba(92,247,207,0.32)',
            fontSize: 12.5, fontWeight: 700, color: '#002443',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 12px -2px rgba(92,247,207,0.32)',
          }}>
            <Plus size={13} strokeWidth={2.2} />
            Novo teste
          </button>
        </div>
      </div>

      {AB_TESTS.map(t => (
        <div key={t.id} style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          padding: 20,
          boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <code style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 800,
              color: '#475569', background: '#F1F5F9',
              padding: '3px 7px', borderRadius: 5,
              letterSpacing: '0.04em',
            }}>{t.reason_code}</code>
            <span style={{
              fontSize: 14, fontWeight: 700, color: '#0F172A',
              flex: 1, minWidth: 220, letterSpacing: '-0.012em',
            }}>
              {t.name}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 9px', borderRadius: 999,
              background: '#F1F5F9', color: '#475569',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: '1px solid #E2E8F0',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#00C194',
                animation: 'abt-pulse 1.6s ease-in-out infinite',
              }} />
              {t.days_running}d rodando
            </span>
          </div>

          {/* Variantes + confiança */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 12 }}>
            <Variant label="A · controle" sample={t.sample_a} rate={t.rate_a} isWinner={t.winner === 'a'} />
            <Variant label="B · variante" sample={t.sample_b} rate={t.rate_b} isWinner={t.winner === 'b'} />

            {/* Confidence ring */}
            <div style={{
              padding: '14px 16px',
              background: t.confidence >= 95
                ? 'linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)'
                : 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
              border: t.confidence >= 95 ? '1px solid rgba(0,193,148,0.32)' : '1px solid #E2E8F0',
              borderRadius: 12,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 6,
            }}>
              <div style={{ position: 'relative', width: 56, height: 56 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: `conic-gradient(${t.confidence >= 95 ? '#007A5C' : t.confidence >= 80 ? '#B45309' : '#94A3B8'} ${t.confidence * 3.6}deg, #F1F5F9 0deg)`,
                  display: 'grid', placeItems: 'center',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: '#FFFFFF',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14, fontWeight: 800,
                    color: t.confidence >= 95 ? '#007A5C' : t.confidence >= 80 ? '#B45309' : '#475569',
                    letterSpacing: '-0.025em',
                  }}>{t.confidence}%</div>
                </div>
              </div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: '#64748B',
              }}>CONFIANÇA</div>
            </div>
          </div>

          {/* CTA promover */}
          {t.winner === 'b' && t.confidence >= 95 && (
            <div style={{
              marginTop: 14,
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #E0F8F1 0%, #B4FCE8 100%)',
              border: '1px solid rgba(0,193,148,0.42)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)',
                color: '#fff',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 4px 10px -2px rgba(0,193,148,0.42)',
                flexShrink: 0,
              }}>
                <TrendingUp size={14} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 600, flex: 1, minWidth: 220, lineHeight: 1.5 }}>
                Variante <strong>B venceu</strong> com <strong style={{ color: '#007A5C', fontFamily: 'JetBrains Mono, monospace' }}>{t.confidence}%</strong> de confiança. Promover para regra principal?
              </span>
              <button type="button" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 32, padding: '0 16px', borderRadius: 10,
                background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
                color: '#fff', border: '1px solid #009E78',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px -2px rgba(0,193,148,0.42)',
              }}>
                Promover B
              </button>
            </div>
          )}
        </div>
      ))}

      <style>{`
        @keyframes abt-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}