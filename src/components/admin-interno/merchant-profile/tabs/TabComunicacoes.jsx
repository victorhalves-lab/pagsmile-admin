import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, Video, MessageSquare, Eye, Plus, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function TabComunicacoes({ merchant }) {
    const [emailModal, setEmailModal] = useState(false);

    const stats = { emails: 12, calls: 5, meetings: 1, sms: 3 };

    const communications = [
        { type: 'email_sent', date: '2026-01-28 14:30', to: 'contato@lojadojoao.com.br', subject: 'Atualização de taxas - Janeiro 2026', status: 'delivered', opened: true, by: 'Carlos Silva (Comercial)' },
        { type: 'call_received', date: '2026-01-28 10:15', from: '(11) 99999-1234', fromName: 'João Silva', duration: '12 min', summary: 'Dúvida sobre prazo de liquidação do PIX', by: 'Maria Santos (Suporte)' },
        { type: 'meeting', date: '2026-01-20 14:00', duration: '1h', meetingType: 'Vídeo (Google Meet)', participants: 'João Silva (Merchant), Carlos (Comercial)', agenda: 'Integração com novo ERP' },
        { type: 'email_sent', date: '2026-01-18 09:00', to: 'financeiro@lojadojoao.com.br', subject: 'Extrato mensal - Dezembro 2025', status: 'delivered', opened: true, by: 'Sistema' },
        { type: 'sms_sent', date: '2026-01-15 11:30', to: '(11) 99999-1234', message: 'Seu saque foi processado.', by: 'Sistema' },
        { type: 'call_made', date: '2026-01-10 16:00', to: '(11) 99999-1234', toName: 'João Silva', duration: '8 min', summary: 'Follow-up sobre documentação pendente', by: 'Ana Paula (Suporte)' },
    ];

    const typeConfig = {
        email_sent: { icon: Mail, label: 'E-mail Enviado', color: 'bg-blue-100 text-blue-700', arrow: '→' },
        email_received: { icon: Mail, label: 'E-mail Recebido', color: 'bg-green-100 text-green-700', arrow: '←' },
        call_made: { icon: Phone, label: 'Ligação Realizada', color: 'bg-purple-100 text-purple-700', arrow: '→' },
        call_received: { icon: Phone, label: 'Ligação Recebida', color: 'bg-orange-100 text-orange-700', arrow: '←' },
        meeting: { icon: Video, label: 'Reunião', color: 'bg-pink-100 text-pink-700', arrow: '' },
        sms_sent: { icon: MessageSquare, label: 'SMS Enviado', color: 'bg-teal-100 text-teal-700', arrow: '→' },
    };

    const groupedByDate = communications.reduce((acc, comm) => {
        const date = comm.date.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(comm);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <Mail className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-blue-600">{stats.emails}</p>
                    <p className="text-xs text-slate-500">E-mails</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <Phone className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                    <p className="text-2xl font-bold text-purple-600">{stats.calls}</p>
                    <p className="text-xs text-slate-500">Ligações</p>
                </div>
                <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg text-center">
                    <Video className="w-5 h-5 mx-auto text-pink-600 mb-1" />
                    <p className="text-2xl font-bold text-pink-600">{stats.meetings}</p>
                    <p className="text-xs text-slate-500">Reuniões</p>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
                    <MessageSquare className="w-5 h-5 mx-auto text-teal-600 mb-1" />
                    <p className="text-2xl font-bold text-teal-600">{stats.sms}</p>
                    <p className="text-xs text-slate-500">SMS</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-2xl font-bold">{stats.emails + stats.calls + stats.meetings + stats.sms}</p>
                    <p className="text-xs text-slate-500">Total (30d)</p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={() => setEmailModal(true)}>
                    <Mail className="w-4 h-4 mr-2" /> Novo E-mail
                </Button>
            </div>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📜 Histórico de Comunicações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(groupedByDate).map(([date, comms]) => (
                        <div key={date}>
                            <p className="text-sm font-semibold text-slate-500 mb-3">📅 {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                            <div className="space-y-3">
                                {comms.map((comm, idx) => {
                                    const config = typeConfig[comm.type];
                                    const Icon = config.icon;
                                    return (
                                        <div key={idx} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${config.color}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{config.label} | {comm.date.split(' ')[1]}</p>
                                                        {comm.type.includes('email') && (
                                                            <>
                                                                <p className="text-sm text-slate-600">Para: {comm.to}</p>
                                                                <p className="text-sm text-slate-600">Assunto: "{comm.subject}"</p>
                                                                <p className="text-xs text-slate-500">Status: ✅ Entregue | Aberto: {comm.opened ? 'Sim' : 'Não'}</p>
                                                            </>
                                                        )}
                                                        {comm.type.includes('call') && (
                                                            <>
                                                                <p className="text-sm text-slate-600">{comm.type === 'call_received' ? 'De' : 'Para'}: {comm.from || comm.to} ({comm.fromName || comm.toName})</p>
                                                                <p className="text-sm text-slate-600">Duração: {comm.duration}</p>
                                                                <p className="text-sm text-slate-600">Resumo: {comm.summary}</p>
                                                            </>
                                                        )}
                                                        {comm.type === 'meeting' && (
                                                            <>
                                                                <p className="text-sm text-slate-600">Tipo: {comm.meetingType}</p>
                                                                <p className="text-sm text-slate-600">Participantes: {comm.participants}</p>
                                                                <p className="text-sm text-slate-600">Pauta: {comm.agenda}</p>
                                                            </>
                                                        )}
                                                        {comm.type === 'sms_sent' && (
                                                            <>
                                                                <p className="text-sm text-slate-600">Para: {comm.to}</p>
                                                                <p className="text-sm text-slate-600">Mensagem: "{comm.message}"</p>
                                                            </>
                                                        )}
                                                        <p className="text-xs text-slate-400 mt-1">Por: {comm.by}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Email Modal */}
            <Dialog open={emailModal} onOpenChange={setEmailModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Enviar E-mail</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Para *</Label>
                            <Input className="mt-1" defaultValue={merchant.email} />
                        </div>
                        <div>
                            <Label>Assunto *</Label>
                            <Input className="mt-1" placeholder="Assunto do e-mail..." />
                        </div>
                        <div>
                            <Label>Mensagem *</Label>
                            <Textarea className="mt-1 min-h-[150px]" placeholder="Digite sua mensagem..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmailModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('E-mail enviado!'); setEmailModal(false); }}>
                            <Send className="w-4 h-4 mr-2" /> Enviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}