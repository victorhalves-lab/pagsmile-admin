import React from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function MentorAdvancedFiltersDrawer({ open, onOpenChange }) {
  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Filtros Avançados"
      description="Filtros adicionais — NSU, ARN, códigos técnicos, retries, tempo de processamento, regras antifraude"
      icon={Filter}
      iconClassName="bg-violet-100 text-violet-600"
      footer={
        <div className="flex justify-between w-full">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => { toast.success('Filtros aplicados'); onOpenChange(false); }}>
            Aplicar filtros
          </Button>
        </div>
      }
    >
      <Card className="bg-violet-50 dark:bg-violet-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5" />
          <p className="text-violet-900 dark:text-violet-200">Filtros que <strong>não existem</strong> em concorrentes — buscam por campos técnicos profundos que economizam horas no troubleshoot operacional.</p>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-600 mb-2">Identificadores técnicos</p>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">NSU</Label><Input placeholder="789456..." className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Código de autorização</Label><Input placeholder="123456" className="h-8 text-xs" /></div>
            <div><Label className="text-xs">TID</Label><Input placeholder="123..." className="h-8 text-xs" /></div>
            <div><Label className="text-xs">ARN (23 dígitos)</Label><Input placeholder="123..." className="h-8 text-xs" /></div>
            <div><Label className="text-xs">E2E ID (Pix)</Label><Input placeholder="E18236..." className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Últimos 4 dígitos</Label><Input placeholder="1234" maxLength={4} className="h-8 text-xs" /></div>
            <div><Label className="text-xs">BIN (6 primeiros)</Label><Input placeholder="411111" maxLength={6} className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Order ID merchant</Label><Input placeholder="ORD-123" className="h-8 text-xs" /></div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-600 mb-2">Performance técnica</p>
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="text-xs">Tempo proc. mín (ms)</Label><Input type="number" placeholder="0" className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Tempo proc. máx (ms)</Label><Input type="number" placeholder="30000" className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Nº retries mín</Label><Input type="number" placeholder="0" className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Nº retries máx</Label><Input type="number" placeholder="10" className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Código resposta adquirente</Label><Input placeholder="00, 51, 65..." className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Score risco mín</Label><Input type="number" placeholder="0" max="999" className="h-8 text-xs" /></div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-600 mb-2">Regras &amp; flags</p>
          <div className="grid grid-cols-1 gap-2">
            <div><Label className="text-xs">Regras antifraude disparadas</Label><Input placeholder="3DS_REQUIRED, VELOCITY..." className="h-8 text-xs" /></div>
            <div><Label className="text-xs">Flag de inconsistência</Label>
              <select className="h-8 text-xs w-full border rounded-md px-2 dark:bg-slate-900">
                <option value="any">Qualquer</option>
                <option value="value_mismatch">Valor divergente</option>
                <option value="status_mismatch">Status divergente</option>
                <option value="phantom">Fantasma</option>
                <option value="settlement_late">Liquidação atrasada</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" /> Apenas com chargeback</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" /> Apenas com retry</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" /> Apenas com fallback</label>
            </div>
          </div>
        </div>
      </div>
    </SideDrawer>
  );
}