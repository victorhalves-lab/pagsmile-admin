import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Save } from 'lucide-react';

export default function MentorAnticipationFilters({ onApply }) {
  const [expanded, setExpanded] = useState(false);
  const [activeCount, setActiveCount] = useState(0);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {/* Linha principal */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por ID, lojista, CNPJ, ref externa, ref bancária..." className="pl-9" />
          </div>
          <Select defaultValue="today">
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="this_month">Este mês</SelectItem>
              <SelectItem value="last_month">Mês passado</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="created">Criada</SelectItem>
              <SelectItem value="in_validation">Em validação</SelectItem>
              <SelectItem value="validated">Validada</SelectItem>
              <SelectItem value="pending_approval">Aguard. Aprovação</SelectItem>
              <SelectItem value="in_execution">Em execução</SelectItem>
              <SelectItem value="executed">Executada</SelectItem>
              <SelectItem value="failed">Falhou</SelectItem>
              <SelectItem value="reverted">Revertida</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            <Filter className="w-4 h-4 mr-1" /> Filtros avançados
            {activeCount > 0 && <Badge className="ml-2 bg-violet-100 text-violet-700">{activeCount}</Badge>}
          </Button>
          <Button size="sm" onClick={onApply}>Aplicar</Button>
        </div>

        {/* Avançados */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-3 border-t">
            <Select>
              <SelectTrigger><SelectValue placeholder="Faixa de valor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixo (até R$ 10k)</SelectItem>
                <SelectItem value="mid">Médio (R$ 10k–100k)</SelectItem>
                <SelectItem value="high">Alto ({'>'} R$ 100k)</SelectItem>
                <SelectItem value="vhigh">Muito alto ({'>'} R$ 500k)</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Faixa de taxa (%)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0% – 2%</SelectItem>
                <SelectItem value="2-3">2% – 3%</SelectItem>
                <SelectItem value="3-5">3% – 5%</SelectItem>
                <SelectItem value="5+">Acima de 5%</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Prazo médio antecipado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 dia</SelectItem>
                <SelectItem value="2-7">1–7 dias</SelectItem>
                <SelectItem value="8-15">8–15 dias</SelectItem>
                <SelectItem value="16-30">16–30 dias</SelectItem>
                <SelectItem value="30+">Mais de 30 dias</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Método execução" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="ted">TED</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Banco destinatário" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="bb">Banco do Brasil</SelectItem>
                <SelectItem value="itau">Itaú</SelectItem>
                <SelectItem value="bradesco">Bradesco</SelectItem>
                <SelectItem value="santander">Santander</SelectItem>
                <SelectItem value="nubank">Nubank</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="c6">C6</SelectItem>
                <SelectItem value="btg">BTG</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Pendência (>N dias)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{'>'} 1 dia</SelectItem>
                <SelectItem value="3">{'>'} 3 dias</SelectItem>
                <SelectItem value="7">{'>'} 7 dias</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Sub-status (falhas)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_rejected">Banco rejeitou</SelectItem>
                <SelectItem value="invalid_account">Conta inválida</SelectItem>
                <SelectItem value="comm_error">Erro de comunicação</SelectItem>
                <SelectItem value="treasury">Saldo PagSmile</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Projeto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos projetos</SelectItem>
                <SelectItem value="br">PagSmile BR</SelectItem>
                <SelectItem value="mx">PagSmile MX</SelectItem>
              </SelectContent>
            </Select>
            <div className="md:col-span-3 lg:col-span-4 flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><X className="w-4 h-4 mr-1" /> Limpar</Button>
                <Button variant="outline" size="sm"><Save className="w-4 h-4 mr-1" /> Salvar como visão</Button>
              </div>
              <span className="text-xs text-slate-500">Filtros mantidos ao paginar</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}