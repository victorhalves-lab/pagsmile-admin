import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Undo2, Pin, AlertTriangle, Ban, Info, Loader2 } from 'lucide-react';

/**
 * ActionWithUndoToast — Toast V8 com janela de undo de 60s.
 *
 * Estados visuais (6):
 *   - counting:  barra animando, contador descrescendo
 *   - paused:    cursor sobre o toast — barra/timer pausados
 *   - pinned:    travado indefinidamente (sem barra, sem contador)
 *   - confirming: aguardando Promise do onConfirm
 *   - undoing:   aguardando Promise do onUndo
 *   - errored:   erro após confirm/undo — botões de retry/cancel
 *
 * Acessibilidade:
 *   role="status", aria-live="polite"
 *   Esc → undo · Enter → confirm
 *
 * Wireframe:
 *   ┌─────────────────────────────────────────┐
 *   │ [icon] Título da ação            [pin][X]│
 *   │ Descrição com contagem regressiva       │
 *   │ ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
 *   │ 0:42       [↶ Desfazer] [Confirmar agora]│
 *   └─────────────────────────────────────────┘
 */

const ICON_MAP = {
  destructive: Ban,
  warning: AlertTriangle,
  info: Info,
};

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  if (s < 60) return `0:${String(s).padStart(2, '0')}`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function getCounterClass(seconds) {
  if (seconds <= 10) return 'v8-undo-toast__counter v8-undo-toast__counter--low';
  if (seconds <= 30) return 'v8-undo-toast__counter v8-undo-toast__counter--mid';
  return 'v8-undo-toast__counter';
}

