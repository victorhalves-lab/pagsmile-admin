import React from 'react';
import { Banknote, Clock, CheckCircle2, AlertCircle, ArrowUpFromLine } from 'lucide-react';
import { LIQUIDACOES, SAQUES, fmtBRLShort } from '../mocks/myReconciliationMocks';

const STATUS_LIQUID = {
  on_time:   { label: 'No prazo',   color: '#007A5C', bg: '#E0F8F1', icon: CheckCircle2 },
  late_1d:   { label: 'Atrasado 1d', color: '#B45309', bg: '#FEF3C7', icon: AlertCircle },
  pending:   { label: 'Pendente',   color: '#B45309', bg: '#FEF3C7', icon: Clock },
  scheduled: { label: 'Agendado',   color: '#013766', bg: '#E6ECF2', icon: Clock },
};

const STATUS_SAQUE = {
  creditado: { label: 'Creditado', color: '#007A5C', bg: '#E0F8F1', icon: CheckCircle2 },
  pendente:  { label: 'Pendente',  color: '#B91C1C', bg: '#FEE2E2', icon: AlertCircle },
};

export default function MyReconSettlementsView() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 16,
    }}>
      {/* Liquidações */}
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
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)',
            color: '#fff',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 10px -2px rgba(0,193,148,0.32)',
          }}>
            <Banknote size={16} strokeWidth={2} />
          </div>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>LIQUIDAÇÕES</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2, letterSpacing: '-0.012em' }}>
              Previsto vs realizado
            </div>
          </div>
        </div>

        <div>
          {LIQUIDACOES.map((l, idx) => {
            const meta = STATUS_LIQUID[l.status];
            const StIcon = meta.icon;
            const isLast = idx === LIQUIDACOES.length - 1;
            return (
              <div key={l.id} style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr auto auto',
                gap: 12, alignItems: 'center',
                padding: '14px 18px',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                borderLeft: `3px solid ${meta.color}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: meta.bg, color: meta.color,
                  display: 'grid', placeItems: 'center',
                }}>
                  <StIcon size={15} strokeWidth={2} />
                </div>
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                    color: '#0F172A',
                  }}>
                    Prevista {l.data_prevista}
                    {l.data_realizada && l.data_realizada !== l.data_prevista && (
                      <span style={{ color: '#B45309' }}> · Realizada {l.data_realizada}</span>
                    )}
                    {l.data_realizada === l.data_prevista && (
                      <span style={{ color: '#007A5C' }}> · No prazo</span>
                    )}
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    marginTop: 4,
                    padding: '2px 8px', borderRadius: 999,
                    background: meta.bg, color: meta.color,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: `1px solid ${meta.color}33`,
                  }}>{meta.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em',
                  }}>previsto</div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
                    color: '#475569', fontVariantNumeric: 'tabular-nums',
                  }}>{fmtBRLShort(l.valor_previsto)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    color: '#007A5C', textTransform: 'uppercase', letterSpacing: '0.12em',
                  }}>realizado</div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 800,
                    color: l.valor_realizado > 0 ? '#0F172A' : '#CBD5E1',
                    letterSpacing: '-0.018em', fontVariantNumeric: 'tabular-nums',
                  }}>{l.valor_realizado > 0 ? fmtBRLShort(l.valor_realizado) : '-'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saques */}
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
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #013766 0%, #002443 100%)',
            color: '#fff',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 4px 10px -2px rgba(0,36,67,0.32)',
          }}>
            <ArrowUpFromLine size={16} strokeWidth={2} />
          </div>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>SAQUES</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 2, letterSpacing: '-0.012em' }}>
              Solicitado vs creditado no banco
            </div>
          </div>
        </div>

        <div>
          {SAQUES.map((s, idx) => {
            const meta = STATUS_SAQUE[s.status];
            const StIcon = meta.icon;
            const isLast = idx === SAQUES.length - 1;
            return (
              <div key={s.id} style={{
                padding: '14px 18px',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                borderLeft: `3px solid ${meta.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 9px', borderRadius: 999,
                      background: meta.bg, color: meta.color,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      border: `1px solid ${meta.color}33`,
                    }}>
                      <StIcon size={10} strokeWidth={2.5} />
                      {meta.label}
                    </span>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, fontWeight: 700,
                      color: '#475569', background: '#F1F5F9',
                      padding: '2px 6px', borderRadius: 4,
                    }}>{s.id}</code>
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 800,
                    color: '#0F172A', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                  }}>{fmtBRLShort(s.valor)}</div>
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  <strong>Solicitado:</strong> {s.solicitado_em} · <strong>Destino:</strong> {s.banco_destino}
                </div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                  <strong>Creditado:</strong>{' '}
                  {s.creditado_em
                    ? <span style={{ color: '#007A5C', fontWeight: 700 }}>{s.creditado_em}</span>
                    : <span style={{ color: '#B91C1C', fontWeight: 700 }}>Ainda não creditado</span>
                  }
                  {' · Tarifa: '}<span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{fmtBRLShort(s.tarifa)}</span>
                </div>
                {s.alerta && (
                  <div style={{
                    marginTop: 8, padding: '8px 12px',
                    background: '#FEE2E2', border: '1px solid rgba(185,28,28,0.32)',
                    borderRadius: 8,
                    fontSize: 11.5, color: '#B91C1C', fontWeight: 600, lineHeight: 1.5,
                  }}>
                    {s.alerta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}