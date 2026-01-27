import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  ArrowRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';

const suggestedQuestions = [
  {
    icon: TrendingUp,
    text: 'Como está minha taxa de aprovação esse mês?',
    category: 'performance'
  },
  {
    icon: AlertTriangle,
    text: 'Quais transações recusadas poderiam ser recuperadas?',
    category: 'recovery'
  },
  {
    icon: BarChart3,
    text: 'Qual foi meu melhor dia de vendas na última semana?',
    category: 'analytics'
  },
  {
    icon: Lightbulb,
    text: 'Como posso melhorar a conversão do meu checkout?',
    category: 'optimization'
  },
];

const insights = [
  {
    type: 'positive',
    title: 'Taxa de aprovação em alta',
    description: 'Sua taxa de aprovação aumentou 2.3% esta semana, atingindo 91.5%.',
    action: 'Ver detalhes'
  },
  {
    type: 'warning',
    title: 'Chargeback ratio próximo do limite',
    description: 'Seu ratio atual é 0.85%. O limite das bandeiras é 1%.',
    action: 'Ver disputas'
  },
  {
    type: 'opportunity',
    title: 'Oportunidade de recuperação',
    description: 'R$ 12.450 em transações poderiam ser recuperadas com retry inteligente.',
    action: 'Ativar recuperação'
  },
];

export default function DIACopilot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! 👋 Sou o DIA, seu assistente inteligente da PagSmile. Posso te ajudar a entender suas métricas, identificar oportunidades de melhoria e responder dúvidas sobre sua operação. Como posso ajudar?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Analisando seus dados... Sua taxa de aprovação atual é de 89.5%, o que está 4.5 pontos acima da média do mercado para seu segmento. As transações recusadas por "saldo insuficiente" representam 45% das recusas - uma oportunidade para implementar retry inteligente.',
        'Baseado nos seus dados dos últimos 30 dias, identifiquei que seu pico de vendas acontece entre 19h e 22h. Considere direcionar suas campanhas de marketing para esse horário.',
        'Analisando seu checkout, notei que 23% dos clientes abandonam na etapa de preenchimento do cartão. Recomendo habilitar o card-on-file para clientes recorrentes, o que pode aumentar a conversão em até 15%.',
      ];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)]
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestion = (question) => {
    setInput(question);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="DIA Merchant Copilot"
        subtitle="Seu assistente inteligente de negócios"
        breadcrumbs={[
          { label: 'Agentes de IA', page: 'DIACopilot' },
          { label: 'DIA Copilot', page: 'DIACopilot' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D26A] to-[#00A854] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">DIA Copilot</h3>
              <p className="text-xs text-gray-500">Sempre disponível para ajudar</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      msg.role === 'user'
                        ? 'bg-[#101F3E] text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="p-4 border-t">
              <p className="text-xs font-medium text-gray-500 mb-3">Sugestões</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(q.text)}
                    className="flex items-start gap-2 p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <q.icon className="w-4 h-4 text-[#00D26A] flex-shrink-0 mt-0.5" />
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Pergunte ao DIA..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-[#00D26A] hover:bg-[#00A854]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Insights do DIA</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-4 rounded-lg border",
                    insight.type === 'positive' && 'bg-emerald-50 border-emerald-200',
                    insight.type === 'warning' && 'bg-yellow-50 border-yellow-200',
                    insight.type === 'opportunity' && 'bg-blue-50 border-blue-200'
                  )}
                >
                  <h4 className={cn(
                    "font-medium text-sm mb-1",
                    insight.type === 'positive' && 'text-emerald-900',
                    insight.type === 'warning' && 'text-yellow-900',
                    insight.type === 'opportunity' && 'text-blue-900'
                  )}>
                    {insight.title}
                  </h4>
                  <p className={cn(
                    "text-xs mb-2",
                    insight.type === 'positive' && 'text-emerald-700',
                    insight.type === 'warning' && 'text-yellow-700',
                    insight.type === 'opportunity' && 'text-blue-700'
                  )}>
                    {insight.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 px-2 text-xs",
                      insight.type === 'positive' && 'text-emerald-700 hover:bg-emerald-100',
                      insight.type === 'warning' && 'text-yellow-700 hover:bg-yellow-100',
                      insight.type === 'opportunity' && 'text-blue-700 hover:bg-blue-100'
                    )}
                  >
                    {insight.action}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#101F3E] to-[#1a2f5e] rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#00D26A]" />
              <h3 className="font-semibold">Sobre o DIA</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">
              O DIA (Digital Intelligence Assistant) é seu copiloto de negócios, 
              treinado para entender suas métricas e ajudar você a tomar melhores decisões.
            </p>
            <ul className="text-sm text-white/70 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                Análise de performance em tempo real
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                Identificação de oportunidades
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D26A]" />
                Recomendações personalizadas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}