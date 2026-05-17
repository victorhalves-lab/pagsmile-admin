import React from 'react';
import { Database, FileText, Landmark, CheckCircle2, AlertCircle } from 'lucide-react';
import { THREE_WAY_DIAGRAM, fmtBRLFromReais } from './mocks/reconciliationAutomatedMocks';

function Source({ icon: Icon, label, count, value, color, bg }) {
  return (
    <div style={{
      flex: '1 1 200px',
      padding: 16,
      background: bg,
      border: `1px solid ${color}30`,
      borderRadius: 14,
      textAlign: 'center',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: color, color: '#fff',
        display: 'grid', placeItems: 'center',
        margin: '0 auto 10px',
      }}>
        <Icon size={18} strokeWidth={1.8} />
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'var(--v8-fg-muted)', marginBottom: 6,
      }}>{label}</div>
      <div className="v8-num" style={{
        fontSize: 24, fontWeight: 700,
        color: 'var(--v8-fg-strong)',
        letterSpacing: 'var(--tr-tighter)',
        lineHeight: 1.1,
      }}>
        {count.toLocaleString('pt-BR')}
      </div>
      <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 4 }}>
        registros
      </div>
      <div style={{
        marginTop: 8, paddingTop: 8,
        borderTop: '1px solid var(--v8-bd-subtle)',
        fontSize: 11, color: 'var(--v8-fg-default)', fontWeight: 600,
      }}>
        {fmtBRLFromReais(value)}
      </div>
    </div>
  );
}

export default function ThreeWayDiagramV8() {
  const d = THREE_WAY_DIAGRAM;
  return (
    <div data-ds="v8" className="v8-card" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <span className="v8-eyebrow">MATCHING EM 3 VIAS · ÚLTIMOS 30 DIAS</span>
        <h3 style={{
          fontSize: 16, fontWeight: 700, color: 'var(--v8-fg-strong)',
          letterSpacing: 'var(--tr-tight)', marginTop: 4, margin: 0,
        }}>
          Cruzamento automático: Tuna Ledger × Adquirente × Banco
        </h3>
      </div>

      {/* Fontes */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Source
          icon={Database}
          label="Tuna Ledger"
          count={d.tuna_ledger.count}
          value={d.tuna_ledger.value}
          color="var(--pag-mint-500)"
          bg="var(--pag-mint-50)"
        />
        <Source
          icon={FileText}
          label="Arquivos Adquirente"
          count={d.acquirer_files.count}
          value={d.acquirer_files.value}
          color="var(--pag-blue-700)"
          bg="var(--v8-bg-surface-2)"
        />
        <Source
          icon={Landmark}
          label="Extrato Bancário"
          count={d.bank_movements.count}
          value={d.bank_movements.value}
          color="var(--pag-teal-500)"
          bg="var(--v8-bg-surface-2)"
        />
      </div>

      {/* Resultado */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 10,
      }}>
        <div style={{
          padding: '14px 16px',
          background: 'var(--pag-mint-50)',
          border: '1px solid var(--v8-bd-brand)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <CheckCircle2 size={20} style={{ color: 'var(--pag-mint-700)' }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', fontWeight: 600 }}>
              MATCH PERFEITO (3-way)
            </div>
            <div className="v8-num" style={{
              fontSize: 18, fontWeight: 700, color: 'var(--pag-mint-700)',
            }}>{d.three_way_perfect.toLocaleString('pt-BR')}</div>
          </div>
        </div>

        <div style={{
          padding: '14px 16px',
          background: 'var(--sys-warn-soft)',
          border: '1px solid var(--sys-warn)40',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <AlertCircle size={20} style={{ color: 'var(--sys-warn)' }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', fontWeight: 600 }}>
              MATCH PARCIAL (2-way)
            </div>
            <div className="v8-num" style={{
              fontSize: 18, fontWeight: 700, color: 'var(--sys-warn)',
            }}>{d.two_way_only}</div>
          </div>
        </div>

        <div style={{
          padding: '14px 16px',
          background: 'var(--sys-danger-soft)',
          border: '1px solid var(--sys-danger)40',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <AlertCircle size={20} style={{ color: 'var(--sys-danger)' }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', fontWeight: 600 }}>
              SEM MATCH (investigar)
            </div>
            <div className="v8-num" style={{
              fontSize: 18, fontWeight: 700, color: 'var(--sys-danger)',
            }}>{d.no_match}</div>
          </div>
        </div>
      </div>
    </div>
  );
}