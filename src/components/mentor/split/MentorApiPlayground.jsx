import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code2, Play, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const METHOD_COLORS = {
  GET: 'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function MentorApiPlayground({ endpoints = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [requestBody, setRequestBody] = useState(JSON.stringify(endpoints[0]?.sample_request || {}, null, 2));
  const [responseBody, setResponseBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);

  const active = endpoints[activeIdx];

  const switchEndpoint = (idx) => {
    setActiveIdx(idx);
    setRequestBody(JSON.stringify(endpoints[idx].sample_request, null, 2));
    setResponseBody('');
    setResponseTime(null);
  };

  const execute = () => {
    setLoading(true);
    setResponseBody('');
    const start = Date.now();
    setTimeout(() => {
      setResponseTime(Date.now() - start);
      setResponseBody(JSON.stringify(active.sample_response, null, 2));
      setLoading(false);
      toast.success('Requisição simulada · sandbox');
    }, 600 + Math.random() * 400);
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* Lista de endpoints */}
      <div className="lg:col-span-3 space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-500">Endpoints</p>
        {endpoints.map((ep, i) => (
          <button
            key={i}
            onClick={() => switchEndpoint(i)}
            className={cn(
              'w-full text-left p-2 rounded-lg border transition',
              activeIdx === i
                ? 'bg-violet-50 border-violet-300 ring-1 ring-violet-200'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-violet-300'
            )}
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge className={cn('text-[9px] font-mono', METHOD_COLORS[ep.method])}>{ep.method}</Badge>
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{ep.name}</p>
            </div>
            <code className="text-[10px] font-mono text-slate-500 truncate block">{ep.path}</code>
          </button>
        ))}
      </div>

      {/* Playground */}
      <div className="lg:col-span-9 space-y-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
              <Code2 className="w-4 h-4 text-violet-600" />
              <Badge className={cn('text-[10px] font-mono', METHOD_COLORS[active?.method])}>{active?.method}</Badge>
              <code className="text-xs font-mono text-slate-700 dark:text-slate-200">{active?.path}</code>
            </CardTitle>
            <p className="text-[11px] text-slate-500">{active?.description}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Request body</p>
                <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => copy(requestBody)}>
                  <Copy className="w-3 h-3 mr-1" /> Copiar
                </Button>
              </div>
              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={8}
                className="font-mono text-[11px] bg-slate-50 dark:bg-slate-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={execute} disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                <Play className="w-3.5 h-3.5 mr-1" />
                {loading ? 'Executando…' : 'Executar (sandbox)'}
              </Button>
              {responseTime != null && (
                <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 200 OK · {responseTime}ms
                </Badge>
              )}
            </div>

            {responseBody && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">Response body</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => copy(responseBody)}>
                    <Copy className="w-3 h-3 mr-1" /> Copiar
                  </Button>
                </div>
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded font-mono text-[11px] overflow-x-auto max-h-[300px]">
                  {responseBody}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}