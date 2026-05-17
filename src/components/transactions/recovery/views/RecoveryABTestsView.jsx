import React from 'react';
import { Beaker, TrendingUp, Award } from 'lucide-react';

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

export default function RecoveryABTestsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="v8-card" style={{
        padding: 16,
        background: 'var(--grad-hero)',
        borderColor: 'var(--v8-bd-brand)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--pag-mint-500)', color: '#fff',
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Beaker size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="v8-eyebrow">A/B TESTS ATIVOS</span>
            <h3 style={{
              fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
              marginTop: 2, margin: 0,
            }}>
              3 testes em andamento · 1 com vencedor consolidado
            </h3>
          </div>
          <button
            type="button"
            style={{
              height: 34, padding: '0 16px', borderRadius: 10,
              background: 'var(--v8-bg-surface)',
              border: '1px solid var(--v8-bd-default)',
              fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)', cursor: 'pointer',
            }}
          >
            + Novo teste
          </button>
        </div>
      </div>

      {AB_TESTS.map(t => (
        <div key={t.id} className="v8-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <code style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
              color: 'var(--v8-fg-muted)',
              background: 'var(--v8-bg-surface-3)',
              padding: '2px 6px', borderRadius: 4,
            }}>{t.reason_code}</code>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', flex: 1, minWidth: 200 }}>
              {t.name}
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              color: 'var(--v8-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
            }}>
              {t.days_running}d rodando
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 130px', gap: 12 }}>
            <Variant label="A · controle" sample={t.sample_a} rate={t.rate_a} isWinner={t.winner === 'a'} />
            <Variant label="B · variante" sample={t.sample_b} rate={t.rate_b} isWinner={t.winner === 'b'} />
            <div style={{
              padding: '12px 14px',
              background: t.confidence >= 95 ? 'var(--pag-mint-50)' : 'var(--v8-bg-surface-2)',
              border: `1px solid ${t.confidence >= 95 ? 'var(--v8-bd-brand)' : 'var(--v8-bd-default)'}`,
              borderRadius: 10, textAlign: 'center',
            }}>
              <div className="v8-num" style={{
                fontSize: 22, fontWeight: 700,
                color: t.confidence >= 95 ? 'var(--pag-mint-700)' : 'var(--v8-fg-strong)',
                letterSpacing: 'var(--tr-tighter)',
              }}>{t.confidence}%</div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: 'var(--v8-fg-muted)', fontWeight: 700, marginTop: 4,
              }}>confiança</div>
            </div>
          </div>

          {t.winner === 'b' && t.confidence >= 95 && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: 'var(--pag-mint-50)',
              border: '1px solid var(--v8-bd-brand)', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            }}>
              <TrendingUp size={14} style={{ color: 'var(--pag-mint-700)' }} />
              <span style={{ fontSize: 12, color: 'var(--v8-fg-strong)', fontWeight: 600, flex: 1, minWidth: 200 }}>
                Variante B venceu com {t.confidence}% de confiança. Promover para regra principal?
              </span>
              <button type="button" style={{
                height: 28, padding: '0 14px', borderRadius: 8,
                background: 'var(--pag-mint-500)', color: '#fff',
                border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>
                Promover B
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Variant({ label, sample, rate, isWinner }) {
  return (
    <div style={{
      padding: '12px 14px',
      background: isWinner ? 'var(--pag-mint-50)' : 'var(--v8-bg-surface-2)',
      border: `1px solid ${isWinner ? 'var(--v8-bd-brand)' : 'var(--v8-bd-default)'}`,
      borderRadius: 10,
      position: 'relative',
    }}>
      {isWinner && (
        <Award size={14} style={{
          position: 'absolute', top: 8, right: 8,
          color: 'var(--pag-mint-700)',
        }} />
      )}
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: isWinner ? 'var(--pag-mint-700)' : 'var(--v8-fg-muted)',
        fontWeight: 700,
      }}>{label}</div>
      <div className="v8-num" style={{
        fontSize: 22, fontWeight: 700, marginTop: 4,
        color: isWinner ? 'var(--pag-mint-700)' : 'var(--v8-fg-strong)',
        letterSpacing: 'var(--tr-tighter)',
      }}>{rate}%</div>
      <div style={{ fontSize: 10, color: 'var(--v8-fg-muted)', marginTop: 2 }}>
        {sample} amostras
      </div>
    </div>
  );
}