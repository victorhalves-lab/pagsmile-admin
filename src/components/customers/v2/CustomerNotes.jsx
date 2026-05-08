import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Pin, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const SAMPLE_NOTES = [
  { id: 1, user: 'Ana Costa', date: '2026-04-28T10:30:00', content: 'Cliente preferencial. Sempre tratar com prioridade. Já indicou 3 amigos que viraram clientes.', pinned: true },
  { id: 2, user: 'Pedro Souza', date: '2026-04-15T15:22:00', content: 'Liguei para resolver problema com cobrança duplicada. Resolvido em 5 min. Cliente muito satisfeito.', pinned: false },
];

export default function CustomerNotes({ customer }) {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([{ id: Date.now(), user: 'Você', date: new Date().toISOString(), content: newNote, pinned: false }, ...notes]);
    setNewNote('');
    toast.success('Nota adicionada');
  };

  const togglePin = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const sorted = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StickyNote className="w-4 h-4 text-yellow-600" />
            <p className="text-sm font-semibold">Adicionar nota interna</p>
          </div>
          <Textarea
            placeholder="Ex: Cliente preferencial, escalar com cuidado..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" onClick={addNote} className="bg-[#2bc196] hover:bg-[#239b7a]">
              Adicionar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Histórico ({notes.length})</p>
          {sorted.map(note => (
            <div key={note.id} className={`border rounded-lg p-3 ${note.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-slate-100 bg-white'}`}>
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{note.user}</p>
                    <p className="text-[10px] text-slate-500">{format(new Date(note.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => togglePin(note.id)} className="p-1 hover:bg-slate-100 rounded">
                    <Pin className={`w-3 h-3 ${note.pinned ? 'fill-yellow-600 text-yellow-600' : 'text-slate-400'}`} />
                  </button>
                  <button onClick={() => setNotes(notes.filter(n => n.id !== note.id))} className="p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-700">{note.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}