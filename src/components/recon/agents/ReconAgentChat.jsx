import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Bot, User as UserIcon, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Painel de chat genérico com um agente de reconciliação.
 * Props:
 *  - agentName: 'investigator' | 'communicator' | 'reviewer'
 *  - title: rótulo exibido
 *  - defaultPrompt: texto pré-preenchido (ex: "Investigue a Divergence ID xyz")
 */
export default function ReconAgentChat({ agentName, title, defaultPrompt = '' }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(defaultPrompt);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setInput(defaultPrompt);
  }, [defaultPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const ensureConversation = async () => {
    if (conversation) return conversation;
    const conv = await base44.agents.createConversation({
      agent_name: agentName,
      metadata: { name: `Recon · ${agentName}`, description: `Cockpit ${agentName}` },
    });
    setConversation(conv);
    return conv;
  };

  useEffect(() => {
    if (!conversation?.id) return;
    const unsub = base44.agents.subscribeToConversation(conversation.id, (data) => {
      setMessages(data.messages || []);
      const lastTool = data.messages?.flatMap(m => m.tool_calls || []).slice(-1)[0];
      const stillRunning = lastTool && (lastTool.status === 'running' || lastTool.status === 'pending' || lastTool.status === 'in_progress');
      if (!stillRunning && busy) setBusy(false);
    });
    return () => unsub?.();
  }, [conversation?.id]);

  const send = async () => {
    if (!input.trim() || busy) return;
    setBusy(true);
    const conv = await ensureConversation();
    await base44.agents.addMessage(conv, { role: 'user', content: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-xl bg-white">
      <div className="px-4 py-3 border-b bg-slate-50 rounded-t-xl flex items-center gap-2">
        <Bot className="w-4 h-4 text-[#2bc196]" />
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-slate-500">· agente: {agentName}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
        {messages.length === 0 && (
          <div className="text-center text-sm text-slate-400 py-12">
            Envie a primeira mensagem para iniciar a investigação.
          </div>
        )}
        {messages.map((m, i) => (
          <MessageRow key={i} msg={m} />
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" /> Agente trabalhando...
          </div>
        )}
      </div>

      <div className="border-t p-3 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Diga ao agente o que fazer..."
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send();
            }}
          />
          <Button onClick={send} disabled={busy || !input.trim()} className="bg-[#2bc196] hover:bg-[#25a880]">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Ctrl/⌘+Enter para enviar</p>
      </div>
    </div>
  );
}

function MessageRow({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-[#2bc196]/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-[#2bc196]" />
        </div>
      )}
      <div className={cn('max-w-[80%] space-y-1.5')}>
        {msg.content && (
          <div
            className={cn(
              'rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
              isUser ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200'
            )}
          >
            {msg.content}
          </div>
        )}
        {msg.tool_calls?.map((tc, i) => (
          <ToolCallRow key={i} tc={tc} />
        ))}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-4 h-4 text-slate-600" />
        </div>
      )}
    </div>
  );
}

function ToolCallRow({ tc }) {
  const status = tc.status;
  const Icon =
    status === 'completed' || status === 'success'
      ? CheckCircle2
      : status === 'failed' || status === 'error'
      ? AlertCircle
      : status === 'running' || status === 'pending' || status === 'in_progress'
      ? Loader2
      : Wrench;
  const color =
    status === 'completed' || status === 'success'
      ? 'text-emerald-600'
      : status === 'failed' || status === 'error'
      ? 'text-red-600'
      : 'text-slate-500';

  return (
    <details className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1">
      <summary className="cursor-pointer flex items-center gap-2">
        <Icon className={cn('w-3 h-3', color, status === 'running' && 'animate-spin')} />
        <span className="font-mono text-slate-700">{tc.name}</span>
        <span className="text-slate-400">· {status}</span>
      </summary>
      {tc.arguments_string && (
        <pre className="mt-1 text-[10px] bg-white p-2 rounded overflow-auto max-h-32">
          {(() => {
            try {
              return JSON.stringify(JSON.parse(tc.arguments_string), null, 2);
            } catch {
              return tc.arguments_string;
            }
          })()}
        </pre>
      )}
      {tc.results && (
        <pre className="mt-1 text-[10px] bg-white p-2 rounded overflow-auto max-h-40">
          {typeof tc.results === 'string' ? tc.results : JSON.stringify(tc.results, null, 2)}
        </pre>
      )}
    </details>
  );
}