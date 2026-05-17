import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { TAXAS_AUDITORIA, fmtBRL, fmtPct } from '../mocks/myReconciliationMocks';

const STATUS_META = {
  match:      { label: 'Conforme contrato',     color: '#007A5C', bg: '#E0F8F1', icon: CheckCircle2 },
  overcharge: { label: 'Cobrado acima',         color: '#B91C1C', bg: '#FEE2E2', icon: AlertCircle },
  unexpected: { label: 'Tarifa não prevista',   color: '#B45309', bg: '#FEF3C7', icon: AlertCircle },
};

export default function MyReconFeesView() {
  const totalRecovery = TAXAS_AUDITORIA
    .filter(t => t.expected_recovery)
    .reduce((s, t) => s + t.expected_recovery, 0);
  const overchargeCount = TAXAS_AUDITORIA.filter(t => t.status !== 'match').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero auditor */}
      <div style={{
        position: 'relative',
        padding: '18px 22px',
        background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
        border: '1px solid rgba(92,247,207,0.22)',
        borderRadius: 16, overflow: 'hidden', color: '#fff',
      }}>
        <div style={{
          position: 'absolute', right: -100, top: -100, width: 320, height: 320,
          background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
            color: '#002443',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 20px -4px rgba(92,247,207,0.45)',
          }}>
            <Sparkles size={20} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#5CF7CF',
            }}>AUDITOR DE TAXAS</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 4, letterSpacing: '-0.018em' }}>
              {overchargeCount > 0
                ? `${overchargeCount} categorias com cobrança acima do contrato`
                : 'Todas as taxas dentro do contrato'}
            </div>
          </div>
          {totalRecovery > 0 && (
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.62)', marginBottom: 4,
              }}>VALOR A RECUPERAR</div>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 800,
                color: '#FBBF24', letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
              }}>{fmtBRL(totalRecovery)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Lista de categorias */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{
          padding: '14px 18px',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>AUDITORIA POR CATEGORIA</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
            Contrato vs cobrado, por tipo de taxa
          </div>
        </div>

        <div>
          {TAXAS_AUDITORIA.map((t, idx) => {
            const meta = STATUS_META[t.status];
            const StIcon = meta.icon;
            const isLast = idx === TAXAS_AUDITORIA.length - 1;
            const overcharge = t.delta > 0;

            return (
              <div key={t.id} style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 1.5fr) 130px 130px 130px auto',
                gap: 16, alignItems: 'center',
                padding: '14px 18px',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                borderLeft: `3px solid ${meta.color}`,
                transition: 'background .14s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>
                    {t.categoria}
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    color: '#64748B', marginTop: 2,
                  }}>
                    Volume: {typeof t.volume === 'number' && t.volume > 100 ? fmtBRL(t.volume) : `${t.volume} ocorrências`}
                  </div>
                </div>

                <ColCompare
                  label="Contratado"
                  value={t.contratado_pct !== undefined ? fmtPct(t.contratado_pct) : fmtBRL(t.contratado_fixo)}
                  color="#475569"
                />
                <ColCompare
                  label="Cobrado"
                  value={t.cobrado_pct !== undefined ? fmtPct(t.cobrado_pct) : fmtBRL(t.cobrado_fixo)}
                  color={overcharge ? '#B91C1C' : '#0F172A'}
                />

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 800,
                    color: t.delta === 0 ? '#94A3B8' : t.delta > 0 ? '#B91C1C' : '#007A5C',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.018em',
                  }}>
                    {t.delta === 0 ? '—' : `${t.delta > 0 ? '+' : ''}${fmtBRL(t.delta)}`}
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2,
                  }}>delta</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 999,
                    background: meta.bg, color: meta.color,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: `1px solid ${meta.color}33`,
                  }}>
                    <StIcon size={10} strokeWidth={2.5} />
                    {meta.label}
                  </span>
                  {t.expected_recovery && (
                    <button type="button" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 8,
                      background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
                      color: '#fff', border: '1px solid #009E78',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 3px 8px -2px rgba(0,193,148,0.42)',
                    }}>
                      <FileText size={11} strokeWidth={2.2} />
                      Contestar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ColCompare({ label, value, color }) {
  return (
    <div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
        color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em',
        marginBottom: 3,
      }}>{label}</div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 800,
        color, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.012em',
      }}>{value}</div>
    </div>
  );
}