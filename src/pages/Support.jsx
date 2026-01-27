import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  FileText, 
  ExternalLink,
  Search,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';

const faqs = [
  {
    category: 'Transações',
    questions: [
      {
        q: 'Por que minha transação foi recusada?',
        a: 'Transações podem ser recusadas por diversos motivos: saldo insuficiente, dados incorretos do cartão, bloqueio do banco emissor, ou regras de antifraude. Consulte o código de recusa para mais detalhes.'
      },
      {
        q: 'Quanto tempo leva para o dinheiro cair na minha conta?',
        a: 'Para transações com cartão, o prazo padrão é D+30. Você pode antecipar recebíveis se desejar. Para Pix, o valor está disponível instantaneamente.'
      },
      {
        q: 'Como faço para estornar uma transação?',
        a: 'Acesse a transação desejada no menu Transações, clique nos três pontos e selecione "Estornar". Estornos parciais também são permitidos.'
      }
    ]
  },
  {
    category: 'Financeiro',
    questions: [
      {
        q: 'Qual o valor mínimo para saque?',
        a: 'O valor mínimo para solicitar um saque é de R$ 100,00.'
      },
      {
        q: 'Quanto tempo leva para processar um saque?',
        a: 'Saques via Pix são processados em até 2 horas em horário comercial. Saques via TED são processados em D+1.'
      },
      {
        q: 'Como funciona a antecipação de recebíveis?',
        a: 'Você pode antecipar seus recebíveis futuros a qualquer momento. Uma taxa é aplicada sobre o valor antecipado, e o valor líquido fica disponível imediatamente.'
      }
    ]
  },
  {
    category: 'Disputas',
    questions: [
      {
        q: 'O que é um chargeback?',
        a: 'Chargeback é quando o titular do cartão contesta uma transação junto ao banco emissor, solicitando o estorno do valor.'
      },
      {
        q: 'Como contesto um chargeback?',
        a: 'Acesse o menu Disputas, selecione o chargeback e envie as evidências solicitadas (comprovante de entrega, nota fiscal, etc.) dentro do prazo.'
      },
      {
        q: 'O que acontece se eu perder um chargeback?',
        a: 'Se o chargeback for perdido, o valor é debitado do seu saldo disponível, incluindo possíveis taxas administrativas.'
      }
    ]
  }
];

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticket, setTicket] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const statusItems = [
    { name: 'API', status: 'operational', label: 'Operacional' },
    { name: 'Checkout', status: 'operational', label: 'Operacional' },
    { name: 'Admin', status: 'operational', label: 'Operacional' },
    { name: 'Webhooks', status: 'operational', label: 'Operacional' },
  ];

  const handleSubmitTicket = () => {
    if (!ticket.category || !ticket.subject || !ticket.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    toast.success('Ticket enviado com sucesso! Você receberá uma resposta em breve.');
    setIsTicketOpen(false);
    setTicket({ category: '', subject: '', description: '', priority: 'medium' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suporte"
        subtitle="Central de ajuda e suporte"
        breadcrumbs={[
          { label: 'Suporte', page: 'Support' }
        ]}
        actions={
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => setIsTicketOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Abrir Ticket
          </Button>
        }
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <a 
          href="#" 
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#00D26A]/30 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 rounded-lg bg-blue-100">
            <Book className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 group-hover:text-[#00D26A]">Documentação</p>
            <p className="text-xs text-gray-500">Guias e tutoriais</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300" />
        </a>

        <a 
          href="#" 
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#00D26A]/30 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 rounded-lg bg-purple-100">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 group-hover:text-[#00D26A]">API Reference</p>
            <p className="text-xs text-gray-500">Referência técnica</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-300" />
        </a>

        <a 
          href="#" 
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#00D26A]/30 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 rounded-lg bg-emerald-100">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 group-hover:text-[#00D26A]">DIA Copilot</p>
            <p className="text-xs text-gray-500">Assistente IA</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </a>

        <a 
          href="#" 
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#00D26A]/30 hover:shadow-md transition-all group"
        >
          <div className="p-2.5 rounded-lg bg-orange-100">
            <MessageSquare className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 group-hover:text-[#00D26A]">Chat ao Vivo</p>
            <p className="text-xs text-gray-500">Fale conosco</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </a>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Status da Plataforma</h3>
          <Badge className="bg-emerald-100 text-emerald-700">Todos os sistemas operacionais</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusItems.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search + FAQs */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Perguntas Frequentes</h3>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar nas perguntas frequentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="Transações">
          <TabsList className="mb-4">
            {faqs.map((category) => (
              <TabsTrigger key={category.category} value={category.category}>
                {category.category}
              </TabsTrigger>
            ))}
          </TabsList>

          {faqs.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions
                  .filter(q => 
                    !searchTerm || 
                    q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.a.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Ticket Dialog */}
      <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Abrir Ticket de Suporte</DialogTitle>
            <DialogDescription>
              Descreva seu problema e nossa equipe responderá em breve
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Categoria *</Label>
              <Select 
                value={ticket.category} 
                onValueChange={(v) => setTicket({ ...ticket, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Técnico</SelectItem>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="disputes">Disputas</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prioridade</Label>
              <Select 
                value={ticket.priority} 
                onValueChange={(v) => setTicket({ ...ticket, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Assunto *</Label>
              <Input
                placeholder="Resumo do problema"
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
              />
            </div>

            <div>
              <Label>Descrição *</Label>
              <Textarea
                placeholder="Descreva seu problema em detalhes..."
                rows={4}
                value={ticket.description}
                onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTicketOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleSubmitTicket}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}