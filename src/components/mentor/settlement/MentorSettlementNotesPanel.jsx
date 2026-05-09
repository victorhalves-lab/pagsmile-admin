import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORY_META = {
  financial_review: { label: 'Revisão financeira', color: 'bg-emerald-100 text-emerald-700' },
  customer_success: { label: 'Customer Success', color: 'bg-blue-100 text-blue-700' },
  audit: { label: 'Auditoria', color: 'bg-violet-100 text-violet-700' },
  technical: { label: 'Troubleshoot', color: 'bg-amber-100 text-amber-700' },
  general: { label: 'Geral', color: 'bg-slate-100 text-slate-700' },
};

export default function MentorSettlementNotesPanel({ notes = [] }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('financial_review');

  const submit = () => {
    if (!content.trim()) return;
    toast.success('Nota adicionada à ficha');
    setContent('');
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-600" /> Notas administrativas ({notes.length})
        </CardTitle>
        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setOpen(!open)}>
          <Plus className="w-3 h-3 mr-1" /> Nova nota
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {open && (
          <div className="bg-violet-50/50 border border-violet-200 rounded p-2.5 space-y-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_META).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Conteúdo da nota..." rows={3} className="text-xs" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button size="sm" className="h-7 text-[11px] bg-violet-600 hover:bg-violet-700" onClick={submit}>Salvar nota</Button>
            </div>
          </div>
        )}
        {notes.map((n, i) => {
          const meta = CATEGORY_META[n.category] || CATEGORY_META.general;
          return (
            <div key={i} className="border-l-4 border-violet-300 bg-slate-50/50 pl-3 py-2 rounded-r">
              <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                <span className="text-[11px] font-bold text-slate-700">{n.author}</span>
                <Badge className={cn('text-[9px]', meta.color)}>{meta.label}</Badge>
                <span className="text-[10px] text-slate-400 font-mono ml-auto">{new Date(n.timestamp).toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-[11px] text-slate-700">{n.content}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}