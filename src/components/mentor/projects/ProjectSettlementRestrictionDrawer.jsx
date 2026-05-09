import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Banknote, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EntityFormDrawer } from '@/components/common/drawers';
import { OTPConfirmDialog } from '@/components/mentor';
import { toast } from 'sonner';

const LEVELS = [
  { id: 'sem_restricao', label: 'Sem restrição', desc: 'Permite contas de terceiros (alto risco)', color: 'text-red-600' },
  { id: 'flexivel', label: 'Titularidade flexível', desc: 'Permite contas relacionadas com justificativa', color: 'text-amber-600' },
  { id: 'mesma_titularidade', label: 'Mesma titularidade obrigatória', desc: 'Exige correspondência exata CNPJ ↔ conta', color: 'text-emerald-600' },
];

const MOCK_AFFECTED = 12;

export default function ProjectSettlementRestrictionDrawer({ open, onOpenChange, project, onSaved }) {
  const [level, setLevel] = useState(project?.settlement_restriction || 'mesma_titularidade');
  const [exceptions, setExceptions] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => setShowOTP(true);
  const handleOTPConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setShowOTP(false);
    onOpenChange(false);
    if (onSaved) onSaved({ level, exceptions });
    toast.success(`Restrição atualizada · ${MOCK_AFFECTED} lojistas afetados serão comunicados`);
  };

  const isStricter = (project?.settlement_restriction === 'flexivel' && level === 'mesma_titularidade');

  return (
    <>
      <EntityFormDrawer
        open={open}
        onOpenChange={onOpenChange}
        title="Restrição de conta bancária para liquidação"
        description="Configure regra que se aplica aos lojistas vinculados ao projeto"
        icon={Banknote}
        size="md"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase">Nível de restrição</Label>
            {LEVELS.map((l) => (
              <label key={l.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${level === l.id ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200'}`}>
                <input type="radio" checked={level === l.id} onChange={() => setLevel(l.id)} className="mt-1" />
                <div>
                  <p className={`text-sm font-semibold ${l.color}`}>{l.label}</p>
                  <p className="text-[11px] text-slate-500">{l.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div>
            <Label>Exceções permitidas (texto livre)</Label>
            <Textarea value={exceptions} onChange={(e) => setExceptions(e.target.value)} placeholder="Ex: PJ pode receber em conta PF do dono, holding em conta de subsidiária..." className="min-h-[80px]" />
          </div>

          {isStricter && (
            <Card className="bg-amber-50 border-amber-300 dark:bg-amber-900/20">
              <CardContent className="p-3 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">Impacto em cadastros existentes</p>
                  <p className="text-[11px] text-amber-800 mt-1">{MOCK_AFFECTED} lojistas com conta de terceiro ficarão não-conformes com a nova regra</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-white text-amber-700 text-[10px]">Opção: aplicar com migração obrigatória</Badge>
                    <Badge className="bg-white text-amber-700 text-[10px]">Opção: período de adequação 30d</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </EntityFormDrawer>

      <OTPConfirmDialog open={showOTP} onOpenChange={setShowOTP} onConfirm={handleOTPConfirm} submitting={submitting}
        description="Mudança afeta lojistas existentes · comunicação prévia aos afetados é boa prática." />
    </>
  );
}