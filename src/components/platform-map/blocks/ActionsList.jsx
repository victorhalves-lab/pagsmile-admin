import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export default function ActionsList({ actions = [] }) {
  if (!actions.length) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Zap className="w-4 h-4 text-emerald-600" />
        </div>
        O que o usuário pode fazer
      </h2>
      <div className="space-y-2">
        {actions.map((action, idx) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-700">
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">{action.name}</h4>
                {action.flow && (
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {action.flow}
                  </p>
                )}
                {action.outcome && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                    <ArrowRight className="w-3 h-3" />
                    <span className="font-medium">{action.outcome}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}