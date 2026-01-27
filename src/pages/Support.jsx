import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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
  Send,
  Upload,
  Eye,
  RefreshCw,
  Bell,
  Calendar,
  XCircle,
  History
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
import DataTable from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
  const [activeTab, setActiveTab] = useState('help');
  const [ticket, setTicket] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: () => base44.entities.SupportTicket.list('-created_date', 50),
  });

  const createTicketMutation = useMutation({
    mutationFn: (data) => base44.entities.SupportTicket.create({
      ...data,
      ticket_id: `TKT-${Date.now()}`,
      status: 'open',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets']);
      setIsTicketOpen(false);
      setTicket({ category: '', subject: '', description: '', priority: 'medium' });
      toast.success('Ticket criado com sucesso!');
    }
  });

  const statusItems = [
    { name: 'API', status: 'operational', label: 'Operacional' },
    { name: 'Checkout', status: 'operational', label: 'Operacional' },
    { name: 'Admin', status: 'operational', label: 'Operacional' },
    { name: 'Webhooks', status: 'operational', label: 'Operacional' },
    { name: 'Pix', status: 'operational', label: 'Operacional' },
    { name: 'Antifraude', status: 'operational', label: 'Operacional' },
  ];

  const incidents = [
    // No active incidents
  ];

  const maintenances = [
    { date: '2026-02-01', time: '03:00 - 05:00', service: 'API', description: 'Atualização de segurança programada' },
  ];

  const ticketStatusConfig = {
    open: { label: 'Aberto', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-700' },
    waiting_customer: { label: 'Aguardando Resposta', color: 'bg-purple-100 text-purple-700' },
    resolved: { label: 'Resolvido', color: 'bg-emerald-100 text-emerald-700' },
    closed: { label: 'Fechado', color: 'bg-gray-100 text-gray-700' },
  };

  const handleSubmitTicket = () => {
    if (!ticket.category || !ticket.subject || !ticket.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    createTicketMutation.mutate(ticket);
  };

  const ticketColumns = [
    {
      key: 'ticket_id',
      label: 'ID',
      render: (value) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
    },
    {
      key: 'subject',
      label: 'Assunto',
      render: (value) => <span className="font-medium">{value}</span>
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value === 'technical' ? 'Técnico' :
           value === 'financial' ? 'Financeiro' :
           value === 'commercial' ? 'Comercial' :
           value === 'disputes' ? 'Disputas' : 'Outro'}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const config = ticketStatusConfig[value] || ticketStatusConfig.open;
        return <Badge className={config.color}>{config.label}</Badge>;
      }
    },
    {
      key: 'created_date',
      label: 'Criado em',
      render: (value) => value ? new Date(value).toLocaleDateString('pt-BR') : '-'
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suporte"
        subtitle="Central de ajuda e suporte"
        breadcrumbs={[
          { label: 'Suporte', page: 'Support' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab('tickets')}>
              <History className="w-4 h-4 mr-2" />
              Meus Tickets
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => setIsTicketOpen(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Abrir Ticket
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="help">Central de Ajuda</TabsTrigger>
          <TabsTrigger value="tickets">
            Meus Tickets
            {tickets.filter(t => t.status !== 'closed').length > 0 && (
              <Badge variant="secondary" className="ml-2">{tickets.filter(t => t.status !== 'closed').length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="status">Status da Plataforma</TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-6">

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
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Meus Tickets</CardTitle>
                  <CardDescription>Acompanhe suas solicitações de suporte</CardDescription>
                </div>
                <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={() => setIsTicketOpen(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Novo Ticket
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={ticketColumns}
                data={tickets}
                loading={isLoading}
                searchable
                searchPlaceholder="Buscar tickets..."
                pagination
                pageSize={10}
                currentPage={1}
                totalItems={tickets.length}
                emptyMessage="Nenhum ticket encontrado"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Status dos Serviços</CardTitle>
                  <CardDescription>Atualizado há 2 minutos</CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Todos os sistemas operacionais</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statusItems.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Incidentes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incidents.length > 0 ? (
                <div className="space-y-4">
                  {incidents.map((incident, idx) => (
                    <div key={idx} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum incidente ativo no momento</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scheduled Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Manutenções Programadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {maintenances.length > 0 ? (
                <div className="space-y-3">
                  {maintenances.map((maintenance, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">{maintenance.description}</p>
                        <p className="text-sm text-gray-500">Serviço: {maintenance.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{new Date(maintenance.date).toLocaleDateString('pt-BR')}</p>
                        <p className="text-sm text-gray-500">{maintenance.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma manutenção programada</p>
              )}
            </CardContent>
          </Card>

          {/* Subscribe to Updates */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Receber atualizações de status</p>
                    <p className="text-sm text-gray-500">Seja notificado sobre incidentes e manutenções</p>
                  </div>
                </div>
                <Button variant="outline">
                  Assinar Atualizações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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