import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const statusBadge = (status) => {
  if (status === 'registered') return <Badge className="bg-green-100 text-green-700">Registrado</Badge>;
  if (status === 'pending') return <Badge className="bg-amber-100 text-amber-700">Pendente</Badge>;
  return <Badge className="bg-red-100 text-red-700">Falhou</Badge>;
};

export default function AnticipationRegistradoraCard({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="w-5 h-5 text-violet-600" />
          Registro Regulatório
          <Badge className="bg-violet-100 text-violet-700 text-[10px]">Resolução BCB 4.734</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Registradora</p>
            <p className="font-semibold">CIP — Câmara Interbancária de Pagamentos</p>
          </div>
          {statusBadge(data.registradora_status)}
        </div>

        {data.registradora_id && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Identificador atribuído pela registradora</p>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{data.registradora_id}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText(data.registradora_id); toast.success('ID copiado'); }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <p>• Registro inicial: 09/05/2026 09:15:45</p>
          <p>• Última verificação: 09/05/2026 15:00:00</p>
          <p>• Sem consultas externas registradas</p>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="w-3 h-3 mr-1" /> Consultar registradora
        </Button>
      </CardContent>
    </Card>
  );
}