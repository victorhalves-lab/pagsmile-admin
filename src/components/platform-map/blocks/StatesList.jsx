import React from 'react';
import { Layers } from 'lucide-react';

const STATE_COLORS = {
  loading: 'bg-slate-100 border-slate-200 text-slate-700',
  empty: 'bg-amber-50 border-amber-200 text-amber-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  default: 'bg-blue-50 border-blue-200 text-blue-700',
};

export default function StatesList({ states = [] }) {
  if (!states.length) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Layers className="w-4 h-4 text-blue-600" />
        </div>
        Estados visuais da tela
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {states.map((state, idx) => {
          const stateKey = (state.name || '').toLowerCase();
          const colorClass =
            STATE_COLORS[stateKey] ||
            (stateKey.includes('loading')
              ? STATE_COLORS.loading
              : stateKey.includes('vazio') || stateKey.includes('empty')
              ? STATE_COLORS.empty
              : stateKey.includes('erro') || stateKey.includes('error')
              ? STATE_COLORS.error
              : stateKey.includes('sucesso') || stateKey.includes('success')
              ? STATE_COLORS.success
              : STATE_COLORS.default);

          return (
            <div
              key={idx}
              className={`border rounded-xl p-3 ${colorClass}`}
            >
              <h4 className="font-bold text-sm mb-1">{state.name}</h4>
              {state.description && (
                <p className="text-xs leading-relaxed opacity-90">
                  {state.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}