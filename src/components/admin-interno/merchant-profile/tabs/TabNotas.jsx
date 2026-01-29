import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pin, PinOff, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const categoryConfig = {
    general: { label: 'Geral', icon: '📝', color: 'bg-slate-100 text-slate-700' },
    support: { label: 'Atendimento', icon: '📞', color: 'bg-blue-100 text-blue-700' },
    commercial: { label: 'Comercial', icon: '💼', color: 'bg-purple-100 text-purple-700' },
    risk: { label: 'Risco', icon: '⚠️', color: 'bg-red-100 text-red-700' },
    financial: { label: 'Financeiro', icon: '💰', color: 'bg-green-100 text-green-700' },
    technical: { label: 'Técnico', icon: '🔧', color: 'bg-orange-100 text-orange-700' },
    compliance: { label: 'Compliance', icon: '📋', color: 'bg-yellow-100 text-yellow-700' },
};

export default function TabNotas({ merchant }) {
    const [noteModal, setNoteModal] = useState(false);
    const [editNote, setEditNote] = useState(null);

    const [notes, setNotes] = useState([
        { id: 1, content: 'ATENÇÃO: Merchant com histórico de chargebacks altos em 2024. Monitorar de perto qualquer aumento no CB ratio.', category: 'risk', author: 'Maria Santos', date: '2026-01-15', pinned: true },
        { id: 2, content: 'Contato preferencial: João Silva (sócio) - Ligar no celular. Maria (financeiro) só responde e-mail.', category: 'support', author: 'Carlos Oliveira', date: '2024-06-10', pinned: true },
        { id: 3, content: 'Negociação de taxas em andamento. Comercial vai ligar amanhã.', category: 'commercial', author: 'João Vendas', date: '2026-01-28', pinned: false },
        { id: 4, content: 'Merchant reportou problemas com webhook. Verificado - servidor dele estava fora. Problema resolvido.', category: 'technical', author: 'Tech Support', date: '2026-01-25', pinned: false },
    ]);

    const pinnedNotes = notes.filter(n => n.pinned);
    const regularNotes = notes.filter(n => !n.pinned);

    const togglePin = (id) => {
        setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
        toast.success('Nota atualizada!');
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(n => n.id !== id));
        toast.success('Nota removida!');
    };

    const NoteCard = ({ note }) => {
        const cat = categoryConfig[note.category];
        return (
            <div className={`p-4 border rounded-lg ${note.pinned ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <Badge className={`${cat.color} border-0`}>{cat.label}</Badge>
                        {note.pinned && <Badge className="bg-yellow-200 text-yellow-800 border-0">📌 Fixada</Badge>}
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => togglePin(note.id)}>
                            {note.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setEditNote(note); setNoteModal(true); }}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteNote(note.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-slate-700 mb-2">{note.content}</p>
                <p className="text-xs text-slate-500">Autor: {note.author} | {new Date(note.date).toLocaleDateString('pt-BR')}</p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => { setEditNote(null); setNoteModal(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Nova Nota
                </Button>
            </div>

            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            📌 Notas Fixadas (Importantes)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pinnedNotes.map(note => <NoteCard key={note.id} note={note} />)}
                    </CardContent>
                </Card>
            )}

            {/* All Notes */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        📝 Todas as Notas
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {regularNotes.length > 0 ? (
                        regularNotes.map(note => <NoteCard key={note.id} note={note} />)
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">Nenhuma nota adicional</p>
                    )}
                </CardContent>
            </Card>

            {/* Note Modal */}
            <Dialog open={noteModal} onOpenChange={setNoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editNote ? 'Editar Nota' : 'Nova Nota'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Categoria *</Label>
                            <Select defaultValue={editNote?.category || 'general'}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categoryConfig).map(([key, val]) => (
                                        <SelectItem key={key} value={key}>{val.icon} {val.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Conteúdo *</Label>
                            <Textarea className="mt-1 min-h-[120px]" defaultValue={editNote?.content} placeholder="Digite sua nota..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNoteModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Nota salva!'); setNoteModal(false); }}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}