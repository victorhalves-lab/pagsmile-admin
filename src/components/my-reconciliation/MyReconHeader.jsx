import React from 'react';
import { ShieldCheck, Settings, Sparkles, FileDown } from 'lucide-react';
import { KPI_PERIODO, fmtBRLShort } from './mocks/myReconciliationMocks';

/**
 * Header executivo da Conciliação Completa (Admin Sub).
 * Mostra: período, health score do auditor, total auditado, ações principais.
 */
export default function MyReconHeader({ auditorActive = true, onToggle }) {
  const kpi = KPI_PERIODO;
  return (
    <div style={{
      position: 'relative',
      padding: '22px 26px',
      borderRadius: 18,
      background: 'linear-gradient(135deg, #002443 0%, #001124 100%)',
      border: '1px solid rgba(92,247,207,0.22)',
      overflow: 'hidden',
      color: '#fff',
    }}>
      <div style={{
        position: 'absolute', right: -120, top: -120, width: 360, height: 360,
        background: 'radial-gradient(closest-side, rgba(92,247,207,0.22), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
          color: '#002443',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 8px 24px -4px rgba(92,247,207,0.45)',
          flexShrink: 0,
        }}>
          <ShieldCheck size={24} strokeWidth={2.2} />
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#5CF7CF',
            marginBottom: 6,
          }}>
            <Sparkles size={11} strokeWidth={2.5} />
            CONCILIAÇÃO COMPLETA · MAIO 2026
          </div>
          <div style={{
            fontSize: 22, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.025em', lineHeight: 1.2,
            marginBottom: 4,
          }}>
            Auditor está {auditorActive ? 'ativo' : 'pausado'} e monitorando vendas, taxas e recebimentos
          </div>
          <div style={{
            fontSize: 13, color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.5,
          }}>
            Confronto contínuo entre o que você vendeu, o que a PagSmile registrou e o que efetivamente caiu na sua conta.
          </div>
        </div>

        {/* KPIs mini */}
        <div style={{ display: 'flex', gap: 28, flexShrink: 0 }}>
          <MiniKpi label="HEALTH SCORE" value={`${kpi.health_score}/100`} color="#5CF7CF" />
          <MiniKpi label="AUDITADO NO MÊS" value={fmtBRLShort(kpi.vendas_brutas)} color="#fff" />
          <MiniKpi label="A RECUPERAR" value={fmtBRLShort(kpi.divergencias_valor)} color="#FBBF24" />
        </div>
      </div>

      {/* Ações */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap',
      }}>
        <button type="button" onClick={onToggle} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          height: 36, padding: '0 16px', borderRadius: 10,
          background: auditorActive
            ? 'linear-gradient(180deg, #1ECB9D 0%, #00C194 100%)'
            : 'rgba(255,255,255,0.1)',
          color: '#fff',
          border: auditorActive ? '1px solid #009E78' : '1px solid rgba(255,255,255,0.22)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
          boxShadow: auditorActive ? '0 4px 12px -2px rgba(0,193,148,0.45)' : 'none',
        }}>
          <ShieldCheck size={14} strokeWidth={2.2} />
          {auditorActive ? 'Auditor ativo' : 'Ativar auditor'}
        </button>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          height: 36, padding: '0 16px', borderRadius: 10,
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.18)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>
          <FileDown size={14} strokeWidth={2} />
          Exportar relatório
        </button>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          height: 36, padding: '0 16px', borderRadius: 10,
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.18)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
        }}>
          <Settings size={14} strokeWidth={2} />
          Configurar regras
        </button>
      </div>
    </div>
  );
}

function MiniKpi({ label, value, color }) {
  return (
    <div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.62)', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 800,
        color, letterSpacing: '-0.025em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1,
      }}>{value}</div>
    </div>
  );
}