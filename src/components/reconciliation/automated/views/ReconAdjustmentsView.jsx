import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, FileSignature } from 'lucide-react';
import { PROPOSED_ADJUSTMENTS, fmtBRL } from '../mocks/reconciliationAutomatedMocks';

/**
 * Card de ajuste contábil com diagrama débito → crédito visual,
 * confidence ring, justificativa do agente e botões aprovar/rejeitar.
 */
export default function ReconAdjustmentsView() {
  const totalAmount = PROPOSED_ADJUSTMENTS.reduce((s, a) => s + a.amount, 0);
  const avgConfidence = Math.round(PROPOSED_ADJUSTMENTS.reduce((s, a) => s + a.confidence, 0) / PROPOSED_ADJUSTMENTS.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Banner hero do Communicator Agent */}
      <div style={{
        position: 'relative',
        padding: '18px 20px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
        border: '1px solid rgba(92,247,207,0.22)',
        overflow: 'hidden',
        color: '#fff',
      }}>
        <div style={{
          position: 'absolute', right: -90, top: -90, width: 280, height: 280,
          background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
            color: '#002443',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 24px -4px rgba(92,247,207,0.45)',
            flexShrink: 0,
          }}>
            <FileSignature size={22} strokeWidth={2} />
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#5CF7CF',
              marginBottom: 4,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Sparkles size={11} strokeWidth={2.5} />
              AJUSTES CONTÁBEIS PROPOSTOS · COMMUNICATOR AGENT
            </div>
            <div style={{
              fontSize: 18, fontWeight: 800,
              letterSpacing: '-0.018em', color: '#fff',
              lineHeight: 1.25,
            }}>
              {PROPOSED_ADJUSTMENTS.length} propostas aguardando sua aprovação
            </div>
          </div>

          {/* KPIs mini */}
          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.62)', marginBottom: 4,
              }}>VALOR TOTAL</div>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
                color: '#fff', letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>{fmtBRL(totalAmount)}</div>
            </div>
            <div>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.62)', marginBottom: 4,
              }}>CONFIANÇA MÉDIA</div>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
                color: '#5CF7CF', letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}>{avgConfidence}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de ajustes */}
      {PROPOSED_ADJUSTMENTS.map(adj => {
        const conf = adj.confidence;
        const confColor = conf >= 95 ? '#007A5C' : conf >= 85 ? '#B45309' : '#B91C1C';
        const confBg = conf >= 95 ? '#E0F8F1' : conf >= 85 ? '#FEF3C7' : '#FEE2E2';

        return (
          <div key={adj.id} style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
            transition: 'box-shadow .2s, border-color .2s',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
              flexWrap: 'wrap',
            }}>
              <code style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 800,
                color: '#0F172A',
                background: '#F1F5F9',
                padding: '3px 8px', borderRadius: 6,
                letterSpacing: '-0.01em',
              }}>{adj.id}</code>
              <span style={{ fontSize: 12, color: '#CBD5E1' }}>·</span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600,
                color: '#64748B',
              }}>{adj.divergence_id}</span>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Confidence ring (CSS conic-gradient) */}
                <div style={{ position: 'relative', width: 40, height: 40 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: `conic-gradient(${confColor} ${conf * 3.6}deg, #F1F5F9 0deg)`,
                    display: 'grid', placeItems: 'center',
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: '#FFFFFF',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 10, fontWeight: 800,
                      color: confColor,
                    }}>{conf}</div>
                  </div>
                </div>
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#94A3B8',
                  }}>CONFIANÇA</div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: confColor,
                  }}>
                    {conf >= 95 ? 'Alta' : conf >= 85 ? 'Boa' : 'Revisar'}
                  </div>
                </div>
              </div>
            </div>

            {/* Diagrama débito → crédito */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 40px 1fr auto',
              gap: 14, alignItems: 'center',
              marginBottom: 16,
            }}>
              {/* Débito */}
              <div style={{
                position: 'relative',
                padding: '14px 16px',
                background: 'linear-gradient(180deg, #FEE2E2 0%, #FEF2F2 100%)',
                border: '1px solid rgba(185,28,28,0.22)',
                borderRadius: 12,
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                  color: '#B91C1C', marginBottom: 6,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#B91C1C' }} />
                  DÉBITO
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>
                  {adj.debit_account}
                </div>
              </div>

              {/* Seta */}
              <div style={{
                display: 'grid', placeItems: 'center',
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1ECB9D 0%, #00C194 100%)',
                color: '#fff', margin: '0 auto',
                boxShadow: '0 4px 12px -2px rgba(0,193,148,0.4)',
              }}>
                <ArrowRight size={18} strokeWidth={2.5} />
              </div>

              {/* Crédito */}
              <div style={{
                padding: '14px 16px',
                background: 'linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)',
                border: '1px solid rgba(0,193,148,0.32)',
                borderRadius: 12,
              }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                  color: '#007A5C', marginBottom: 6,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00C194' }} />
                  CRÉDITO
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>
                  {adj.credit_account}
                </div>
              </div>

              {/* Valor */}
              <div style={{ textAlign: 'right', minWidth: 110 }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 26, fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.025em',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}>{fmtBRL(adj.amount)}</div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase', letterSpacing: '0.14em',
                  marginTop: 4,
                }}>
                  valor
                </div>
              </div>
            </div>

            {/* Justificativa */}
            <div style={{
              padding: '12px 14px',
              background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
              border: '1px solid #E2E8F0',
              borderRadius: 12,
              marginBottom: 16,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                color: '#007A5C', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Sparkles size={10} strokeWidth={2.5} />
                JUSTIFICATIVA · COMMUNICATOR AGENT
              </div>
              <div style={{ fontSize: 13, color: '#1E293B', lineHeight: 1.55 }}>
                {adj.rationale}
              </div>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 36, padding: '0 16px', borderRadius: 10,
                background: '#FFFFFF',
                border: '1px solid rgba(185,28,28,0.32)',
                color: '#B91C1C',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                transition: 'background .14s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; }}
              >
                <XCircle size={14} strokeWidth={2} />
                Rejeitar
              </button>
              <button type="button" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 36, padding: '0 18px', borderRadius: 10,
                background: 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)',
                color: '#fff',
                border: '1px solid #009E78',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,193,148,0.18), 0 6px 18px -3px rgba(0,193,148,0.42)',
              }}>
                <CheckCircle2 size={14} strokeWidth={2.2} />
                Aprovar ajuste
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}