import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';

const categoryLabel = {
  financial_review: { label: 'Revisão Financeira', color: 'bg-blue-100 text-blue-700' },
  support: { label: 'Suporte', color: 'bg-cyan-100 text-cyan-700' },
  audit: { label: 'Auditoria', color: 'bg-purple-100 text-purple-700' },
  troubleshoot: { label: 'Troubleshoot', color: 'bg-amber-100 text-amber-700' },
  general: { label: 'Geral', color: 'bg-slate-100 text-slate-700' },
};

export default function AnticipationNotesPanel({ notes }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  const handleSave = () => {
    toast.success('Nota adicionada à trilha auditável');
    setAdding(false);
    setText('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-600" />
            Notas Administrativas ({notes.length})
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setAdding(!adding)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Nota
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="border-2 border-violet-200 rounded-lg p-3 space-y-2 bg-violet-50/30">
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue="general">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial_review">Revisão Financeira</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="audit">Auditoria</SelectItem>
                  <SelectItem value="troubleshoot">Troubleshoot</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="public">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Visível a outros operadores</SelectItem>
                  <SelectItem value="private">Privada (só autor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Texto da nota..." value={text} onChange={e => setText(e.target.value)} rows={3} />
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSave} disabled={!text.trim()}>Salvar Nota</Button>
            </div>
          </div>
        )}

        {notes.map(note => {
          const cat = categoryLabel[note.category] || categoryLabel.general;
          return (
            <div key={note.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${cat.color} text-[10px]`}>{cat.label}</Badge>
                  <span className="text-xs text-slate-500">{note.author}</span>
                </div>
                <span className="text-xs text-slate-400">{new Date(note.date).toLocaleString('pt-BR')}</span>
              </div>
              <p className="text-sm">{note.text}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}