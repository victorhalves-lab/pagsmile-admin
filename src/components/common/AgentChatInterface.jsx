import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function AgentChatInterface({ 
  agentName = "DIA", 
  quickPrompts = [], 
  onSendMessage,
  initialMessages = [],
  placeholder = "Digite sua pergunta...",
  accentColor = "primary"
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular resposta do agente
    setTimeout(() => {
      const agentResponse = onSendMessage ? onSendMessage(messageText) : {
        role: 'assistant',
        content: `Entendi sua pergunta sobre "${messageText}". Esta é uma resposta simulada do agente ${agentName}.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Filtrar sugestões baseadas no input
    if (value.length > 2) {
      const filtered = quickPrompts.filter(p => 
        p.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === 'assistant' && (
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  accentColor === 'purple' 
                    ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                    : "bg-gradient-to-br from-[#2bc196] to-[#5cf7cf]"
                )}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.role === 'user' 
                  ? "bg-slate-800 text-white" 
                  : "bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              )}>
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <>
                    {typeof msg.content === 'string' ? (
                      <ReactMarkdown className="text-sm prose prose-sm prose-slate max-w-none dark:prose-invert">
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="text-sm">{msg.content}</div>
                    )}
                    
                    {/* Rich Content (gráficos, botões) */}
                    {msg.richContent && (
                      <div className="mt-3">
                        {msg.richContent}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                accentColor === 'purple' 
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                  : "bg-gradient-to-br from-[#2bc196] to-[#5cf7cf]"
              )}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {quickPrompts.length > 0 && messages.length === 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-medium text-slate-500 uppercase mb-2">Sugestões</p>
          <div className="space-y-2">
            {quickPrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-[#2bc196] hover:bg-[#2bc196]/5 transition-colors text-sm text-slate-700 dark:text-slate-300 dark:border-slate-700"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="px-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg mb-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(suggestion);
                  setSuggestions([]);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm border-b last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={placeholder}
            className="pr-12"
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8",
              accentColor === 'purple'
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-[#2bc196] hover:bg-[#239b7a]"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}