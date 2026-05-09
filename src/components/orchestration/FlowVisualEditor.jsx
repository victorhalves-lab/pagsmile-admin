import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  GitBranch, Plus, Trash2, ArrowDown, Settings2, Sparkles, 
  AlertCircle, CheckCircle2, ZapOff, Zap, ArrowRightLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NODE_TYPES = {
  trigger: { label: 'Gatilho', icon: Zap, color: 'emerald' },
  condition: { label: 'Condição', icon: GitBranch, color: 'blue' },
  acquirer: { label: 'Adquirente', icon: ArrowRightLeft, color: 'violet' },
  fallback: { label: 'Fallback', icon: ZapOff, color: 'amber' },
  action: { label: 'Ação', icon: Settings2, color: 'slate' },
};

const COLOR_CLASSES = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-400', icon: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-300 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-400', icon: 'bg-blue-500' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-300 dark:border-violet-700', text: 'text-violet-700 dark:text-violet-400', icon: 'bg-violet-500' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-400', icon: 'bg-amber-500' },
  slate: { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300', icon: 'bg-slate-500' },
};

/**
 * FlowVisualEditor — Editor visual de fluxos de orquestração de pagamento.
 * Suporta nós: trigger, condition, acquirer, fallback, action
 */
export default function FlowVisualEditor({ initialNodes, onChange, readOnly = false }) {
  const [nodes, setNodes] = useState(initialNodes || [
    { id: 1, type: 'trigger', label: 'Início do pagamento', config: { event: 'payment.init' } },
    { id: 2, type: 'condition', label: 'Se valor > R$ 1.000', config: { rule: 'amount > 1000' } },
    { id: 3, type: 'acquirer', label: 'Tenta Adyen (premium)', config: { acquirer: 'adyen', timeout: 8 } },
    { id: 4, type: 'fallback', label: 'Fallback Cielo', config: { acquirer: 'cielo', after: 'soft_decline' } },
    { id: 5, type: 'action', label: 'Notificar webhook', config: { event: 'payment.routed' } },
  ]);

  const updateNodes = (n) => {
    setNodes(n);
    onChange?.(n);
  };

  const addNode = (type) => {
    const id = Math.max(...nodes.map(n => n.id), 0) + 1;
    updateNodes([...nodes, { id, type, label: `Novo ${NODE_TYPES[type].label}`, config: {} }]);
  };

  const removeNode = (id) => {
    if (nodes.length <= 1) return;
    updateNodes(nodes.filter(n => n.id !== id));
  };

  const updateNode = (id, key, value) => {
    updateNodes(nodes.map(n => n.id === id ? { ...n, [key]: value } : n));
  };

  return (
    <Card className="p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-base">Editor Visual de Fluxo</h4>
            <p className="text-xs text-slate-500">Construa o caminho de orquestração do pagamento</p>
          </div>
        </div>
        {!readOnly && (
          <div className="flex gap-1">
            {Object.entries(NODE_TYPES).map(([type, cfg]) => {
              const Icon = cfg.icon;
              return (
                <Button key={type} size="sm" variant="outline" onClick={() => addNode(type)} className="text-xs h-8 gap-1">
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-1">
        {nodes.map((node, idx) => {
          const cfg = NODE_TYPES[node.type] || NODE_TYPES.action;
          const Icon = cfg.icon;
          const colors = COLOR_CLASSES[cfg.color];

          return (
            <div key={node.id}>
              <div className={cn('flex items-stretch gap-2 rounded-xl border-2 p-3', colors.bg, colors.border)}>
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white shadow', colors.icon)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-500 uppercase">{cfg.label}</Label>
                    <Input
                      value={node.label}
                      onChange={(e) => updateNode(node.id, 'label', e.target.value)}
                      className="h-9 text-sm mt-0.5"
                      readOnly={readOnly}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 uppercase">Config (JSON)</Label>
                    <Input
                      value={JSON.stringify(node.config)}
                      onChange={(e) => {
                        try {
                          updateNode(node.id, 'config', JSON.parse(e.target.value));
                        } catch (err) {/* ignore */}
                      }}
                      className="h-9 text-xs font-mono mt-0.5"
                      readOnly={readOnly}
                    />
                  </div>
                </div>
                {!readOnly && (
                  <Button size="icon" variant="ghost" className="self-center w-8 h-8" onClick={() => removeNode(node.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  </Button>
                )}
              </div>
              {idx < nodes.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}