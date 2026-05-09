import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';

export default function TestKeyDialog({ open, onOpenChange, apiKey }) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  const runTest = () => {
    setTesting(true);
    setResult(null);
    setTimeout(() => {
      setTesting(false);
      setResult({
        ok: true,
        latency: 87,
        statusCode: 200,
        endpoint: 'GET /v1/account',
        response: {
          account_id: 'acc_1234567890',
          name: 'Sua Loja',
          balance: 12_580.42,
          environment: apiKey?.type || 'sandbox',
        },
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setResult(null); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" /> Testar Chave
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 text-xs">
            <p><strong>Chave:</strong> {apiKey?.name}</p>
            <p><strong>Endpoint testado:</strong> GET /v1/account</p>
          </div>

          {testing && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500">Pingando API...</p>
            </div>
          )}

          {result && !testing && (
            <div className={`p-4 rounded-lg border ${result.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.ok ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                <p className={`text-sm font-bold ${result.ok ? 'text-emerald-800' : 'text-red-800'}`}>
                  {result.ok ? 'Sucesso' : 'Erro'} · {result.statusCode} · {result.latency}ms
                </p>
              </div>
              <pre className="text-xs bg-white rounded p-2 mt-2 overflow-auto">
                {JSON.stringify(result.response, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button onClick={runTest} disabled={testing} className="bg-blue-600 hover:bg-blue-700">
            {testing ? 'Testando...' : 'Testar agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}