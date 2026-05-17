import React from 'react';
import { Eye, Download, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { RECON_FILES, fmtBRLFromReais } from '../mocks/reconciliationAutomatedMocks';

const STATUS_META = {
  completed: { label: 'Completo', color: '#007A5C', bg: '#E0F8F1', borderColor: 'rgba(0,193,148,0.32)', icon: CheckCircle2 },
  review:    { label: 'Em revisão', color: '#B45309', bg: '#FEF3C7', borderColor: 'rgba(180,83,9,0.32)', icon: AlertCircle },
  parsing:   { label: 'Processando', color: '#002443', bg: '#E6ECF2', borderColor: 'rgba(0,36,67,0.22)', icon: Loader2 },
};

const ACQUIRER_COLORS = {
  Cielo:  { bg: 'linear-gradient(135deg, #0066B3 0%, #003C68 100%)', light: '#E6F0F8' },
  Stone:  { bg: 'linear-gradient(135deg, #00A868 0%, #007349 100%)', light: '#E0F4EC' },
  Rede:   { bg: 'linear-gradient(135deg, #CC092F 0%, #8F0620 100%)', light: '#FBE6EA' },
  Getnet: { bg: 'linear-gradient(135deg, #EC008C 0%, #A30062 100%)', light: '#FCE6F3' },
};

const FORMAT_COLORS = {
  cnab240: { color: '#007A5C', bg: '#E0F8F1' },
  cnab444: { color: '#B45309', bg: '#FEF3C7' },
  edi:     { color: '#002443', bg: '#E6ECF2' },
};

export default function ReconFilesView() {
  const totalRecords = RECON_FILES.reduce((s, f) => s + f.records, 0);
  const totalDivergent = RECON_FILES.reduce((s, f) => s + f.divergent, 0);
  const totalDivergentValue = RECON_FILES.reduce((s, f) => s + f.divergent_value, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header com KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
      }}>
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
          color: '#fff', position: 'relative', overflow: 'hidden',
          border: '1px solid rgba(92,247,207,0.22)',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 140, height: 140,
            background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.62)', marginBottom: 6,
            position: 'relative', zIndex: 2,
          }}>
            ARQUIVOS · ÚLTIMOS DIAS
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 800,
            letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
            position: 'relative', zIndex: 2,
          }}>
            {RECON_FILES.length}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2, position: 'relative', zIndex: 2 }}>
            recebidos
          </div>
        </div>

        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'linear-gradient(135deg, #00C194 0%, #007A5C 100%)',
          color: '#fff', border: '1px solid transparent',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.82)', marginBottom: 6,
          }}>
            REGISTROS PROCESSADOS
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 800,
            letterSpacing: '-0.025em', fontVariantNumeric: 'tabular-nums',
          }}>
            {totalRecords.toLocaleString('pt-BR')}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', marginTop: 2 }}>
            transações conferidas
          </div>
        </div>

        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: '#FFFFFF',
          borderTop: '3px solid #B45309',
          border: '1px solid #E2E8F0',
          borderTopWidth: 3, borderTopColor: '#B45309',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#B45309', marginBottom: 6,
          }}>
            DIVERGENTES
          </div>
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 800,
            color: '#0F172A', letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {totalDivergent}
          </div>
          <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
            {fmtBRLFromReais(totalDivergentValue)} em jogo
          </div>
        </div>
      </div>

      {/* Lista de arquivos como cards */}
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
          }}>
            ARQUIVOS RECEBIDOS
          </span>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginTop: 4, letterSpacing: '-0.012em' }}>
            Detalhamento por arquivo, com taxa de conciliação visual
          </div>
        </div>

        <div>
          {RECON_FILES.map((f, idx) => {
            const st = STATUS_META[f.status];
            const StIcon = st.icon;
            const acq = ACQUIRER_COLORS[f.acquirer] || { bg: 'linear-gradient(135deg, #64748B 0%, #334155 100%)', light: '#F1F5F9' };
            const fmt = FORMAT_COLORS[f.format] || { color: '#64748B', bg: '#F4F4F4' };
            const matchRate = (f.conciliated / f.records) * 100;
            const isLast = idx === RECON_FILES.length - 1;

            return (
              <div key={f.id} style={{
                padding: '16px 18px',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                display: 'grid',
                gridTemplateColumns: '52px 1fr auto',
                gap: 16, alignItems: 'center',
                transition: 'background .14s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Avatar adquirente */}
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: acq.bg, color: '#fff',
                  display: 'grid', placeItems: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px -4px rgba(0,0,0,0.25)',
                }}>
                  <FileText size={20} strokeWidth={1.8} />
                </div>

                {/* Conteúdo */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{f.acquirer}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: fmt.color, background: fmt.bg,
                      padding: '2px 7px', borderRadius: 4,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>{f.format}</span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: st.color, background: st.bg,
                      padding: '2px 8px', borderRadius: 999,
                      border: `1px solid ${st.borderColor}`,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      <StIcon size={9} strokeWidth={2.5} />
                      {st.label}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5,
                    color: '#475569', marginBottom: 8,
                  }}>
                    {f.file_name} · {f.date}
                  </div>

                  {/* Progress bar de matching */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      flex: 1, height: 6, borderRadius: 999,
                      background: '#F1F5F9', overflow: 'hidden', position: 'relative',
                    }}>
                      <div style={{
                        width: `${matchRate}%`, height: '100%',
                        background: f.divergent === 0
                          ? 'linear-gradient(90deg, #00C194 0%, #007A5C 100%)'
                          : 'linear-gradient(90deg, #00C194 0%, #B45309 100%)',
                        borderRadius: 999,
                        transition: 'width .6s ease',
                      }} />
                    </div>
                    <div style={{
                      display: 'flex', gap: 14, fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      <span><strong style={{ color: '#0F172A', fontWeight: 700 }}>{f.records.toLocaleString('pt-BR')}</strong> <span style={{ color: '#94A3B8' }}>total</span></span>
                      <span><strong style={{ color: '#007A5C', fontWeight: 700 }}>{f.conciliated.toLocaleString('pt-BR')}</strong> <span style={{ color: '#94A3B8' }}>OK</span></span>
                      {f.divergent > 0 && (
                        <span><strong style={{ color: '#B91C1C', fontWeight: 700 }}>{f.divergent}</strong> <span style={{ color: '#94A3B8' }}>div · {fmtBRLFromReais(f.divergent_value)}</span></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button type="button" style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#475569', cursor: 'pointer',
                    display: 'grid', placeItems: 'center',
                    transition: 'border-color .14s, color .14s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C194'; e.currentTarget.style.color = '#007A5C'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <Eye size={14} />
                  </button>
                  <button type="button" style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#475569', cursor: 'pointer',
                    display: 'grid', placeItems: 'center',
                    transition: 'border-color .14s, color .14s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00C194'; e.currentTarget.style.color = '#007A5C'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; }}
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}