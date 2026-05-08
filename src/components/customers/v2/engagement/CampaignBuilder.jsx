import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Phone, Bell, Users, Sparkles, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const channels = [
  { id: 'email', label: 'Email', icon: Mail, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'sms', label: 'SMS', icon: Phone, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'push', label: 'Push', icon: Bell, color: 'bg-orange-50 text-orange-700 border-orange-200' },
];

export default function CampaignBuilder({ open, onOpenChange }) {
  const [step, setStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState(['email']);

  const toggleChannel = (id) => {
    setSelectedChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Nova Campanha — Etapa {step} de 4
          </DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-2">
          {['Objetivo', 'Audiência', 'Mensagem', 'Agenda'].map((label, i) => (
            <React.Fragment key={i}>
              <div className={cn('flex items-center gap-2', step > i + 1 ? 'text-emerald-600' : step === i + 1 ? 'text-[#2bc196]' : 'text-slate-400')}>
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2',
                  step > i + 1 ? 'bg-emerald-100 border-emerald-300' : step === i + 1 ? 'bg-[#2bc196] text-white border-[#2bc196]' : 'border-slate-300'
                )}>{i + 1}</div>
                <span className="text-xs font-medium">{label}</span>
              </div>
              {i < 3 && <div className={cn('flex-1 h-0.5', step > i + 1 ? 'bg-emerald-300' : 'bg-slate-200')} />}
            </React.Fragment>
          ))}
        </div>

        <div className="py-4 space-y-4">
          {step === 1 && (
            <>
              <div>
                <Label>Nome da campanha</Label>
                <Input placeholder="Ex: Recovery — Carrinho abandonado Q2" />
              </div>
              <div>
                <Label>Objetivo</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'recovery', label: '💸 Recovery' },
                    { id: 'retention', label: '🔄 Retention' },
                    { id: 'upsell', label: '⬆️ Upsell' },
                    { id: 'winback', label: '🎯 Win-back' },
                    { id: 'welcome', label: '👋 Welcome' },
                    { id: 'nps', label: '⭐ NPS' },
                  ].map(g => (
                    <Button key={g.id} variant="outline" className="h-14 justify-start">{g.label}</Button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-800">IA recomenda <strong>"Cartões expirando 30d" (89 clientes)</strong> baseado no objetivo Recovery</p>
              </div>
              <div>
                <Label>Selecione segmentos</Label>
                <div className="space-y-1.5 mt-2">
                  {['VIPs High-Value (124)', 'Cartões Expirando 30d (89)', 'Dormant 60d+ (412)', 'Promoters NPS (1.840)'].map(s => (
                    <div key={s} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-bold text-emerald-900">Audiência total: <span>234 clientes</span></p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label>Canais</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {channels.map(ch => {
                    const Icon = ch.icon;
                    const active = selectedChannels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => toggleChannel(ch.id)}
                        className={cn('p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all',
                          active ? ch.color + ' ring-2 ring-offset-1 ring-[#2bc196]' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label>Template</Label>
                <Select defaultValue="recovery_v3">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recovery_v3">💸 Recovery v3 (open rate 67%)</SelectItem>
                    <SelectItem value="winback_premium">🎯 Win-back Premium</SelectItem>
                    <SelectItem value="custom">✏️ Mensagem customizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assunto / Título</Label>
                <Input placeholder="Sua compra está quase concluída!" />
              </div>
              <div>
                <Label>Mensagem</Label>
                <Textarea rows={5} placeholder="Olá {customer_name}, vimos que você adicionou itens ao carrinho..." />
                <div className="flex flex-wrap gap-1 mt-2">
                  {['{customer_name}', '{amount}', '{cart_link}', '{discount}'].map(v => (
                    <Badge key={v} variant="outline" className="text-[10px] cursor-pointer hover:bg-slate-100">{v}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-purple-800">IA recomenda envio às <strong>terça-feira 14h</strong> (3.2x maior engajamento)</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Quando enviar?</Label>
                  <Select defaultValue="optimal">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">🚀 Agora</SelectItem>
                      <SelectItem value="optimal">🎯 Horário ideal por cliente (IA)</SelectItem>
                      <SelectItem value="scheduled">📅 Agendar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>A/B Test</Label>
                  <Select defaultValue="off">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Desativado</SelectItem>
                      <SelectItem value="subject">Testar 2 assuntos</SelectItem>
                      <SelectItem value="full">Testar 2 mensagens completas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Card className="bg-emerald-50 border-emerald-200 p-3">
                <p className="text-xs font-bold text-emerald-800 mb-1.5">📊 Estimativa de Performance (IA)</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-lg font-bold text-emerald-700">~67%</p><p className="text-[10px] text-emerald-600">Open Rate</p></div>
                  <div><p className="text-lg font-bold text-blue-700">~24%</p><p className="text-[10px] text-blue-600">Click Rate</p></div>
                  <div><p className="text-lg font-bold text-purple-700">~R$ 12k</p><p className="text-[10px] text-purple-600">Revenue Est.</p></div>
                </div>
              </Card>
            </>
          )}
        </div>

        <DialogFooter>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Voltar</Button>}
          <div className="flex-1" />
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-[#2bc196] hover:bg-[#239b7a]">Continuar</Button>
          ) : (
            <Button onClick={() => { toast.success('🚀 Campanha criada e agendada!'); onOpenChange(false); setStep(1); }}
              className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Calendar className="w-4 h-4 mr-2" /> Agendar Campanha
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}