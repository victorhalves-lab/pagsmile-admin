import React from 'react';
import { Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function DataSourcesList({ dataSources = [] }) {
  if (!dataSources.length) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
          <Database className="w-4 h-4 text-cyan-600" />
        </div>
        De onde vêm os dados
      </h2>
      <div className="space-y-3">
        {dataSources.map((src, idx) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 font-mono text-xs">
                {src.entity || src.source}
              </Badge>
              {src.type && (
                <span className="text-xs text-slate-500">{src.type}</span>
              )}
            </div>
            {src.description && (
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                {src.description}
              </p>
            )}
            {Array.isArray(src.fields) && src.fields.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {src.fields.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}