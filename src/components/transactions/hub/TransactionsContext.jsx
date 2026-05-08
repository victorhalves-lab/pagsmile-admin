import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Sticky filters cross-aba: período, método, status persistem entre abas.
 * Permite que ao trocar de "Todas" → "Cartão" → "PIX", os filtros sigam.
 */
const TransactionsContext = createContext(null);

const DEFAULT_FILTERS = {
  period: 'today',           // today | yesterday | 7d | 30d | custom
  date_from: null,
  date_to: null,
  method: 'all',             // all | card | pix | boleto
  statuses: [],              // ['approved', 'refused', ...]
  search: '',
};

export function TransactionsProvider({ children }) {
  const [stickyFilters, setStickyFilters] = useState(DEFAULT_FILTERS);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [savedViews, setSavedViews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tx_saved_views') || '[]');
    } catch {
      return [];
    }
  });

  const updateFilter = useCallback((key, value) => {
    setStickyFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setStickyFilters(DEFAULT_FILTERS);
  }, []);

  const removeFilter = useCallback((key) => {
    setStickyFilters(prev => ({ ...prev, [key]: DEFAULT_FILTERS[key] }));
  }, []);

  const refresh = useCallback(() => {
    setLastUpdate(new Date());
  }, []);

  const saveView = useCallback((name) => {
    const newView = {
      id: Date.now().toString(),
      name,
      filters: stickyFilters,
      created_at: new Date().toISOString(),
    };
    const updated = [...savedViews, newView];
    setSavedViews(updated);
    localStorage.setItem('tx_saved_views', JSON.stringify(updated));
    return newView;
  }, [stickyFilters, savedViews]);

  const applyView = useCallback((view) => {
    setStickyFilters(view.filters);
  }, []);

  const deleteView = useCallback((viewId) => {
    const updated = savedViews.filter(v => v.id !== viewId);
    setSavedViews(updated);
    localStorage.setItem('tx_saved_views', JSON.stringify(updated));
  }, [savedViews]);

  return (
    <TransactionsContext.Provider value={{
      stickyFilters,
      updateFilter,
      removeFilter,
      clearFilters,
      lastUpdate,
      refresh,
      savedViews,
      saveView,
      applyView,
      deleteView,
    }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsContext() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactionsContext deve ser usado dentro de TransactionsProvider');
  return ctx;
}