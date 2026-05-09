import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Mentor F0317–F0337 — Fluxo de desbloqueio com checklist + alçada dupla.
 */
const CHECKLIST = [
  'Causa do bloqueio foi resolvida e documentada',
  'Lojista cumpriu requisitos de regularização',
  'Análise de risco / compliance foi reexecutada',
  'Não há outros bloqueios pendentes que afetem o fluxo',
  'Aprovação do gestor foi obtida',
];

export default function AdminIntUnblockFlow() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const merchantId = params.get('id');
  const blockageId = params.get('blockage_id');

  const [checked, setChecked] = useState({});
  const [evidence, setEvidence] = useState(false);
  const [notes, setNotes] = useState('');
  const [secondApprover, setSecondApprover] = useState('');
  const allChecked = CHECKLIST.every((_, i) => checked[i]);

  const submit = () => {
    toast.success('Desbloqueio aplicado');
    navigate(createPageUrl(`AdminIntMerchantProfile?id=${merchantId}&tab=bloqueios`));
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Desbloquear Lojista"
        subtitle={`Bloqueio ${blockageId || 'BLK-001'} — checklist obrigatório + alçada dupla`}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Lojista', page: `AdminIntMerchantProfile?id=${merchantId}` },
          { label: 'Desbloquear' },
        ]}
        icon={ShieldCheck}
      />

      <Card>
        <CardHeader><CardTitle>Checklist de "causa resolvida"</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {CHECKLIST.map((item, i) => (
            <label key={i} className="flex items-start gap-2 cursor-pointer">
              <Checkbox checked={!!checked[i]} onCheckedChange={(v) => setChecked({ ...checked, [i]: v })} className="mt-0.5" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Evidência</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Anexar evidência (e-mail, ofício, parecer interno) *</Label>
            <button
              onClick={() => setEvidence(true)}
              className={`w-full p-4 border-2 border-dashed rounded-lg text-center ${evidence ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300'}`}
            >
              {evidence ? (
                <div className="text-emerald-700">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-sm font-bold">parecer_compliance.pdf</p>
                </div>
              ) : (
                <div className="text-slate-500">
                  <Upload className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-sm">Clique para anexar</p>
                </div>
              )}
            </button>
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          <div>
            <Label>Segundo aprovador (alçada dupla) *</Label>
            <Select value={secondApprover} onValueChange={setSecondApprover}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ana@pagsmile.com">ana@pagsmile.com (Compliance Sr.)</SelectItem>
                <SelectItem value="bruno@pagsmile.com">bruno@pagsmile.com (Risco Sr.)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
        <Button onClick={submit} disabled={!allChecked || !evidence || !secondApprover}>
          <ShieldCheck className="w-4 h-4 mr-1" /> Aplicar desbloqueio
        </Button>
      </div>
    </div>
  );
}