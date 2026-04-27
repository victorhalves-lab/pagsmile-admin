import React from 'react';
import { Navigation, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NavigationMap({ navigation = [] }) {
  if (!navigation.length) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <Navigation className="w-4 h-4 text-indigo-600" />
        </div>
        Navegação a partir desta tela
      </h2>
      <div className="space-y-2">
        {navigation.map((nav, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm"
          >
            {nav.direction === 'in' ? (
              <ArrowLeft className="w-4 h-4 text-slate-400 flex-shrink-0" />
            ) : (
              <ArrowRight className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <span className="font-mono text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                {nav.to}
              </span>
              {nav.via && (
                <span className="ml-2 text-slate-600 text-xs">via {nav.via}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}