import React from 'react';
import { Database, FileText, Landmark, CheckCircle2, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import { THREE_WAY_DIAGRAM, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

/**
 * Diagrama 3-vias V8 oficial — inline styles puros.
 * Visual: 3 source cards com gradient sutil + setas convergindo + 3 result chips coloridos.
 */

function SourceCard({ icon: Icon, label, count, value, accentColor, gradient, iconBg }) {
  return (
    <div style={{
      flex: '1 1 220px',
      position: 'relative',
      padding: 18,
      background: gradient,
      border: `1px solid ${accentColor}33`,
      borderRadius: 14,
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -40, top: -40,
        width: 120, height: 120,
        background: `radial-gradient(closest-side, ${accentColor}1A, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative', zIndex: 2,
        width: 44, height: 44, borderRadius: 12,
        background: iconBg, color: '#fff',
        display: 'grid', placeItems: 'center',
        margin: '0 auto 12px',
        boxShadow: `0 6px 16px -4px ${accentColor}66`,
      }}>
        <Icon size={20} strokeWidth={1.9} />
      </div>
      <div style={{
        position: 'relative', zIndex: 2,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.14em',
        color: accentColor, marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        position: 'relative', zIndex: 2,
        fontFamily: 'Inter, sans-serif', fontSize: 30, fontWeight: 800,
        color: '#0F172A', letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1.05,
      }}>
        {count.toLocaleString('pt-BR')}
      </div>
      <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, position: 'relative', zIndex: 2 }}>
        registros
      </div>
      <div style={{
        position: 'relative', zIndex: 2,
        marginTop: 10, paddingTop: 10,
        borderTop: `1px dashed ${accentColor}40`,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12, color: '#1E293B', fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {fmtBRLFromReais(value)}
      </div>
    </div>
  );
}

function ResultChip({ icon: Icon, label, value, color, bg, borderColor }) {
  return (
    <div style={{
      padding: '14px 16px',
      background: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color, color: '#fff',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: '#64748B', marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800,
          color, letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>
          {value.toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  );
}

export default function ThreeWayDiagramV8() {
  const d = THREE_WAY_DIAGRAM;

  return (
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
        }}>
          MATCHING EM 3 VIAS · ÚLTIMOS 30 DIAS
        </span>
        <h3 style={{
          fontSize: 16, fontWeight: 700, color: '#0F172A',
          letterSpacing: '-0.018em', marginTop: 4, margin: 0,
          lineHeight: 1.3,
        }}>
          Cruzamento automático: Tuna Ledger × Adquirente × Banco
        </h3>
      </div>

      {/* Fontes com setas convergindo */}
      <div style={{
        display: 'flex', gap: 14, flexWrap: 'wrap',
        alignItems: 'stretch', marginBottom: 18,
      }}>
        <SourceCard
          icon={Database}
          label="Tuna Ledger"
          count={d.tuna_ledger.count}
          value={d.tuna_ledger.value}
          accentColor="#00C194"
          iconBg="linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)"
          gradient="linear-gradient(180deg, #E0F8F1 0%, #FFFFFF 100%)"
        />
        <SourceCard
          icon={FileText}
          label="Arquivos Adquirente"
          count={d.acquirer_files.count}
          value={d.acquirer_files.value}
          accentColor="#002443"
          iconBg="linear-gradient(135deg, #013766 0%, #001124 100%)"
          gradient="linear-gradient(180deg, #E6ECF2 0%, #FFFFFF 100%)"
        />
        <SourceCard
          icon={Landmark}
          label="Extrato Bancário"
          count={d.bank_movements.count}
          value={d.bank_movements.value}
          accentColor="#36706C"
          iconBg="linear-gradient(135deg, #4D847F 0%, #234A47 100%)"
          gradient="linear-gradient(180deg, #E8F2F0 0%, #FFFFFF 100%)"
        />
      </div>

      {/* Divisor com seta */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        margin: '0 0 14px',
      }}>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 999,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          fontWeight: 700, color: '#64748B',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <ArrowRight size={11} />
          Resultado do match
        </div>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
      </div>

      {/* Resultados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 10,
      }}>
        <ResultChip
          icon={CheckCircle2}
          label="MATCH PERFEITO (3-way)"
          value={d.three_way_perfect}
          color="#007A5C"
          bg="linear-gradient(180deg, #E0F8F1 0%, #F4FCF8 100%)"
          borderColor="rgba(0,193,148,0.32)"
        />
        <ResultChip
          icon={AlertCircle}
          label="MATCH PARCIAL (2-way)"
          value={d.two_way_only}
          color="#B45309"
          bg="linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)"
          borderColor="rgba(180,83,9,0.32)"
        />
        <ResultChip
          icon={XCircle}
          label="SEM MATCH (investigar)"
          value={d.no_match}
          color="#B91C1C"
          bg="linear-gradient(180deg, #FEE2E2 0%, #FEF2F2 100%)"
          borderColor="rgba(185,28,28,0.32)"
        />
      </div>
    </div>
  );
}