/**
 * actionRegistry — registry global de handlers para ações undo-able.
 *
 * Por que isto existe:
 * Quando `ActionWithUndo` persiste uma ação pendente em window.storage
 * (para sobreviver a refresh), não é possível serializar os callbacks
 * `onConfirm` e `onUndo`. A solução é registrar handlers por chave de
 * `actionType` no startup da app, e referenciar a chave (não a função)
 * nos metadados persistidos.
 *
 * Uso:
 *   registerActionHandler('merchant.block', {
 *     onConfirm: async ({ entityId, payload }) => { ... },
 *     onUndo:    async ({ entityId, payload }) => { ... },
 *   });
 *
 *   getActionHandler('merchant.block')?.onConfirm({ entityId, payload });
 */

const handlers = {};

export function registerActionHandler(actionType, { onConfirm, onUndo } = {}) {
  if (!actionType || typeof actionType !== 'string') {
    console.warn('[actionRegistry] actionType inválido:', actionType);
    return;
  }
  handlers[actionType] = {
    onConfirm: typeof onConfirm === 'function' ? onConfirm : async () => {},
    onUndo: typeof onUndo === 'function' ? onUndo : async () => {},
  };
}

export function getActionHandler(actionType) {
  return handlers[actionType];
}

export function listRegisteredActionTypes() {
  return Object.keys(handlers);
}