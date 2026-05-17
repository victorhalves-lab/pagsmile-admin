import React, { useState, useEffect } from 'react';
import {
  Sparkles, Play, Loader2, CheckCircle2, XCircle, Clock,
  WalletCards, CreditCard, AlertTriangle, QrCode, RotateCcw, ChevronRight,
} from 'lucide-react';

/**
 * Simulador interativo · sub-aba "Simulador" do Recovery Agent
 *
 * Conteúdo (resgatado da versão anterior + enriquecido):
 *   1. Input em linguagem natural — "descreva um cenário e a IA sugere estratégia"
 *   2. Lista de cenários clicáveis com PREVIEW do checkout (mockup visual)
 *   3. Simulação passo-a-passo (Detectar → Analisar → Selecionar → Executar)
 *   4. Resultado da recuperação (sucesso/falha)
 *   5. Feed ao vivo de recuperações reais (toggle on/off)
 */

const SCENARIOS = [
  {
    id: 'nsf',
    name: 'Saldo Insuficiente',
    description: 'Cliente não tem saldo no cartão',
    icon: WalletCards,
    recoveryRate: 64,
    checkout: {
      title: 'Ops! Saldo insuficiente',
      message: 'Que tal pagar com PIX e ganhar 5% de desconto?',
      primary: 'Pagar com PIX (R$ 142,50)',
      secondary: 'Usar outro cartão',
    },
  },
  {
    id: 'cvv',
    name: 'CVV inválido',
    description: 'Código de segurança digitado errado',
    icon: CreditCard,
    recoveryRate: 58,
    checkout: {
      title: 'CVV não confere',
      message: 'O código de 3 dígitos fica no verso do cartão. Tente novamente.',
      primary: 'Tentar novamente',
      secondary: 'Usar PIX',
    },
  },
  {
    id: 'invalid_data',
    name: 'Dados do cartão errados',
    description: 'Número, validade ou nome incorretos',
    icon: AlertTriangle,
    recoveryRate: 51,
    checkout: {
      title: 'Vamos revisar seus dados',
      message: 'Algum dado do cartão está diferente. Toque para corrigir e finalizar.',
      primary: 'Corrigir dados',
      secondary: 'Pagar com PIX',
    },
  },
  {
    id: 'limit',
    name: 'Limite excedido',
    description: 'Valor maior que o limite disponível',
    icon: AlertTriangle,
    recoveryRate: 49,
    checkout: {
      title: 'Limite excedido neste cartão',
      message: 'Divida em mais parcelas ou pague via PIX à vista.',
      primary: 'Dividir em 6x',
      secondary: 'Pagar com PIX',
    },
  },
  {
    id: 'pix_pending',
    name: 'PIX não finalizado',
    description: 'Cliente gerou QR mas não pagou',
    icon: QrCode,
    recoveryRate: 71,
    checkout: {
      title: 'Seu PIX ainda está aberto!',
      message: 'O QR Code expira em 15 minutos. Escaneie agora.',
      primary: 'Ver QR Code',
      secondary: 'Pagar com cartão',
    },
  },
  {
    id: 'timeout',
    name: 'Timeout / erro técnico',
    description: 'Falha na comunicação com adquirente',
    icon: RotateCcw,
    recoveryRate: 72,
    checkout: {
      title: 'Reprocessando seu pagamento...',
      message: 'Detectamos instabilidade. Tentando novamente automaticamente.',
      primary: 'Aguarde...',
      secondary: 'Tentar com PIX',
    },
  },
];

const LIVE_EVENTS_POOL = [
  { customer: 'João S.', amount: 289, scenario: 'Saldo insuf.', action: 'PIX oferecido via WhatsApp', status: 'pending' },
  { customer: 'Maria L.', amount: 450, scenario: 'Limite', action: 'Parcelamento aceito', status: 'recovered' },
  { customer: 'Carlos M.', amount: 178, scenario: 'CVV inválido', action: 'Reenvio WhatsApp', status: 'pending' },
  { customer: 'Ana P.', amount: 890, scenario: 'Timeout', action: 'Auto retry sucesso', status: 'recovered' },
  { customer: 'Pedro R.', amount: 345, scenario: 'PIX pendente', action: 'Lembrete enviado', status: 'pending' },
  { customer: 'Beatriz O.', amount: 1240, scenario: 'Antifraude', action: 'Ligação humana convertida', status: 'recovered' },
];

