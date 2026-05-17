import React from 'react';
import { Eye, Download } from 'lucide-react';
import { RECON_FILES, fmtBRLFromReais } from '../mocks/reconciliationAutomatedMocks';

const STATUS_META = {
  completed: { label: 'Completo', color: 'var(--pag-mint-700)', bg: 'var(--pag-mint-50)' },
  review: { label: 'Em revisão', color: 'var(--sys-warn)', bg: 'var(--sys-warn-soft)' },
  parsing: { label: 'Processando', color: 'var(--pag-blue-700)', bg: 'var(--v8-bg-surface-2)' },
};

export default function ReconFilesView() {
  return (
    <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--v8-bd-default)',
        background: 'var(--v8-bg-surface-2)',
      }}>
        <span className="v8-eyebrow">ARQUIVOS RECEBIDOS · ÚLTIMOS DIAS</span>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
          {RECON_FILES.length} arquivos · {RECON_FILES.reduce((s, f) => s + f.records, 0).toLocaleString('pt-BR')} registros processados
        </div>
      </div>

      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{
              background: 'var(--v8-bg-surface-2)',
              borderBottom: '1px solid var(--v8-bd-default)',
            }}>
              {['Data', 'Adquirente', 'Arquivo', 'Formato', 'Registros', 'OK', 'Divergentes', '$ Divergente', 'Status', ''].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '10px 14px',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  color: 'var(--v8-fg-muted)', fontWeight: 700,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECON_FILES.map(f => {
              const st = STATUS_META[f.status];
              return (
                <tr key={f.id} style={{ borderBottom: '1px solid var(--v8-bd-subtle)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--v8-fg-default)' }}>
                    {f.date}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--v8-fg-strong)' }}>
                    {f.acquirer}
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--v8-fg-muted)' }}>
                    {f.file_name}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <code style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                      color: 'var(--v8-fg-muted)',
                      background: 'var(--v8-bg-surface-3)',
                      padding: '1px 6px', borderRadius: 4,
                      textTransform: 'uppercase',
                    }}>{f.format}</code>
                  </td>
                  <td style={{ padding: '12px 14px' }} className="v8-num">
                    <strong style={{ color: 'var(--v8-fg-strong)' }}>{f.records.toLocaleString('pt-BR')}</strong>
                  </td>
                  <td style={{ padding: '12px 14px' }} className="v8-num">
                    <strong style={{ color: 'var(--pag-mint-700)' }}>{f.conciliated.toLocaleString('pt-BR')}</strong>
                  </td>
                  <td style={{ padding: '12px 14px' }} className="v8-num">
                    <strong style={{ color: f.divergent > 0 ? 'var(--sys-danger)' : 'var(--v8-fg-subtle)' }}>
                      {f.divergent}
                    </strong>
                  </td>
                  <td style={{ padding: '12px 14px' }} className="v8-num">
                    <span style={{ color: f.divergent_value > 0 ? 'var(--sys-danger)' : 'var(--v8-fg-subtle)', fontWeight: 600 }}>
                      {fmtBRLFromReais(f.divergent_value)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      height: 22, padding: '0 8px', borderRadius: 6,
                      background: st.bg, color: st.color,
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{st.label}</span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button type="button" style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'transparent', border: '1px solid var(--v8-bd-default)',
                        color: 'var(--v8-fg-muted)', cursor: 'pointer',
                        display: 'grid', placeItems: 'center',
                      }}>
                        <Eye size={12} />
                      </button>
                      <button type="button" style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'transparent', border: '1px solid var(--v8-bd-default)',
                        color: 'var(--v8-fg-muted)', cursor: 'pointer',
                        display: 'grid', placeItems: 'center',
                      }}>
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}