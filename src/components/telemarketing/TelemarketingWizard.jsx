import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Cliente' },
  { id: 2, label: 'Itens' },
  { id: 3, label: 'Pagamento' },
  { id: 4, label: 'Confirmação' },
  { id: 5, label: 'Cobrança' },
];

export default function TelemarketingWizard({ current }) {
  return (
    <div className="bg-white border rounded-xl p-3 shadow-sm">
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => {
          const done = current > s.id;
          const active = current === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  done ? 'bg-[#2bc196] border-[#2bc196] text-white' :
                  active ? 'border-[#2bc196] text-[#2bc196] bg-white' :
                  'border-slate-300 text-slate-400 bg-white'
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{s.id}</span>}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${
                  active ? 'text-[#2bc196]' : done ? 'text-slate-700' : 'text-slate-400'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${done ? 'bg-[#2bc196]' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}