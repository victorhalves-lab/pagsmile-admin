import React from 'react';
import { Zap, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AUTO_RETRY_ROUTERS } from '../mocks/recoveryAgentMocks';

export default function RecoveryAutoRetryView() {
  const enabled = AUTO_RETRY_ROUTERS.filter(r => r.enabled);
  const totalRetries = enabled.reduce((s, r) => s + r.used_for, 0);
  const avgSuccess = enabled.length
    ? enabled.reduce((s, r) => s + r.success_rate * r.used_for, 0) / totalRetries
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero info navy + glow */}
      <div style={{
        position: 'relative',
        padding: '20px 22px',
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
            <Zap size={22} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#5CF7CF',
            }}>AUTO-RETRY SILENCIOSO</span>
            <h3 style={{
              fontSize: 18, fontWeight: 800, color: '#fff',
              marginTop: 4, marginBottom: 6, letterSpacing: '-0.018em',
              lineHeight: 1.25,
            }}>
              {totalRetries} retries automáticos com {avgSuccess.toFixed(0)}% de sucesso
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', margin: 0, lineHeight: 1.5 }}>
              Cliente NÃO recebe mensagem. Agente reprocessa em roteador alternativo após timeout/erro técnico do emissor.
            </p>
          </div>
        </div>
      </div>

      {/* Roteadores */}
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
          }}>ROTEADORES ALTERNATIVOS</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
            Performance de cada adquirente no retry inteligente
          </div>
        </div>
        <div>
          {AUTO_RETRY_ROUTERS.map((r, idx) => {
            const isLast = idx === AUTO_RETRY_ROUTERS.length - 1;
            return (
              <div key={r.id} style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 100px 100px 100px',
                gap: 14, alignItems: 'center',
                padding: '14px 18px',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                opacity: r.enabled ? 1 : 0.55,
                borderLeft: r.enabled ? '3px solid #00C194' : '3px solid #CBD5E1',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: r.enabled
                    ? 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)'
                    : '#F1F5F9',
                  color: r.enabled ? '#fff' : '#94A3B8',
                  display: 'grid', placeItems: 'center',
                  boxShadow: r.enabled ? '0 4px 10px -2px rgba(0,193,148,0.32)' : 'none',
                }}>
                  <Activity size={15} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                    {r.name}
                  </div>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    marginTop: 4,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 999,
                    background: r.enabled ? '#E0F8F1' : '#F1F5F9',
                    color: r.enabled ? '#007A5C' : '#94A3B8',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    border: `1px solid ${r.enabled ? 'rgba(0,193,148,0.32)' : '#E2E8F0'}`,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: r.enabled ? '#00C194' : '#94A3B8',
                    }} />
                    {r.enabled ? 'ativo' : 'desativado'}
                  </span>
                </div>
                <MetricCol label="sucesso" value={`${r.success_rate}%`} color="#007A5C" />
                <MetricCol label="latência" value={`${r.latency_ms}ms`} color="#0F172A" />
                <MetricCol label="retries" value={r.used_for} color="#0F172A" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow visual */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#007A5C',
          }}>FLUXO AUTOMÁTICO</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
            O que o agente faz quando detecta timeout/erro técnico
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Recusa código 91', tone: 'danger' },
            { label: 'Aguarda 2h', tone: 'warn' },
            { label: 'Outro adquirente', tone: 'info' },
            { label: 'Aprovado?', tone: 'info' },
            { label: 'Notifica merchant', tone: 'success' },
          ].map((step, i, arr) => {
            const toneStyles = {
              danger:  { bg: 'linear-gradient(180deg, #FEE2E2 0%, #FEF2F2 100%)', border: 'rgba(185,28,28,0.32)', color: '#B91C1C' },
              warn:    { bg: 'linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)', border: 'rgba(180,83,9,0.32)',  color: '#B45309' },
              info:    { bg: 'linear-gradient(180deg, #E6ECF2 0%, #F4F7FA 100%)', border: 'rgba(0,36,67,0.22)',   color: '#002443' },
              success: { bg: 'linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)', border: 'rgba(0,193,148,0.32)', color: '#007A5C' },
            }[step.tone];
            return (
              <React.Fragment key={i}>
                <div style={{
                  padding: '10px 14px',
                  background: toneStyles.bg,
                  border: `1px solid ${toneStyles.border}`,
                  borderRadius: 10,
                  fontSize: 12.5, fontWeight: 700, color: toneStyles.color,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  {i === arr.length - 1 && <CheckCircle2 size={13} strokeWidth={2.2} />}
                  {step.label}
                </div>
                {i < arr.length - 1 && <ArrowRight size={14} strokeWidth={2} style={{ color: '#CBD5E1' }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricCol({ label, value, color }) {
  return (
    <div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 17, fontWeight: 800,
        color, letterSpacing: '-0.012em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: 9.5, color: '#94A3B8', marginTop: 4,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
      }}>{label}</div>
    </div>
  );
}