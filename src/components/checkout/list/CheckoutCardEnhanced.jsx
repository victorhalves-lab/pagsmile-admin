import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical, Eye, Pencil, Trash2, Copy as CopyIcon, ExternalLink, ShoppingCart,
  Sparkles, Trophy, TrendingUp, TrendingDown, Share2, History, Archive, BarChart3, QrCode, FileJson
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Card enriquecido de checkout: thumbnail + KPIs inline + badges (Winner / IA) + ações ricas.
 */
export default function CheckoutCardEnhanced({ checkout, selected, onToggleSelect, onCopy }) {
  // Mock metrics — em produção viriam de aggregations
  const conv = checkout.conversion_rate ?? (Math.random() * 18 + 4).toFixed(1);
  const ticket = checkout.avg_ticket ?? (Math.random() * 400 + 80).toFixed(0);
  const trend = (Math.random() - 0.5) * 10;
  const sales = checkout.total_sales || Math.floor(Math.random() * 200);
  const isWinner = checkout.id?.charCodeAt(0) % 5 === 0;
  const hasInsight = checkout.id?.charCodeAt(0) % 3 === 0;

  const statusConfig = {
    active: { label: 'Ativo', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    inactive: { label: 'Inativo', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    draft: { label: 'Rascunho', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  };
  const sc = statusConfig[checkout.status] || statusConfig.draft;

  return (
    <Card className={cn("group hover:shadow-lg transition-all relative overflow-hidden", selected && "ring-2 ring-[#2bc196]")}>
      {/* Checkbox para bulk */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity" data-state={selected ? 'visible' : ''}>
        <Checkbox checked={selected} onCheckedChange={() => onToggleSelect(checkout.id)} className="bg-white border-slate-300" />
      </div>

      {/* Mini-thumbnail visual */}
      <div className="h-24 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 p-2 flex flex-col gap-1">
          <div className="h-2 w-1/2 rounded bg-slate-300 dark:bg-slate-600" />
          <div className="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-1.5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-auto h-3 rounded bg-[#2bc196]/70" />
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {isWinner && (
            <Badge className="bg-amber-500 text-white border-0 text-[9px] px-1.5 gap-0.5">
              <Trophy className="w-2.5 h-2.5" /> Winner
            </Badge>
          )}
          {hasInsight && (
            <Badge className="bg-purple-500 text-white border-0 text-[9px] px-1.5 gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> IA
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{checkout.name || 'Checkout sem nome'}</h3>
            <p className="text-xs text-slate-500 truncate">{checkout.description || '—'}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => window.open(`/CheckoutPreview?id=${checkout.id}`, '_blank')}>
                <Eye className="w-4 h-4 mr-2" /> Ver como cliente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`/CheckoutPreview?id=${checkout.id}&public=1`, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" /> Abrir link público
              </DropdownMenuItem>
              <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Checkout duplicado')}>
                <CopyIcon className="w-4 h-4 mr-2" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Link de revisão gerado')}>
                <Share2 className="w-4 h-4 mr-2" /> Compartilhar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" /> Analytics deste checkout</DropdownMenuItem>
              <DropdownMenuItem><History className="w-4 h-4 mr-2" /> Histórico de versões</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('QR Code copiado')}>
                <QrCode className="w-4 h-4 mr-2" /> QR Code do link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('JSON exportado')}>
                <FileJson className="w-4 h-4 mr-2" /> Exportar config
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Archive className="w-4 h-4 mr-2" /> Arquivar</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-[10px]", sc.className)}>{sc.label}</Badge>
          <Badge variant="outline" className="text-[10px]">{checkout.type || 'one-step'}</Badge>
        </div>

        {/* KPIs inline */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[9px] uppercase tracking-wide text-slate-500">Conversão</p>
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold">{conv}%</p>
              {trend > 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wide text-slate-500">Ticket</p>
            <p className="text-sm font-bold">R$ {ticket}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wide text-slate-500">Vendas</p>
            <p className="text-sm font-bold">{sales}</p>
          </div>
        </div>

        {checkout.url && (
          <div className="flex items-center gap-1 pt-2">
            <input value={checkout.url} readOnly className="flex-1 text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-600 truncate" />
            <Button variant="outline" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => onCopy(checkout.url)}>
              <CopyIcon className="w-3 h-3" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => window.open(checkout.url, '_blank')}>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}