import React, { useState } from 'react';
import { Code2, Eye, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

/**
 * UI/Code toggle — wraps a UI block and shows API equivalent code on toggle.
 * snippets: { curl, node, python }
 */
export default function CodeViewToggle({ children, snippets = {}, defaultTab = 'curl', className }) {
  const [view, setView] = useState('ui');
  const [tab, setTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const code = snippets[tab] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast({ title: 'Copiado', description: 'Snippet copiado para a área de transferência.' });
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-end gap-2 mb-3">
        <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => setView('ui')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all',
              view === 'ui' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500'
            )}
          >
            <Eye className="w-3.5 h-3.5" /> UI
          </button>
          <button
            onClick={() => setView('code')}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all',
              view === 'code' ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-slate-100' : 'text-slate-500'
            )}
          >
            <Code2 className="w-3.5 h-3.5" /> Code
          </button>
        </div>
      </div>

      {view === 'ui' ? (
        children
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="bg-slate-800/50 h-8">
                {snippets.curl && <TabsTrigger value="curl" className="text-xs h-6 data-[state=active]:bg-slate-950">cURL</TabsTrigger>}
                {snippets.node && <TabsTrigger value="node" className="text-xs h-6 data-[state=active]:bg-slate-950">Node.js</TabsTrigger>}
                {snippets.python && <TabsTrigger value="python" className="text-xs h-6 data-[state=active]:bg-slate-950">Python</TabsTrigger>}
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs text-slate-400 hover:text-white hover:bg-slate-800">
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
          <pre className="p-4 text-xs text-slate-200 overflow-x-auto font-mono leading-relaxed">
            <code>{snippets[tab] || '// snippet não disponível'}</code>
          </pre>
        </div>
      )}
    </div>
  );
}