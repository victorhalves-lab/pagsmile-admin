import { useContext, createContext } from 'react';

/**
 * Context + hook do ActionWithUndo.
 *
 * Mantido em arquivo próprio para evitar import circular entre o
 * Provider (que usa Context.Provider) e os consumidores (que usam o hook).
 */
export const ActionWithUndoContext = createContext(null);

export function useActionWithUndo() {
  const ctx = useContext(ActionWithUndoContext);
  if (!ctx) {
    throw new Error('useActionWithUndo must be used within an <ActionWithUndoProvider>');
  }
  return ctx;
}