import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { flatEvents } from './eventCatalog';

const SAMPLE_PAYLOADS = {
  'transaction.approved': {
    id: 'evt_test_1',
    type: 'transaction.approved',
    data: {
      object: { id: 'tr_test_xyz', amount: 24750, currency: 'BRL', status: 'approved', customer: { name: 'João Teste', email: 'test@example.com' } },
    },
  },
  'pix.received': {
    id: 'evt_test_2',
    type: 'pix.received',
    data: { object: { id: 'pix_test_abc', amount: 5000, end_to_end_id: 'E000000000202605091200xxxxxxxx' } },
  },
};

export default function TestWebhookDialog({ open, onOpenChange, webhook }) {
  const [eventType, setEventType] = useState('transaction.approved');
  const [payload, setPayload] = useState(JSON.stringify(SAMPLE_PAYLOADS['transaction.approved'], null, 2));
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleEventChange = (id) => {
    setEventType(id);
    setPayload(JSON.stringify(SAMPLE_PAYLOADS[id] || { id: 'evt_test', type: id, data: { object: {} } }, null, 2));
  };

  const handleSend = () => {
    setSending(true);
    setResult(null);
    setTimeout(() => {
      setSending(false);
      const ok = Math.random() > 0.15;
      setResult({
        ok,
        statusCode: ok ? 200 : 500,
        latency: Math.round(80 + Math.random() * 300),
        response: ok ? { received: true } : { error: 'Internal Server Error' },
      });
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setResult(null); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" /> Enviar evento de teste
          </DialogTitle>
          <DialogDescription>
            Envia um payload simulado para <code className="text-xs bg-slate-100 px-1 rounded">{webhook?.url}</code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Tipo de Evento</Label>
            <Select value={eventType} onValueChange={handleEventChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {flatEvents.slice(0, 30).map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] font-mono">{e.id}</code>
                      <span className="text-xs text-slate-500">— {e.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Payload (editável)</Label>
            <Textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="font-mono text-xs h-44 bg-slate-900 text-emerald-300 border-slate-700"
            />
          </div>

          {sending && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-800">Enviando para {webhook?.url}...</span>
            </div>
          )}

          {result && (
            <div className={`p-3 rounded-lg border ${result.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                <p className={`text-sm font-bold ${result.ok ? 'text-emerald-800' : 'text-red-800'}`}>
                  {result.ok ? 'Sucesso' : 'Falha'}
                </p>
                <Badge className={`text-[10px] ml-auto ${result.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  HTTP {result.statusCode} · {result.latency}ms
                </Badge>
              </div>
              <pre className="text-[10px] bg-white rounded p-2 overflow-auto max-h-32">
                {JSON.stringify(result.response, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button onClick={handleSend} disabled={sending} className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" /> {sending ? 'Enviando...' : 'Enviar teste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}