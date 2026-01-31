import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  X, 
  Maximize2, 
  Minimize2,
  Mic,
  MicOff,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

// Componente de bolha de mensagem
const MessageBubble = ({ message, isUser }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "flex gap-3 mb-4",
      isUser ? "flex-row-reverse" : "flex-row"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
      isUser 
        ? "bg-slate-200 dark:bg-slate-700" 
        : "bg-gradient-to-br from-[#2bc196] to-emerald-600"
    )}>
      {isUser ? (
        <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      ) : (
        <Sparkles className="w-4 h-4 text-white" />
      )}
    </div>
    <div className={cn(
      "max-w-[80%] rounded-2xl px-4 py-3",
      isUser 
        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
    )}>
      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      {message.actions && message.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {message.actions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={action.variant || "outline"}
              className="text-xs h-7"
              onClick={action.onClick}
            >
              {action.icon && <action.icon className="w-3 h-3 mr-1" />}
              {action.label}
            </Button>
          ))}
        </div>
      )}
      {message.timestamp && (
        <p className="text-[10px] text-slate-400 mt-2">
          {message.timestamp}
        </p>
      )}
    </div>
  </motion.div>
);

// Componente de indicador de digitação
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex gap-3 mb-4"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center">
      <Sparkles className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </motion.div>
);

export default function AgentChatInterface({ 
  agentName,
  agentDisplayName,
  agentDescription,
  quickPrompts = [],
  onProcessMessage,
  welcomeMessage,
  isOpen,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
  accentColor = "#2bc196"
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializa com mensagem de boas-vindas
  useEffect(() => {
    if (isOpen && messages.length === 0 && welcomeMessage) {
      setMessages([{
        id: 1,
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [isOpen, welcomeMessage]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Foca no input quando abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simula delay de processamento da IA
    setTimeout(async () => {
      let response;
      
      if (onProcessMessage) {
        response = await onProcessMessage(content.trim(), messages);
      } else {
        response = {
          content: "Desculpe, não consegui processar sua solicitação no momento. Tente novamente.",
        };
      }

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        actions: response.actions,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, assistantMessage]);

      // Executa callback se houver
      if (response.onComplete) {
        response.onComplete();
      }
    }, 1000 + Math.random() * 1500); // Delay entre 1-2.5s para parecer mais natural
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt.text);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Simulação de voz - em produção integraria com Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputValue("Exemplo de comando por voz...");
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "fixed z-50 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col",
        isFullscreen 
          ? "inset-0" 
          : "top-0 right-0 h-full w-[420px]"
      )}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800"
        style={{ background: `linear-gradient(135deg, ${accentColor}15, transparent)` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              {agentDisplayName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {agentDescription}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Prompts */}
      {quickPrompts.length > 0 && messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            Sugestões rápidas
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {prompt.icon && <prompt.icon className="w-3 h-3" />}
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 flex-shrink-0",
              isListening && "bg-red-100 text-red-600 dark:bg-red-900/30"
            )}
            onClick={toggleVoice}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Digite sua mensagem..."
              className="pr-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              disabled={isTyping}
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              style={{ backgroundColor: accentColor }}
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Pressione Enter para enviar • Simulação de IA
        </p>
      </div>
    </motion.div>
  );
}