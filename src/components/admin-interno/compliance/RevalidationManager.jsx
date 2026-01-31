import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MetricImpactCard from '@/components/common/MetricImpactCard';
import AgentChatInterface from '@/components/common/AgentChatInterface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Clock, AlertTriangle, CheckCircle2, Calendar, Search, MessageSquare,
  RefreshCw, TrendingUp, Bell, FileText
} from 'lucide-react';

const mockRevalidationData = [
  {
    id: 'rev_001',
    business_name: 'TechStore Ltda',
    document: '12.345.678/0001-90',
    next_review_date: '2026-02-15',
    status: 'pending',
    risk_level: 'medium',
    days_until_due: 15,
    last_review: '2025-02-15',
    items_to_update: ['CNH vencida', 'Faturamento']
  },
  {
    id: 'rev_002',
    business_name: 'E-commerce ABC',
    document: '98.765.432/0001-99',
    next_review_date: '2026-02-05',
    status: 'overdue',
    risk_level: 'high',
    days_until_due: -5,
    last_review: '2025-02-05',
    items_to_update: ['Contrato Social', 'QSA', 'Comprovante Endereço']
  },
  {
    id: 'rev_003',
    business_name: 'Digital Services ME',
    document: '11.222.333/0001-44',
    next_review_date: '2026-03-01',
    status: 'in_progress',
    risk_level: 'low',
    days_until_due: 29,
    last_review: '2025-03-01',
    items_to_update: ['Confirmação faturamento']
  }
];

const triggers = [
  { type: 'temporal', label: 'Vencimento de Documentos', count: 12, icon: Calendar },
  { type: 'behavioral', label: 'Mudança de Volume +50%', count: 5, icon: TrendingUp },
  { type: 'external', label: 'Mudança Societária', count: 3, icon: FileText },
  { type: 'market', label: 'Crise no Segmento', count: 2, icon: AlertTriangle }
];

export default function RevalidationManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const handleProactiveContact = (merchant) => {
    setSelectedMerchant(merchant);
    setChatOpen(true);
  };

  const simulatedRevalidationChat = (text) => {
    return {
      role: 'assistant',
      content: `Olá João! Como parte de nossa política de segurança, preciso atualizar algumas informações da ${selectedMerchant?.business_name}.\n\nSão apenas 5 minutos e você mantém todos os seus benefícios ativos.\n\nPreciso atualizar:\n${selectedMerchant?.items_to_update.map(item => `• ${item}`).join('\n')}\n\nPodemos fazer isso agora?`,
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">95%</p>
              <p className="text-sm text-slate-600">Taxa de Automação</p>
              <p className="text-xs text-slate-500 mt-1">Sem intervenção humana</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">10min</p>
              <p className="text-sm text-slate-600">Tempo Médio</p>
              <p className="text-xs text-slate-500 mt-1">Atualização completa</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">100%</p>
              <p className="text-sm text-slate-600">Compliance Rate</p>
              <p className="text-xs text-slate-500 mt-1">Dentro do prazo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">30d</p>
              <p className="text-sm text-slate-600">Proatividade</p>
              <p className="text-xs text-slate-500 mt-1">Antes do vencimento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Triggers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            Gatilhos de Revalidação Detectados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {triggers.map((trigger, idx) => {
              const Icon = trigger.icon;
              return (
                <Card key={idx} className="border-2">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{trigger.count}</p>
                        <p className="text-xs text-slate-600">{trigger.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revalidation Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fila de Revalidação</CardTitle>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Próxima Revisão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Itens a Atualizar</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRevalidationData.map((item) => (
                <TableRow key={item.id} className={item.status === 'overdue' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.business_name}</p>
                      <p className="text-xs text-slate-500">{item.document}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className={item.days_until_due < 0 ? 'text-red-600 font-medium' : ''}>
                        {item.next_review_date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.days_until_due > 0 ? `${item.days_until_due} dias` : `${Math.abs(item.days_until_due)} dias atrasado`}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      item.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      item.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }>
                      {item.status === 'overdue' ? 'Atrasado' : item.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      item.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                      item.risk_level === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }>
                      {item.risk_level === 'high' ? 'Alto' : item.risk_level === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.items_to_update.slice(0, 2).map((itm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {itm}
                        </Badge>
                      ))}
                      {item.items_to_update.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.items_to_update.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      onClick={() => handleProactiveContact(item)}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Contatar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Proactive Contact Chat */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-4xl h-[600px]">
          <DialogHeader>
            <DialogTitle>Revalidação Proativa - {selectedMerchant?.business_name}</DialogTitle>
          </DialogHeader>
          <AgentChatInterface
            agentName="Identity Onboarder"
            initialMessages={selectedMerchant ? [simulatedRevalidationChat('')] : []}
            onSendMessage={simulatedRevalidationChat}
            placeholder="Responder ao agente..."
            accentColor="purple"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}