export default function RecoverySimulatorView() {
  const [nlInput, setNlInput] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [liveOn, setLiveOn] = useState(false);
  const [feed, setFeed] = useState([]);

  // Feed ao vivo
  useEffect(() => {
    if (!liveOn) return;
    const iv = setInterval(() => {
      const ev = LIVE_EVENTS_POOL[Math.floor(Math.random() * LIVE_EVENTS_POOL.length)];
      setFeed(prev => [{ ...ev, id: Date.now(), time: new Date().toLocaleTimeString('pt-BR') }, ...prev].slice(0, 6));
    }, 2500);
    return () => clearInterval(iv);
  }, [liveOn]);

  const runSimulation = (sc) => {
    setSelected(sc); setRunning(true); setStep(0); setResult(null);
    let i = 0;
    const tick = () => {
      i++;
      setStep(i);
      if (i < 4) setTimeout(tick, 800);
      else {
        setTimeout(() => {
          setResult(Math.random() * 100 < sc.recoveryRate ? 'recovered' : 'failed');
          setRunning(false);
        }, 600);
      }
    };
    setTimeout(tick, 400);
  };

  const analyzeNl = () => {
    if (!nlInput.trim()) return;
    setAiSuggestion({
      strategy: 'WhatsApp imediato + PIX com 5% desconto + fallback ligação após 6h',
      channel: 'WhatsApp',
      probability: 58,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1 · Input linguagem natural */}
      <div className="v8-card" style={{
        padding: 18,
        background: 'var(--grad-hero)',
        borderColor: 'var(--v8-bd-brand)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'var(--pag-mint-500)', color: '#fff',
            display: 'grid', placeItems: 'center',
          }}>
            <Sparkles size={15} />
          </div>
          <div>
            <span className="v8-eyebrow">DESCREVER CENÁRIO EM LINGUAGEM NATURAL</span>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)', margin: '2px 0 0' }}>
              Descreva uma falha e a IA recomenda a melhor estratégia
            </h3>
          </div>
        </div>
        <textarea
          value={nlInput}
          onChange={(e) => setNlInput(e.target.value)}
          placeholder="Ex: cliente novo tentando pagar R$ 500 com cartão Visa, recusou por saldo insuficiente às 19h..."
          rows={3}
          style={{
            width: '100%', padding: 12,
            background: 'var(--v8-bg-surface)',
            border: '1px solid var(--v8-bd-default)',
            borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 12,
            color: 'var(--v8-fg-strong)', resize: 'vertical', outline: 'none', marginBottom: 10,
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={analyzeNl} disabled={!nlInput.trim()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            height: 36, padding: '0 18px', borderRadius: 10,
            background: nlInput.trim() ? 'var(--grad-brand)' : 'var(--v8-bg-surface-3)',
            color: nlInput.trim() ? '#fff' : 'var(--v8-fg-subtle)',
            border: 'none', fontSize: 13, fontWeight: 700,
            cursor: nlInput.trim() ? 'pointer' : 'not-allowed',
            boxShadow: nlInput.trim() ? 'var(--sh-brand)' : 'none',
          }}>
            <Sparkles size={14} /> Analisar com IA
          </button>
          <button type="button" onClick={() => { setNlInput(''); setAiSuggestion(null); }} style={{
            height: 36, padding: '0 14px', borderRadius: 10,
            background: 'var(--v8-bg-surface)', border: '1px solid var(--v8-bd-default)',
            color: 'var(--v8-fg-strong)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Limpar
          </button>
        </div>

        {aiSuggestion && (
          <div style={{
            marginTop: 12, padding: 14,
            background: 'var(--v8-bg-surface)',
            border: '1px solid var(--v8-bd-brand)', borderRadius: 10,
          }}>
            <span className="v8-eyebrow">RECOMENDAÇÃO DA IA</span>
            <div style={{ fontSize: 13, color: 'var(--v8-fg-strong)', marginTop: 6, fontWeight: 600 }}>
              {aiSuggestion.strategy}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 11, color: 'var(--v8-fg-muted)' }}>
              <span>Canal: <strong style={{ color: 'var(--pag-mint-700)' }}>{aiSuggestion.channel}</strong></span>
              <span>Probabilidade: <strong className="v8-num" style={{ color: 'var(--pag-mint-700)' }}>{aiSuggestion.probability}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* 2 · Cenários + Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 16 }}>
        {/* Lista cenários */}
        <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--v8-bd-default)',
            background: 'var(--v8-bg-surface-2)',
          }}>
            <span className="v8-eyebrow">OU SELECIONE UM CENÁRIO</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)', marginTop: 2 }}>
              Simule como o agente reage
            </div>
          </div>
          <div>
            {SCENARIOS.map(sc => {
              const Icon = sc.icon;
              const isSel = selected?.id === sc.id;
              return (
                <button
                  key={sc.id} type="button" onClick={() => runSimulation(sc)} disabled={running}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px', textAlign: 'left',
                    background: isSel ? 'var(--pag-mint-50)' : 'transparent',
                    border: 'none', borderBottom: '1px solid var(--v8-bd-subtle)',
                    borderLeft: isSel ? '3px solid var(--pag-mint-500)' : '3px solid transparent',
                    cursor: running ? 'not-allowed' : 'pointer',
                    opacity: running && !isSel ? 0.4 : 1,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--v8-fg-muted)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>{sc.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--v8-fg-muted)', marginTop: 1 }}>{sc.description}</div>
                  </div>
                  <span className="v8-num" style={{ fontSize: 11, fontWeight: 700, color: 'var(--pag-mint-700)' }}>
                    {sc.recoveryRate}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview checkout + simulação */}
        <div className="v8-card" style={{ padding: 18 }}>
          <span className="v8-eyebrow">SIMULAÇÃO DE RECUPERAÇÃO</span>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--v8-fg-strong)', margin: '4px 0 14px' }}>
            {selected ? `Cenário: ${selected.name}` : 'Selecione um cenário para começar'}
          </h3>

          {!selected ? (
            <div style={{
              minHeight: 280, display: 'grid', placeItems: 'center', textAlign: 'center',
              background: 'var(--v8-bg-surface-2)', borderRadius: 10,
              border: '1px dashed var(--v8-bd-default)',
            }}>
              <div>
                <Play size={36} style={{ color: 'var(--v8-fg-subtle)', margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v8-fg-muted)' }}>
                  Escolha um cenário ao lado
                </div>
                <div style={{ fontSize: 11, color: 'var(--v8-fg-subtle)', marginTop: 4 }}>
                  Veja o agente em ação passo a passo
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Passos */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 8px' }}>
                {['Detectar', 'Analisar', 'Selecionar', 'Executar'].map((label, idx) => {
                  const done = step > idx;
                  const active = step === idx + 1;
                  return (
                    <React.Fragment key={label}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          display: 'grid', placeItems: 'center',
                          background: done ? 'var(--pag-mint-500)' : active ? 'var(--pag-mint-300)' : 'var(--v8-bg-surface-3)',
                          color: done || active ? '#fff' : 'var(--v8-fg-subtle)',
                          fontSize: 11, fontWeight: 700,
                          animation: active ? 'pulse 1.2s ease-in-out infinite' : 'none',
                        }}>
                          {done ? '✓' : idx + 1}
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--v8-fg-muted)', fontWeight: 600 }}>{label}</span>
                      </div>
                      {idx < 3 && (
                        <div style={{
                          flex: 1, height: 2, margin: '0 4px', marginBottom: 18,
                          background: step > idx ? 'var(--pag-mint-500)' : 'var(--v8-bg-surface-3)',
                          transition: 'background .3s',
                        }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Mockup checkout */}
              <div style={{
                padding: 18,
                background: 'var(--v8-bg-surface-2)',
                border: '1px dashed var(--v8-bd-default)',
                borderRadius: 12, marginBottom: 14,
              }}>
                <div style={{ textAlign: 'center', marginBottom: 10 }}>
                  <span className="v8-eyebrow">PREVIEW DO CHECKOUT</span>
                </div>
                <div style={{
                  maxWidth: 360, margin: '0 auto',
                  background: 'var(--v8-bg-surface)',
                  border: '1px solid var(--v8-bd-default)',
                  borderRadius: 12, padding: 20,
                  boxShadow: 'var(--sh-md)',
                  opacity: running ? 0.7 : 1,
                  transition: 'opacity .3s',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px',
                    background: 'var(--pag-mint-50)', color: 'var(--pag-mint-700)',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <selected.icon size={24} />
                  </div>
                  <h4 style={{
                    fontSize: 15, fontWeight: 700, textAlign: 'center',
                    color: 'var(--v8-fg-strong)', margin: '0 0 6px',
                  }}>{selected.checkout.title}</h4>
                  <p style={{
                    fontSize: 12, color: 'var(--v8-fg-muted)', textAlign: 'center',
                    margin: '0 0 14px', lineHeight: 1.5,
                  }}>{selected.checkout.message}</p>
                  <button type="button" disabled style={{
                    width: '100%', height: 38, marginBottom: 8,
                    background: 'var(--grad-brand)', color: '#fff',
                    border: 'none', borderRadius: 10,
                    fontSize: 13, fontWeight: 700, cursor: 'default',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    {running && <Loader2 size={14} className="v8-spin" />}
                    {selected.checkout.primary}
                  </button>
                  <button type="button" disabled style={{
                    width: '100%', height: 36,
                    background: 'transparent', color: 'var(--v8-fg-strong)',
                    border: '1px solid var(--v8-bd-default)', borderRadius: 10,
                    fontSize: 12, fontWeight: 600, cursor: 'default',
                  }}>
                    {selected.checkout.secondary}
                  </button>
                </div>
              </div>

              {/* Resultado */}
              {result && (
                <div style={{
                  padding: 14, borderRadius: 12,
                  background: result === 'recovered' ? 'var(--pag-mint-50)' : 'var(--sys-danger-soft)',
                  border: `1px solid ${result === 'recovered' ? 'var(--v8-bd-brand)' : 'var(--sys-danger-bd)'}`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  {result === 'recovered'
                    ? <CheckCircle2 size={24} style={{ color: 'var(--pag-mint-700)', flexShrink: 0 }} />
                    : <XCircle size={24} style={{ color: 'var(--sys-danger)', flexShrink: 0 }} />}
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: result === 'recovered' ? 'var(--pag-mint-700)' : 'var(--sys-danger)',
                    }}>
                      {result === 'recovered' ? 'Pagamento recuperado!' : 'Recuperação não concluída'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--v8-fg-muted)', marginTop: 2 }}>
                      {result === 'recovered'
                        ? 'Cliente concluiu o pagamento com método alternativo.'
                        : 'Cliente não respondeu. Próxima cadência será disparada automaticamente.'}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 3 · Feed ao vivo */}
      <div className="v8-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--v8-bd-default)',
          background: 'var(--v8-bg-surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: liveOn ? 'var(--pag-mint-500)' : 'var(--v8-fg-subtle)',
              animation: liveOn ? 'pulse 1.2s ease-in-out infinite' : 'none',
            }} />
            <span className="v8-eyebrow">FEED AO VIVO</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--v8-fg-strong)' }}>
              Recuperações em tempo real
            </span>
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input
              type="checkbox" checked={liveOn} onChange={(e) => setLiveOn(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: 'var(--pag-mint-500)' }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)' }}>
              {liveOn ? 'Ao vivo' : 'Ativar'}
            </span>
          </label>
        </div>
        <div style={{ minHeight: 80 }}>
          {!liveOn && (
            <div style={{
              padding: '24px 18px', textAlign: 'center', fontSize: 12, color: 'var(--v8-fg-muted)',
            }}>
              Ative o feed para ver recuperações chegando em tempo real
            </div>
          )}
          {liveOn && feed.length === 0 && (
            <div style={{
              padding: '24px 18px', textAlign: 'center', fontSize: 12, color: 'var(--v8-fg-muted)',
            }}>
              <Loader2 size={16} className="v8-spin" style={{ marginRight: 6, verticalAlign: -3 }} />
              Aguardando eventos...
            </div>
          )}
          {liveOn && feed.map(ev => (
            <div key={ev.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 18px',
              borderBottom: '1px solid var(--v8-bd-subtle)',
              background: ev.status === 'recovered' ? 'var(--pag-mint-50)' : 'transparent',
            }}>
              {ev.status === 'recovered'
                ? <CheckCircle2 size={16} style={{ color: 'var(--pag-mint-700)', flexShrink: 0 }} />
                : <Clock size={16} style={{ color: 'var(--sys-warn)', flexShrink: 0 }} />}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)', minWidth: 90 }}>{ev.customer}</span>
              <span className="v8-num" style={{ fontSize: 12, fontWeight: 600, color: 'var(--v8-fg-strong)', minWidth: 80 }}>
                R$ {ev.amount}
              </span>
              <span style={{ fontSize: 11, color: 'var(--v8-fg-muted)', minWidth: 110 }}>{ev.scenario}</span>
              <ChevronRight size={12} style={{ color: 'var(--v8-fg-subtle)', flexShrink: 0 }} />
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: ev.status === 'recovered' ? 'var(--pag-mint-700)' : 'var(--sys-warn)',
                flex: 1,
              }}>{ev.action}</span>
              <span className="v8-mono" style={{ fontSize: 10, color: 'var(--v8-fg-subtle)' }}>{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
        .v8-spin { animation: v8-spin-kf 0.9s linear infinite; }
        @keyframes v8-spin-kf { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}