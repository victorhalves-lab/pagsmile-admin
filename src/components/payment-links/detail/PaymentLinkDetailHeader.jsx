import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit, Copy, Pause, Play, Trash2, Archive, Sparkles, FileText, MoreHorizontal,
  ExternalLink, MessageSquareWarning,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Link2 } from 'lucide-react';
import { toast } from 'sonner';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function PaymentLinkDetailHeader({ link, onEdit, onAction }) {
  if (!link) return null;

  const statusMap = {
    active: { label: 'Ativo', cls: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    inactive: { label: 'Inativo', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
    expired: { label: 'Expirado', cls: 'bg-slate-100 text-slate-500 border-slate-300' },
    sold_out: { label: 'Esgotado', cls: 'bg-amber-100 text-amber-700 border-amber-300' },
    draft: { label: 'Rascunho', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
  };
  const st = statusMap[link.status] || statusMap.draft;

  return (
    <Card className="p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Imagem */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          {link.main_image_url ? (
            <img src={link.main_image_url} alt={link.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Link2 className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold truncate">{link.name}</h2>
            <Badge className={`${st.cls} border`}>{st.label}</Badge>
            {link.value_type === 'fixed' && (
              <span className="text-xl font-bold text-emerald-600">{formatBRL(link.amount)}</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {link.description || 'Sem descrição'}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="font-mono">{link.short_url || link.url}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(link.short_url || link.url);
                toast.success('Link copiado');
              }}
            >
              <Copy className="w-3 h-3 mr-1" /> Copiar
            </Button>
            <a href={link.url} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-blue-600">
              <ExternalLink className="w-3 h-3" /> Abrir
            </a>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="w-3.5 h-3.5 mr-1" /> Editar
          </Button>
          {link.status === 'active' ? (
            <Button size="sm" variant="outline" onClick={() => onAction?.('pause')}>
              <Pause className="w-3.5 h-3.5 mr-1" /> Pausar
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => onAction?.('activate')}>
              <Play className="w-3.5 h-3.5 mr-1" /> Reativar
            </Button>
          )}
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={() => onAction?.('ab_test')}>
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Iniciar A/B
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction?.('duplicate')}>
                <Copy className="w-4 h-4 mr-2" /> Duplicar link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.('coupon')}>
                <Sparkles className="w-4 h-4 mr-2" /> Aplicar cupom
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.('recovery')}>
                <MessageSquareWarning className="w-4 h-4 mr-2" /> Lembrete a abandonadores
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.('pdf')}>
                <FileText className="w-4 h-4 mr-2" /> Relatório PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.('archive')}>
                <Archive className="w-4 h-4 mr-2" /> Arquivar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onAction?.('delete')}>
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}