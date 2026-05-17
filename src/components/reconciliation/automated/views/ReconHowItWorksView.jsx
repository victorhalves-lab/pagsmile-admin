import React from 'react';
import { FileText, GitMerge, Search, FileSignature, CheckCircle2, ArrowDown } from 'lucide-react';

const STEPS = [
  {
    icon: FileText,
    title: 'Recebimento automático de arquivos',
    desc: 'Diariamente o Tuna recebe arquivos de detalhamento de cada adquirente (EEVD/Cielo, EDI/Stone, CNAB/Rede, Getnet) + extrato bancário em tempo real via Open Finance (Lina).',
    color: '#002443',
    bg: 'linear-gradient(135deg, #013766 0%, #001124 100%)',
    softBg: 'linear-gradient(180deg, #E6ECF2 0%, #FFFFFF 100%)',
    softBorder: 'rgba(0,36,67,0.18)',
  },
  {
    icon: GitMerge,
    title: 'Cruzamento em 3 vias',
    desc: 'Cada transação no Tuna Ledger é cruzada com o registro do adquirente (NSU + Autorização + Valor) e com o crédito bancário (E2E ID + valor + data). Confidence score de 0-100% é gerado automaticamente.',
    color: '#36706C',
    bg: 'linear-gradient(135deg, #4D847F 0%, #234A47 100%)',
    softBg: 'linear-gradient(180deg, #E8F2F0 0%, #FFFFFF 100%)',
    softBorder: 'rgba(54,112,108,0.22)',
  },
  {
    icon: Search,
    title: 'Detecção e classificação · Investigator Agent',
    desc: 'Divergências são classificadas em 12 buckets (valor, MDR, atraso, phantom, split, etc.) com causa raiz redigida pelo agente: "quem fez o quê, porquê, qual a evidência".',
    color: '#B45309',
    bg: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    softBg: 'linear-gradient(180deg, #FEF3C7 0%, #FFFFFF 100%)',
    softBorder: 'rgba(180,83,9,0.22)',
  },
  {
    icon: FileSignature,
    title: 'Proposta de resolução · Communicator Agent',
    desc: 'Para cada divergência, o agente prepara: (1) ajuste contábil sugerido com débito/crédito, ou (2) carta formal de contestação ao adquirente com cláusula contratual referenciada e evidências anexadas.',
    color: '#00C194',
    bg: 'linear-gradient(135deg, #1ECB9D 0%, #007A5C 100%)',
    softBg: 'linear-gradient(180deg, #E0F8F1 0%, #FFFFFF 100%)',
    softBorder: 'rgba(0,193,148,0.32)',
  },
  {
    icon: CheckCircle2,
    title: 'Aprovação e execução',
    desc: 'Você revisa as propostas críticas e aprova com 1 clique. Ajustes são lançados no diário contábil; contestações são enviadas ao adquirente. Tudo auditável e reversível em 60s (ActionWithUndo).',
    color: '#5CF7CF',
    bg: 'linear-gradient(135deg, #5CF7CF 0%, #00C194 100%)',
    softBg: 'linear-gradient(180deg, #E0F8F1 0%, #FFFFFF 100%)',
    softBorder: 'rgba(92,247,207,0.4)',
  },
];

export default function ReconHowItWorksView() {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
    }}>
      <div style={{ marginBottom: 20 }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          fontWeight: 700, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#007A5C',
        }}>
          FLUXO DE CONCILIAÇÃO AUTOMÁTICA
        </span>
        <h3 style={{
          fontSize: 18, fontWeight: 800,
          letterSpacing: '-0.025em', color: '#0F172A',
          marginTop: 4, marginBottom: 0,
          lineHeight: 1.25,
        }}>
          Como o agente trabalha pelos seus centavos 24/7
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isLast = i === STEPS.length - 1;
          return (
            <React.Fragment key={i}>
              <div style={{
                display: 'flex', gap: 16,
                padding: 16,
                background: s.softBg,
                border: `1px solid ${s.softBorder}`,
                borderRadius: 14,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: s.bg, color: '#fff',
                  display: 'grid', placeItems: 'center',
                  flexShrink: 0,
                  boxShadow: `0 6px 18px -4px ${s.color}66`,
                  position: 'relative',
                }}>
                  <Icon size={20} strokeWidth={2} />
                  <span style={{
                    position: 'absolute', top: -7, right: -7,
                    width: 24, height: 24, borderRadius: '50%',
                    background: '#FFFFFF',
                    border: `2px solid ${s.color}`,
                    color: s.color,
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, fontWeight: 800,
                  }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: '#0F172A',
                    letterSpacing: '-0.015em', marginBottom: 6,
                    lineHeight: 1.3,
                  }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                    {s.desc}
                  </div>
                </div>
              </div>
              {!isLast && (
                <div style={{
                  display: 'grid', placeItems: 'center',
                  padding: '6px 0',
                  marginLeft: 26,
                }}>
                  <ArrowDown size={14} strokeWidth={2} style={{ color: '#CBD5E1' }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}