import React, { useState } from 'react';
import { Layers, Repeat, ShoppingBag, Network, GraduationCap, CheckCircle2, Clock, Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageHeader from '@/components/common/PageHeader';
import { playbooks } from '@/components/mockData/futureAdminMocks';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ICON_MAP = { Repeat, ShoppingBag, Network, GraduationCap };

export default function Playbooks() {
  const { toast } = useToast();
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setSelected(null);
      toast({ title: 'Playbook aplicado', description: `${selected.title} foi configurado.` });
    }, 1400);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Playbooks" subtitle="Configurações curadas por vertical, em 1-click" icon={Layers} sparkles />

      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 via-pink-500/5 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Comece configurado pra sua vertical</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Presets curados por especialistas PagSmile. Aplique em 1-click e ajuste depois.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {playbooks.map((pb) => {
          const Icon = ICON_MAP[pb.icon];
          return (
            <div key={pb.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg hover:border-[#2bc196]/40 transition-all">
              <div className={cn('h-2 bg-gradient-to-r', pb.color)} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md', pb.color)}>
                    {Icon && <Icon className="w-7 h-7 text-white" />}
                  </div>
                  <Badge variant="outline" className="gap-1 text-[10px]"><Clock className="w-3 h-3" />{pb.timeToApply}</Badge>
                </div>
                <h3 className="text-xl font-bold">{pb.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed mb-4">{pb.summary}</p>
                <div className="space-y-1.5 mb-4">
                  {pb.presets.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2bc196] flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                  {pb.presets.length > 4 && (<p className="text-[11px] text-slate-500 italic pl-5">+ {pb.presets.length - 4} configurações</p>)}
                </div>
                <div className="flex flex-wrap gap-1 mb-5">
                  {pb.tags.map((t, i) => (<Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>))}
                </div>
                <Button onClick={() => setSelected(pb)} className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                  Visualizar e aplicar <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', selected.color)}>
                    {ICON_MAP[selected.icon] && React.createElement(ICON_MAP[selected.icon], { className: 'w-6 h-6 text-white' })}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selected.title}</DialogTitle>
                    <DialogDescription>{selected.summary}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-3 my-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Configurações que serão aplicadas</h4>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2">
                  {selected.presets.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#2bc196] flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-700 dark:text-amber-400">
                <strong>Atenção:</strong> Aplicar este playbook substitui suas configurações atuais. Tudo é registrado no Audit Trail.
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}><X className="w-4 h-4 mr-1" /> Cancelar</Button>
                <Button onClick={handleApply} disabled={applying} className="bg-[#2bc196] hover:bg-[#25a880]">
                  {applying ? 'Aplicando...' : (<><Sparkles className="w-4 h-4 mr-1" /> Aplicar</>)}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}