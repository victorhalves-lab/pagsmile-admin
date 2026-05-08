import React from 'react';
import {
  ContextMenu, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuTrigger, ContextMenuSub,
  ContextMenuSubTrigger, ContextMenuSubContent,
} from '@/components/ui/context-menu';
import { Eye, Copy, RotateCcw, Tag, FileText, Send, Flag, ExternalLink, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Right-click contextual menu (Linear/Notion-style) sobre linhas de transação.
 */
export default function TransactionContextMenu({ children, row, onView, onCompare }) {
  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onView?.(row)}>
          <Eye className="w-4 h-4 mr-2" />
          Ver detalhes
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onCompare?.(row)}>
          <Sparkles className="w-4 h-4 mr-2 text-[#2bc196]" />
          Comparar com outra
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Copy className="w-4 h-4 mr-2" />
            Copiar
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => copy(row.transaction_id, 'ID')}>ID da transação</ContextMenuItem>
            <ContextMenuItem onClick={() => copy(row.customer?.email || row.customer_email || '', 'E-mail')}>E-mail do cliente</ContextMenuItem>
            <ContextMenuItem onClick={() => copy(row.customer?.document || '', 'CPF/CNPJ')}>CPF/CNPJ</ContextMenuItem>
            <ContextMenuItem onClick={() => copy(row.acquirer_data?.authorization_code || '', 'Cód. autorização')}>Cód. autorização</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {row.status === 'approved' && (
          <ContextMenuItem onClick={() => toast.success('Reembolso iniciado')}>
            <RotateCcw className="w-4 h-4 mr-2 text-amber-500" />
            Estornar
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => toast.success('Tag adicionada')}>
          <Tag className="w-4 h-4 mr-2" />
          Adicionar tag
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toast.success('Nota interna salva')}>
          <FileText className="w-4 h-4 mr-2" />
          Nota interna
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toast.success('Recibo reenviado')}>
          <Send className="w-4 h-4 mr-2" />
          Reenviar recibo
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toast.success('Marcado para revisão')}>
          <Flag className="w-4 h-4 mr-2 text-red-500" />
          Marcar para revisão
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => window.open(`#tx=${row.transaction_id}`, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Abrir em nova aba
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}