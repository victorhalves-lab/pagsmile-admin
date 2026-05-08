import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, Users, Edit, Trash2, Copy, Send, MoreVertical, Filter, Crown, AlertTriangle, Heart, Zap, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SAMPLE_SEGMENTS = [
  { id: '1', name: 'VIPs High-Value', count: 124, color: '#9333EA', type: 'dynamic', icon: Crown,
    rules: 'LTV > R$ 5.000 AND segment = VIP', growth: 12 },
  { id: '2', name: 'Cartões Expirando 30d', count: 89, color: '#F59E0B', type: 'dynamic', icon: AlertTriangle,
    rules: 'card.expiry < 30 days', growth: -3 },
  { id: '3', name: 'Dormant 60d+', count: 412, color: '#EF4444', type: 'dynamic', icon: AlertTriangle,
    rules: 'last_purchase > 60 days', growth: 8 },
  { id: '4', name: 'High Frequency', count: 256, color: '#3B82F6', type: 'dynamic', icon: Zap,
    rules: 'total_purchases >= 10', growth: 5 },
  { id: '5', name: 'Promoters NPS', count: 1840, color: '#10B981', type: 'dynamic', icon: Heart,
    rules: 'nps_score >= 9', growth: 18 },
  { id: '6', name: 'Recém Cadastrados 7d', count: 87, color: '#06B6D4', type: 'dynamic', icon: TrendingUp,
    rules: 'created_date < 7 days', growth: 22 },
  { id: '7', name: 'Lista Black Friday Manual', count: 543, color: '#8B5CF6', type: 'static', icon: Users,
    rules: 'Lista importada manualmente', growth: 0 },
];

const fields = [
  { value: 'total_spent', label: 'LTV (Total Gasto)' },
  { value: 'total_purchases', label: 'Nº de Compras' },
  { value: 'segment', label: 'Segmento' },
  { value: 'last_purchase_date', label: 'Última Compra' },
  { value: 'risk_score', label: 'Risk Score' },
  { value: 'chargebacks_count', label: 'Chargebacks' },
  { value: 'tags', label: 'Tags' },
];
const operators = [
  { value: 'gt', label: 'maior que' },
  { value: 'gte', label: 'maior ou igual' },
  { value: 'lt', label: 'menor que' },
  { value: 'eq', label: 'igual a' },
  { value: 'contains', label: 'contém' },
];

export default function SegmentsManager() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_SEGMENTS.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* AI Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-900">
            🎯 IA sugere: <span className="text-blue-700">"Carrinho abandonado &gt;24h" (487 clientes)</span> e <span className="text-blue-700">"VIPs com NPS detrator" (12 clientes — atenção urgente!)</span>
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700">
          Criar com IA
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input placeholder="Buscar segmento..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <div className="flex-1" />
        <Button onClick={() => setCreateOpen(true)} className="bg-[#2bc196] hover:bg-[#239b7a]">
          <Plus className="w-4 h-4 mr-2" /> Novo Segmento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.id} className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '20', color: s.color }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{s.name}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {s.type === 'dynamic' ? '🔄 Dinâmico' : '📌 Estático'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="w-3.5 h-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Send className="w-4 h-4 mr-2" /> Criar campanha</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Editar regras</DropdownMenuItem>
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="bg-slate-50 rounded-md p-2 mb-3">
                  <p className="text-[10px] font-mono text-slate-600 truncate">{s.rules}</p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Clientes</p>
                    <p className="text-2xl font-bold">{s.count.toLocaleString('pt-BR')}</p>
                  </div>
                  {s.growth !== 0 && (
                    <Badge className={s.growth > 0 ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                      {s.growth > 0 ? '↑' : '↓'} {Math.abs(s.growth)}% 30d
                    </Badge>
                  )}
                </div>

                <Button size="sm" variant="outline" className="w-full mt-3 text-xs" onClick={() => toast.success('Campanha iniciada para ' + s.name)}>
                  <Send className="w-3 h-3 mr-1.5" /> Criar campanha para este segmento
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Novo Segmento Dinâmico
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome do segmento</Label>
              <Input placeholder="Ex: VIPs em risco de churn" />
            </div>

            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Regras</p>
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Label className="text-xs">Campo</Label>
                  <Select defaultValue="total_spent"><SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{fields.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Operador</Label>
                  <Select defaultValue="gt"><SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>{operators.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-4">
                  <Label className="text-xs">Valor</Label>
                  <Input placeholder="Ex: 5000" className="h-9" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full"><Plus className="w-3 h-3 mr-1" /> Adicionar regra</Button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-800"><strong>Audiência estimada:</strong> 124 clientes (preview em tempo real)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => { toast.success('Segmento criado!'); setCreateOpen(false); }}>
              Criar Segmento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}