export default function ActionWithUndoToast({
  actionId,
  actionLabel,
  targetSummary,
  tone = 'destructive',
  icon,
  undoWindowSeconds = 60,
  scheduledConfirmAt,
  pinnable = false,
  onConfirm,
  onUndo,
  onTimerExpire,
  onClose,
}) {
  // Calcula segundos remanescentes baseado em scheduledConfirmAt (sobrevive a refresh / aba inativa)
  const computeRemaining = useCallback(() => {
    if (!scheduledConfirmAt) return undoWindowSeconds;
    const diff = Math.ceil((new Date(scheduledConfirmAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  }, [scheduledConfirmAt, undoWindowSeconds]);

  const [state, setState] = useState('counting'); // counting | paused | pinned | confirming | undoing | errored
  const [errorMode, setErrorMode] = useState(null); // 'confirm' | 'undo' | null
  const [secondsRemaining, setSecondsRemaining] = useState(computeRemaining);
  const intervalRef = useRef(null);
  const toastRef = useRef(null);

  const IconCmp = icon || ICON_MAP[tone] || Info;

  // ── Confirm ──
  const doConfirm = useCallback(async () => {
    if (state === 'confirming' || state === 'undoing') return;
    setState('confirming');
    setErrorMode(null);
    try {
      if (onConfirm) await onConfirm();
      onClose?.('confirmed');
    } catch (e) {
      console.error('[ActionWithUndo] onConfirm error:', e);
      setErrorMode('confirm');
      setState('errored');
    }
  }, [state, onConfirm, onClose]);

  // ── Undo ──
  const doUndo = useCallback(async () => {
    if (state === 'confirming' || state === 'undoing') return;
    setState('undoing');
    setErrorMode(null);
    try {
      if (onUndo) await onUndo();
      onClose?.('cancelled');
    } catch (e) {
      console.error('[ActionWithUndo] onUndo error:', e);
      setErrorMode('undo');
      setState('errored');
    }
  }, [state, onUndo, onClose]);

  // ── Timer (só roda em counting) ──
  useEffect(() => {
    if (state !== 'counting') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const remaining = computeRemaining();
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        onTimerExpire?.();
        doConfirm();
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [state, computeRemaining, onTimerExpire, doConfirm]);

  // ── visibilitychange (recalcula ao voltar pra aba) ──
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && state === 'counting') {
        const remaining = computeRemaining();
        setSecondsRemaining(remaining);
        if (remaining <= 0) doConfirm();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [state, computeRemaining, doConfirm]);

  // ── Atalhos de teclado quando toast está focado ──
  const onKey = useCallback((e) => {
    if (state !== 'counting' && state !== 'paused' && state !== 'pinned') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      doUndo();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      doConfirm();
    }
  }, [state, doConfirm, doUndo]);

  // ── Hover pausa ──
  const handleMouseEnter = () => {
    if (state === 'counting') setState('paused');
  };
  const handleMouseLeave = () => {
    if (state === 'paused') setState('counting');
  };

  // ── Pin toggle ──
  const togglePin = () => {
    if (state === 'pinned') setState('counting');
    else if (state === 'counting' || state === 'paused') setState('pinned');
  };

  // Descrição contextual
  const description = (() => {
    if (state === 'confirming') return 'Aplicando…';
    if (state === 'undoing') return 'Desfazendo…';
    if (state === 'errored' && errorMode === 'confirm')
      return 'Erro ao aplicar. Tente novamente ou cancele a ação.';
    if (state === 'errored' && errorMode === 'undo')
      return 'Erro ao desfazer. A ação pode já ter sido aplicada — verifique o destino.';
    if (state === 'pinned') return 'Ação pendente — aguardando sua decisão.';
    if (state === 'paused') return 'Timer pausado — mova o cursor para retomar.';
    if (pinnable)
      return `${targetSummary || ''}${targetSummary ? ' · ' : ''}A ação será aplicada em ${secondsRemaining}s. Clique no pin para pausar.`;
    return `${targetSummary || ''}${targetSummary ? ' · ' : ''}A ação será aplicada em ${secondsRemaining}s. Você pode desfazê-la até lá.`;
  })();

  // Largura da barra de progresso (em %)
  const progressPct = state === 'pinned' || state === 'errored' || state === 'confirming' || state === 'undoing'
    ? 0
    : (secondsRemaining / undoWindowSeconds) * 100;

  const isErrored = state === 'errored';
  const showProgress = state === 'counting' || state === 'paused';
  const showCounter = state === 'counting' || state === 'paused';
  const disabled = state === 'confirming' || state === 'undoing';

  return (
    <div
      ref={toastRef}
      role="status"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={[
        'v8-undo-toast',
        `v8-undo-toast--${isErrored ? 'warning' : tone}`,
        state === 'pinned' ? 'v8-undo-toast--pinned' : '',
      ].filter(Boolean).join(' ')}
      data-action-id={actionId}
    >
      {/* Header */}
      <div className="v8-undo-toast__head">
        <div className="v8-undo-toast__icon">
          {isErrored
            ? <AlertTriangle size={16} strokeWidth={2} />
            : <IconCmp size={16} strokeWidth={2} />}
        </div>
        <div className="v8-undo-toast__title" title={actionLabel}>
          {actionLabel}
        </div>
        {pinnable && (
          <button
            type="button"
            className={`v8-undo-toast__icon-btn ${state === 'pinned' ? 'v8-undo-toast__icon-btn--active' : ''}`}
            onClick={togglePin}
            disabled={disabled}
            aria-label="Pausar timer indefinidamente"
            title={state === 'pinned' ? 'Retomar timer' : 'Pausar indefinidamente'}
          >
            <Pin size={14} strokeWidth={2} />
          </button>
        )}
        <button
          type="button"
          className="v8-undo-toast__icon-btn"
          onClick={doConfirm}
          disabled={disabled}
          aria-label="Confirmar e fechar"
          title="Confirmar e fechar"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      <div className="v8-undo-toast__body">{description}</div>

      {/* Progress bar */}
      {showProgress && (
        <div
          className="v8-undo-toast__progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={undoWindowSeconds}
          aria-valuenow={secondsRemaining}
        >
          <div
            className="v8-undo-toast__progress-bar"
            style={{
              transform: `scaleX(${progressPct / 100})`,
              transition: state === 'paused' ? 'none' : 'transform 1s linear',
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="v8-undo-toast__foot">
        {showCounter ? (
          <span
            className={getCounterClass(secondsRemaining)}
            aria-label={`${secondsRemaining} segundos restantes para confirmar`}
          >
            {formatTime(secondsRemaining)}
          </span>
        ) : (
          <span className="v8-undo-toast__counter">—</span>
        )}

        <div className="v8-undo-toast__actions">
          <button
            type="button"
            className="v8-undo-toast__btn v8-undo-toast__btn--undo"
            onClick={doUndo}
            disabled={disabled}
          >
            {state === 'undoing'
              ? <span className="v8-undo-toast__spinner" />
              : <Undo2 size={12} strokeWidth={2.2} />}
            {isErrored && errorMode === 'undo' ? 'Cancelar' : 'Desfazer'}
          </button>
          <button
            type="button"
            className="v8-undo-toast__btn v8-undo-toast__btn--confirm"
            onClick={doConfirm}
            disabled={disabled}
          >
            {state === 'confirming' && <span className="v8-undo-toast__spinner" />}
            {isErrored && errorMode === 'confirm' ? 'Tentar novamente' : 'Confirmar agora'}
          </button>
        </div>
      </div>

      {state === 'paused' && <div className="v8-undo-toast__paused-overlay" />}
    </div>
  );
}