import React from 'react';
import { FileText, GitMerge, Search, FileSignature, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: 'Recebimento automático de arquivos',
    desc: 'Diariamente o Tuna recebe arquivos de detalhamento de cada adquirente (EEVD/Cielo, EDI/Stone, CNAB/Rede, Getnet) + extrato bancário em tempo real via Open Finance (Lina).',
  },
  {
    icon: GitMerge,
    title: 'Cruzamento em 3 vias',
    desc: 'Cada transação no Tuna Ledger é cruzada com o registro do adquirente (NSU + Autorização + Valor) e com o crédito bancário (E2E ID + valor + data). Confidence score de 0-100% é gerado automaticamente.',
  },
  {
    icon: Search,
    title: 'Detecção e classificação · Investigator Agent',
    desc: 'Divergências são classificadas em 12 buckets (valor, MDR, atraso, phantom, split, etc.) com causa raiz redigida pelo agente: "quem fez o quê, porquê, qual a evidência".',
  },
  {
    icon: FileSignature,
    title: 'Proposta de resolução · Communicator Agent',
    desc: 'Para cada divergência, o agente prepara: (1) ajuste contábil sugerido com débito/crédito, ou (2) carta formal de contestação ao adquirente com cláusula contratual referenciada e evidências anexadas.',
  },
  {
    icon: CheckCircle2,
    title: 'Aprovação e execução',
    desc: 'Você revisa as propostas críticas e aprova com 1 clique. Ajustes são lançados no diário contábil; contestações são enviadas ao adquirente. Tudo auditável e reversível em 60s (ActionWithUndo).',
  },
];

export default function ReconHowItWorksView() {
  return (
    <div data-ds="v8" className="v8-card" style={{ padding: 24 }}>
      <span className="v8-eyebrow">FLUXO DE CONCILIAÇÃO AUTOMÁTICA</span>
      <h3 style={{
        fontSize: 18, fontWeight: 700,
        letterSpacing: 'var(--tr-tight)',
        color: 'var(--v8-fg-strong)',
        marginTop: 4, marginBottom: 20,
      }}>Como o agente trabalha pelos seus centavos 24/7</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{
              display: 'flex', gap: 14,
              padding: 14,
              background: 'var(--v8-bg-surface-2)',
              border: '1px solid var(--v8-bd-default)',
              borderRadius: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'var(--grad-brand)', color: '#fff',
                display: 'grid', placeItems: 'center',
                flexShrink: 0, boxShadow: 'var(--sh-brand)',
                position: 'relative',
              }}>
                <Icon size={18} strokeWidth={1.8} />
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--v8-bg-surface)',
                  border: '2px solid var(--pag-mint-500)',
                  color: 'var(--pag-mint-700)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
                }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)',
                  letterSpacing: 'var(--tr-tight)', marginBottom: 4,
                }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--v8-fg-default)', lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}