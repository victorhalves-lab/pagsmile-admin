import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, MessageSquare, Calendar, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { PARAMETER_CHANGE_CATEGORIES, fmt } from '@/components/mentor/mocks/channelParametersMock';

export default function ChannelParametersTimeline({ events = [] }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? events : events.filter((e) => e.category === filter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4" />Timeline de mudanças nos parâmetros
          </span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {Object.entries(PARAMETER_CHANGE_CATEGORIES).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Nenhum evento na categoria selecionada</p>
        ) : (
          <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-4">
            {filtered.map((e) => {
              const cat = PARAMETER_CHANGE_CATEGORIES[e.category];
              return (
                <li key={e.id} className="ml-4">
                  <div className="absolute w-3 h-3 bg-[#2bc196] rounded-full -left-[7px] mt-1.5" />
                  <Card>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`text-[9px] ${cat?.color}`}>{cat?.label}</Badge>
                            <Badge variant="outline" className="text-[9px]">{e.channel_name}</Badge>
                            <span className="text-[10px] text-slate-500">{new Date(e.timestamp).toLocaleString('pt-BR')}</span>
                          </div>
                          <p className="text-sm font-medium mt-1">
                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{e.field}</code>
                            <span className="mx-2 text-slate-500">de</span>
                            <code className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded">{String(e.before)}</code>
                            <span className="mx-2 text-slate-500">para</span>
                            <code className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">{String(e.after)}</code>
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">"{e.justification}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t flex-wrap text-[10px]">
                        <span className="text-slate-500">Por: {e.user}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {e.affected_merchants.toLocaleString('pt-BR')} lojistas
                        </span>
                        {e.estimated_revenue_impact !== 0 && (
                          <span className={`flex items-center gap-1 font-semibold ${e.estimated_revenue_impact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {e.estimated_revenue_impact > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {fmt(Math.abs(e.estimated_revenue_impact))}/mês
                          </span>
                        )}
                        {e.cutover && new Date(e.cutover) > new Date(e.timestamp) && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <Calendar className="w-3 h-3" />
                            Cutover: {new Date(e.cutover).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {e.notice_period_days > 0 && (
                          <Badge className="text-[9px] bg-amber-100 text-amber-700">Aviso prévio {e.notice_period_days}d</Badge>
                        )}
                        {e.communication_sent && (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <MessageSquare className="w-3 h-3" />
                            Comunicação enviada
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}