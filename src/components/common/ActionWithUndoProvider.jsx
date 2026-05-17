import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { toast } from 'sonner';
import ActionWithUndoToast from './ActionWithUndoToast';
import { ActionWithUndoContext } from './useActionWithUndo';
import { getActionHandler } from './actionRegistry';

const STORAGE_KEY = 'v8_actions_pending_queue';
const MAX_PENDING = 5;

/**
 * ActionWithUndoProvider
 *
 * Gerencia a fila global de ações undo-able. Renderiza N toasts empilhados
 * no canto inferior direito (via classe `.v8-undo-stack`).
 *
 * API exposta no context:
 *   - triggerAction(props) → actionId
 *   - cancelAction(actionId)
 *   - confirmActionNow(actionId)
 *   - listPendingActions() → array
 *
 * Persistência:
 *   - localStorage com chave `v8_actions_pending_queue`
 *   - apenas metadados serializáveis (sem callbacks)
 *   - on-mount: ressuscita pendentes; expirados são auto-confirmados
 *     via actionRegistry.getActionHandler(actionType).onConfirm
 */

function genId() {
  return `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(queue) {
  try {
    if (!queue || queue.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('[ActionWithUndo] storage write failed:', e);
  }
}

export default function ActionWithUndoProvider({ children }) {
  const [pending, setPending] = useState([]);
  const mountedRef = useRef(false);

  // Persiste sempre que `pending` muda (mas após o mount)
  useEffect(() => {
    if (!mountedRef.current) return;
    // Serializa apenas metadados (sem funções)
    const serializable = pending.map(a => ({
      actionId: a.actionId,
      actionType: a.actionType,
      actionLabel: a.actionLabel,
      targetSummary: a.targetSummary,
      tone: a.tone,
      undoWindowSeconds: a.undoWindowSeconds,
      pinnable: a.pinnable,
      scheduledConfirmAt: a.scheduledConfirmAt,
      entityId: a.entityId,
      payload: a.payload,
      auditMeta: a.auditMeta,
    }));
    writeStorage(serializable);
  }, [pending]);

  // On-mount: ressuscita do storage
  useEffect(() => {
    const queue = readStorage();
    if (!queue.length) {
      mountedRef.current = true;
      return;
    }
    const now = Date.now();
    const stillPending = [];
    const expired = [];

    for (const a of queue) {
      const scheduled = new Date(a.scheduledConfirmAt).getTime();
      if (scheduled > now) stillPending.push(a);
      else expired.push(a);
    }

    // Auto-confirma expirados via registry
    (async () => {
      for (const a of expired) {
        const handler = getActionHandler(a.actionType);
        try {
          if (handler?.onConfirm) {
            await handler.onConfirm({ entityId: a.entityId, payload: a.payload });
          }
          toast.success(`${a.actionLabel}: aplicado após reload`);
        } catch (err) {
          console.error('[ActionWithUndo] auto-confirm failed:', err);
          toast.error(`${a.actionLabel}: erro ao aplicar`);
        }
      }
    })();

    // Reconecta os callbacks dos pending via registry
    const hydrated = stillPending.map(a => hydrateAction(a));
    setPending(hydrated);
    mountedRef.current = true;
  }, []);

  const removeFromQueue = useCallback((actionId) => {
    setPending(prev => prev.filter(a => a.actionId !== actionId));
  }, []);

  const hydrateAction = (meta) => {
    const handler = getActionHandler(meta.actionType);
    return {
      ...meta,
      onConfirm: async () => {
        if (handler?.onConfirm) {
          await handler.onConfirm({ entityId: meta.entityId, payload: meta.payload });
        }
      },
      onUndo: async () => {
        if (handler?.onUndo) {
          await handler.onUndo({ entityId: meta.entityId, payload: meta.payload });
        }
      },
    };
  };

  const triggerAction = useCallback((props) => {
    if (pending.length >= MAX_PENDING) {
      toast.error(`Você tem ${MAX_PENDING} ações pendentes — confirme ou desfaça uma antes de iniciar outra.`);
      return null;
    }

    const undoWindowSeconds = Math.min(300, Math.max(5, props.undoWindowSeconds ?? 60));
    const actionId = props.actionId || genId();
    const scheduledConfirmAt = new Date(Date.now() + undoWindowSeconds * 1000).toISOString();

    const meta = {
      actionId,
      actionType: props.actionType,
      actionLabel: props.actionLabel,
      targetSummary: props.targetSummary || '',
      tone: props.tone || 'destructive',
      icon: props.icon, // não persistido
      undoWindowSeconds,
      pinnable: !!props.pinnable,
      scheduledConfirmAt,
      entityId: props.entityId,
      payload: props.payload || {},
      auditMeta: props.auditMeta,
    };

    const hydrated = hydrateAction(meta);
    // Preserva o icon (componente) — não vai pro storage, mas fica em memória
    hydrated.icon = props.icon;

    setPending(prev => [...prev, hydrated]);
    return actionId;
  }, [pending.length]);

  const cancelAction = useCallback(async (actionId) => {
    const action = pending.find(a => a.actionId === actionId);
    if (!action) return;
    try {
      if (action.onUndo) await action.onUndo();
    } catch (e) {
      console.error('[ActionWithUndo] cancelAction error:', e);
    }
    removeFromQueue(actionId);
  }, [pending, removeFromQueue]);

  const confirmActionNow = useCallback(async (actionId) => {
    const action = pending.find(a => a.actionId === actionId);
    if (!action) return;
    try {
      if (action.onConfirm) await action.onConfirm();
    } catch (e) {
      console.error('[ActionWithUndo] confirmActionNow error:', e);
    }
    removeFromQueue(actionId);
  }, [pending, removeFromQueue]);

  const listPendingActions = useCallback(() => {
    return pending.map(a => ({
      actionId: a.actionId,
      actionLabel: a.actionLabel,
      scheduledConfirmAt: a.scheduledConfirmAt,
    }));
  }, [pending]);

  const value = useMemo(() => ({
    triggerAction,
    cancelAction,
    confirmActionNow,
    listPendingActions,
  }), [triggerAction, cancelAction, confirmActionNow, listPendingActions]);

  return (
    <ActionWithUndoContext.Provider value={value}>
      {children}
      <div className="v8-undo-stack" aria-label="Ações pendentes">
        {pending.map(action => (
          <ActionWithUndoToast
            key={action.actionId}
            actionId={action.actionId}
            actionLabel={action.actionLabel}
            targetSummary={action.targetSummary}
            tone={action.tone}
            icon={action.icon}
            undoWindowSeconds={action.undoWindowSeconds}
            scheduledConfirmAt={action.scheduledConfirmAt}
            pinnable={action.pinnable}
            onConfirm={action.onConfirm}
            onUndo={action.onUndo}
            onClose={() => removeFromQueue(action.actionId)}
          />
        ))}
      </div>
    </ActionWithUndoContext.Provider>
  );
}