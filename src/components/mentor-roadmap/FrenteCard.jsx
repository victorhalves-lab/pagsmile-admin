import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown, ChevronRight, Plus, Wrench, Layers, Sparkles, Award,
  Database, User, Rocket, Building, Wallet, FileCheck, Ban, Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIO_COLORS = {
  P0: 'bg-red-100 text-red-700 border-red-200',
  P1: 'bg-amber-100 text-amber-700 border-amber-200',
  P2: 'bg-slate-100 text-slate-700 border-slate-200',
};

const ESFORCO_COLORS = {
  S: 'bg-emerald-100 text-emerald-700',
  M: 'bg-blue-100 text-blue-700',
  L: 'bg-orange-100 text-orange-700',
  XL: 'bg-purple-100 text-purple-700',
};

// Mapa explícito de ícones (em vez de import * que o validador rejeita)
const ICONS_MAP = {
  Database, User, Rocket, Building, Wallet, FileCheck, Ban, Network, Layers,
};

export default function FrenteCard({ frente, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const Icon = ICONS_MAP[frente.iconeNome] || Layers;

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0', `bg-gradient-to-br ${frente.cor}`)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              <span className="text-slate-400 mr-2">#{index + 1}</span>
              {frente.titulo}
            </h3>
            <Badge className={PRIO_COLORS[frente.prioridade]}>{frente.prioridade}</Badge>
            <Badge className={ESFORCO_COLORS[frente.esforco]}>Esforço {frente.esforco}</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{frente.descricao}</p>
          <p className="text-xs text-slate-400 mt-1">Cobre {frente.cobre}</p>
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 space-y-5 bg-slate-50/50 dark:bg-slate-900/20">
          {/* Valor */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <Award className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-900">Valor de negócio</p>
              <p className="text-xs text-emerald-800 mt-0.5">{frente.valor}</p>
            </div>
          </div>

          {/* Benchmark */}
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#2bc196]" />
              <p className="font-bold text-sm text-slate-900">Benchmark de mercado</p>
            </div>
            <ul className="space-y-1 text-xs text-slate-600">
              {Object.entries(frente.benchmark).map(([key, val]) => (
                <li key={key} className="flex items-start gap-2">
                  <span className={cn('font-bold uppercase text-[10px] px-1.5 py-0.5 rounded',
                    key === 'diferencial' ? 'bg-[#2bc196] text-white' : 'bg-slate-100 text-slate-600')}>{key}</span>
                  <span className={key === 'diferencial' ? 'text-slate-900 font-medium' : ''}>{val}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Páginas novas */}
          {frente.paginasNovas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <p className="font-bold text-sm text-slate-900">Páginas novas a criar ({frente.paginasNovas.length})</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {frente.paginasNovas.map((p) => (
                  <code key={p} className="text-xs px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 break-all">{p}</code>
                ))}
              </div>
            </div>
          )}

          {/* Páginas expandidas */}
          {frente.paginasExpandidas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                <p className="font-bold text-sm text-slate-900">Páginas existentes a expandir (sem remover nada)</p>
              </div>
              <div className="space-y-3">
                {frente.paginasExpandidas.map((pg) => (
                  <div key={pg.path} className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                    <code className="text-xs font-bold text-amber-900 block mb-2">{pg.path}</code>
                    <ul className="space-y-1.5">
                      {pg.adicionar.map((item, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="text-emerald-600 font-bold mt-0.5">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Componentes novos */}
          {frente.componentesNovos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <p className="font-bold text-sm text-slate-900">Componentes novos ({frente.componentesNovos.length})</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {frente.componentesNovos.map((c) => (
                  <code key={c} className="text-[11px] px-2 py-1 rounded bg-purple-50 border border-purple-200 text-purple-900">{c.split('/').pop()}</code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}