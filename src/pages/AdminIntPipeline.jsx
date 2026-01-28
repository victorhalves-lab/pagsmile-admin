import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, Plus, MoreHorizontal, Calendar, 
  DollarSign, MapPin, AlertCircle 
} from 'lucide-react';

const KanbanColumn = ({ id, title, count, totalValue, children }) => (
  <div className="flex flex-col h-full min-w-[280px] w-[280px] bg-slate-100 dark:bg-slate-900 rounded-xl p-2 mr-4">
    <div className="flex items-center justify-between p-2 mb-2">
      <div>
        <h3 className="font-semibold text-sm uppercase text-slate-600 dark:text-slate-400 flex items-center gap-2">
          {title} <Badge variant="secondary" className="text-xs">{count}</Badge>
        </h3>
        {totalValue && <p className="text-xs text-slate-500 font-medium mt-1">{totalValue}</p>}
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6">
        <MoreHorizontal className="w-4 h-4" />
      </Button>
    </div>
    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
      {children}
    </div>
  </div>
);

const LeadCard = ({ lead, index }) => (
  <Draggable draggableId={lead.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
            {lead.company}
          </h4>
          <Badge variant={lead.score >= 70 ? "success" : lead.score >= 50 ? "warning" : "destructive"} className="text-[10px] h-5 px-1.5">
            {lead.score}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <DollarSign className="w-3 h-3" />
          <span className="font-medium text-slate-700 dark:text-slate-300">{lead.tpv}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-[10px] h-5 px-1 bg-slate-50">{lead.segment}</Badge>
          <Badge variant="outline" className="text-[10px] h-5 px-1 bg-slate-50">{lead.origin}</Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-700">JS</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {lead.daysInStage}d
            </span>
          </div>
          {lead.hasAlert && <AlertCircle className="w-4 h-4 text-amber-500" />}
        </div>
      </div>
    )}
  </Draggable>
);

import { Clock } from 'lucide-react';

export default function AdminIntPipeline() {
  // Mock data
  const columns = {
    'new': { id: 'new', title: 'Novo', leads: [
      { id: 'l1', company: 'Tech Solutions', score: 78, tpv: 'R$ 500k', segment: 'SaaS', origin: 'Indicação', daysInStage: 2 },
      { id: 'l2', company: 'Mega Loja', score: 45, tpv: 'R$ 50k', segment: 'Retail', origin: 'Site', daysInStage: 5, hasAlert: true },
    ]},
    'analysis': { id: 'analysis', title: 'Análise', leads: [
      { id: 'l3', company: 'E-commerce ABC', score: 85, tpv: 'R$ 1.2M', segment: 'E-com', origin: 'LinkedIn', daysInStage: 1 },
    ]},
    'proposal': { id: 'proposal', title: 'Proposta', leads: [] },
    'sent': { id: 'sent', title: 'Enviado', leads: [] },
    'negotiating': { id: 'negotiating', title: 'Negociando', leads: [] },
    'accepted': { id: 'accepted', title: 'Aceito', leads: [] },
  };

  const onDragEnd = (result) => {
    // Implementar lógica de reordenação/movimentação
    console.log(result);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Pipeline Comercial
            </h1>
            <p className="text-sm text-slate-500">
              Pipeline Total: <span className="font-semibold text-slate-900 dark:text-slate-100">R$ 4.5M GMV/mês</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Buscar leads..." className="pl-10 h-9" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
            <Button size="sm" className="bg-[#00c295] hover:bg-[#00a880]">
              <Plus className="w-4 h-4 mr-2" /> Novo Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full">
            {Object.values(columns).map(column => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <KanbanColumn 
                      id={column.id} 
                      title={column.title} 
                      count={column.leads.length}
                    >
                      {column.leads.map((lead, index) => (
                        <LeadCard key={lead.id} lead={lead} index={index} />
                      ))}
                      {provided.placeholder}
                    </KanbanColumn>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}