import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pause } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Mentor F0317-F0337 (parte) — Fluxo de suspensão (voluntária / programada / preventiva).
 */
export default function AdminIntSuspensionFlow() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const merchantId = params.get('id');
  const [type, setType] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');

  const submit = () => {
    toast.success('Suspensão programada');
    navigate(createPageUrl(`AdminIntMerchantProfile?id=${merchantId}&tab=bloqueios`));
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Suspender Lojista"
        subtitle="Suspensão voluntária, sazonal ou preventiva"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Lojista', page: `AdminIntMerchantProfile?id=${merchantId}` },
          { label: 'Suspender' },
        ]}
        icon={Pause}
      />

      <Card>
        <CardHeader><CardTitle>Tipo de suspensão</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipo *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="voluntary">Voluntária (a pedido do lojista)</SelectItem>
                <SelectItem value="seasonal">Sazonal (lojista de temporada)</SelectItem>
                <SelectItem value="preventive">Preventiva (análise interna)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Início *</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <Label>Fim previsto (opcional)</Label>
              <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Justificativa *</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button onClick={submit} disabled={!type || !start || !reason}>
              <Pause className="w-4 h-4 mr-1" /> Aplicar suspensão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}