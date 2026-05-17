import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';
import { ACQUIRER_SCHEDULE, fmtBRLFromReais } from '../mocks/reconciliationAutomatedMocks';

const ACQUIRER_COLORS = {
  Cielo:  { bg: 'linear-gradient(135deg, #0066B3 0%, #003C68 100%)', light: '#E6F0F8' },
  Stone:  { bg: 'linear-gradient(135deg, #00A868 0%, #007349 100%)', light: '#E0F4EC' },
  Rede:   { bg: 'linear-gradient(135deg, #CC092F 0%, #8F0620 100%)', light: '#FBE6EA' },
  Getnet: { bg: 'linear-gradient(135deg, #EC008C 0%, #A30062 100%)', light: '#FCE6F3' },
};

export default function ReconScheduleView() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14,
    }}>
      {ACQUIRER_SCHEDULE.map(s => {
        const isLate = s.status === 'late';
        const statusColor = isLate ? '#B45309' : '#007A5C';
        const statusBg = isLate ? '#FEF3C7' : '#E0F8F1';
        const StatusIcon = isLate ? AlertCircle : CheckCircle2;
        const acq = ACQUIRER_COLORS[s.acquirer] || { bg: 'linear-gradient(135deg, #64748B 0%, #334155 100%)', light: '#F1F5F9' };

        return (
          <div key={s.acquirer} style={{
            position: 'relative',
            padding: 18,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderTop: `3px solid ${statusColor}`,
            borderRadius: 14,
            boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
            overflow: 'hidden',
          }}>
            {/* Avatar + nome + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: acq.bg, color: '#fff',
                display: 'grid', placeItems: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: 16, fontWeight: 800,
                letterSpacing: '-0.02em',
                boxShadow: '0 4px 12px -4px rgba(0,0,0,0.25)',
                flexShrink: 0,
              }}>
                {s.acquirer.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.012em' }}>
                  {s.acquirer}
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  marginTop: 4,
                  padding: '3px 9px', borderRadius: 999,
                  background: statusBg, color: statusColor,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  border: `1px solid ${statusColor}33`,
                }}>
                  <StatusIcon size={10} strokeWidth={2.5} />
                  {isLate ? 'Atrasado' : 'No prazo'}
                </span>
              </div>
            </div>

            {/* Esperado vs recebido */}
            <div style={{
              padding: '12px 14px',
              background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
              border: '1px solid #E2E8F0',
              borderRadius: 10, marginBottom: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, color: '#64748B', fontWeight: 600,
                }}>
                  <Clock size={11} strokeWidth={2} />
                  Esperado
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13, fontWeight: 700, color: '#0F172A',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {s.file_expected}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                  Último recebido
                </span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13, fontWeight: 700, color: statusColor,
                  fontVariantNumeric: 'tabular-nums',
                }}>{s.last_received}</span>
              </div>
            </div>

            {/* Próxima liquidação */}
            <div style={{
              position: 'relative',
              padding: '14px 16px',
              background: 'linear-gradient(135deg, #E0F8F1 0%, #B4FCE8 100%)',
              border: '1px solid rgba(0,193,148,0.32)',
              borderRadius: 10,
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', right: -30, top: -30, width: 100, height: 100,
                background: 'radial-gradient(closest-side, rgba(92,247,207,0.32), transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Calendar size={11} strokeWidth={2.2} style={{ color: '#007A5C' }} />
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.14em',
                    color: '#007A5C',
                  }}>PRÓXIMA LIQUIDAÇÃO</span>
                </div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12, color: '#1E293B',
                  fontWeight: 600, marginBottom: 4,
                }}>{s.next_settlement}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 22, fontWeight: 800,
                    color: '#007A5C',
                    letterSpacing: '-0.025em',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}>{fmtBRLFromReais(s.next_settlement_value)}</div>
                  <TrendingUp size={14} strokeWidth={2.2} style={{ color: '#007A5C' }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}