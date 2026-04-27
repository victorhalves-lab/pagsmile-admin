import React from 'react';
import { Sparkles, Users, MapPin } from 'lucide-react';

export default function PageOverview({ doc }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold leading-tight">{doc.pageName || doc.pageId}</h2>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
            {doc.module && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {doc.module}
              </span>
            )}
            {doc.route && <span className="font-mono">{doc.route}</span>}
          </div>
        </div>
      </div>

      {doc.purpose && (
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-2">
            O que é esta tela
          </h3>
          <p className="text-sm text-slate-100 leading-relaxed">{doc.purpose}</p>
        </div>
      )}

      {doc.userContext && (
        <div className="mt-3 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Quem usa e quando
          </h3>
          <p className="text-sm text-slate-100 leading-relaxed">{doc.userContext}</p>
        </div>
      )}
    </div>
  );
}