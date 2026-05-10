import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, ChevronRight, ExternalLink, Copy, Share2, BarChart3,
  Link2, QrCode, CreditCard, Eye, TrendingUp, Calendar, Edit,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Drawer compacto de Payment Link. CTAs: Copiar, Compartilhar, Editar, Abrir Detail completo.
 */
export default function PaymentLinkDetailDrawer({ link, allRows = [], open, onClose, onNavigate, onEdit }) {
  if (!link) return null;

  const idx = allRows.findIndex(r => r.id === link.id);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < allRows.length - 1;
  const url = link.short_url || link.url;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  const statusColor = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    expired: 'bg-amber-100 text-amber-700',
    sold_out: 'bg-red-100 text-red-700',
  };

  const conversions = link.conversions_count || 0;
  const visits = link.views_count || 0;
  const conversionRate = visits > 0 ? ((conversions / visits) * 100).toFixed(1) : '0.0';
  const revenue = link.total_revenue || (conversions * (link.amount || 0));

  return (
    <SideDrawer
      open={open}
      onOpenChange={(v) => !v && onClose?.()}
      title={link.name || 'Link de Pagamento'}
      description={url}
      icon={Link2}
      iconClassName="bg-blue-100"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!hasPrev}
              onClick={() => hasPrev && onNavigate?.(allRows[idx - 1])}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-500">{idx + 1} de {allRows.length}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!hasNext}
              onClick={() => hasNext && onNavigate?.(allRows[idx + 1])}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit?.(link)}>
              <Edit className="w-3.5 h-3.5 mr-1" /> Editar
            </Button>
            <Button asChild size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Link to={createPageUrl(`PaymentLinkDetail?id=${link.id}`)}>
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Detalhes
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Status + Imagem */}
        <div className="flex items-start gap-3">
          {link.main_image_url ? (
            <img src={link.main_image_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-slate-400" />
            </div>
          )}
          <div className="flex-1">
            <Badge className={statusColor[link.status] || statusColor.inactive}>
              {link.status === 'active' ? 'Ativo' : link.status === 'expired' ? 'Expirado' : link.status === 'sold_out' ? 'Esgotado' : 'Inativo'}
            </Badge>
            {link.description && (
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{link.description}</p>
            )}
          </div>
        </div>

        {/* Valor */}
        <div className="rounded-xl border bg-gradient-to-br from-slate-50 to-white p-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Valor</p>
          {link.value_type === 'fixed' ? (
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(link.amount)}</p>
          ) : (
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(link.min_amount || 0)} <span className="text-sm text-slate-500">–</span> {formatCurrency(link.max_amount || 0)}
            </p>
          )}
          {link.max_installments > 1 && link.amount && (
            <p className="text-xs text-slate-500 mt-0.5">
              Até {link.max_installments}x de {formatCurrency(link.amount / link.max_installments)}
            </p>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-emerald-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Receita
            </p>
            <p className="text-lg font-bold text-emerald-900">{formatCurrency(revenue)}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-blue-700 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" /> Conversão
            </p>
            <p className="text-lg font-bold text-blue-900">{conversionRate}%</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-slate-600 flex items-center gap-1">
              <Eye className="w-3 h-3" /> Visitas
            </p>
            <p className="text-lg font-bold text-slate-900">{visits}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-[10px] uppercase font-semibold text-slate-600">Conversões</p>
            <p className="text-lg font-bold text-slate-900">{conversions}</p>
          </div>
        </div>

        {/* Métodos de pagamento */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Métodos aceitos</p>
          <div className="flex gap-2">
            {(link.payment_methods || []).includes('pix') && (
              <Badge variant="outline" className="gap-1">
                <QrCode className="w-3 h-3" /> PIX
                {link.pix_discount_percentage > 0 && (
                  <span className="text-emerald-600 ml-1">-{link.pix_discount_percentage}%</span>
                )}
              </Badge>
            )}
            {(link.payment_methods || []).includes('card') && (
              <Badge variant="outline" className="gap-1">
                <CreditCard className="w-3 h-3" /> Cartão
              </Badge>
            )}
            {(link.payment_methods || []).includes('boleto') && (
              <Badge variant="outline">Boleto</Badge>
            )}
          </div>
        </div>

        {/* URL com ações de cópia */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Link público</p>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border">
            <span className="flex-1 font-mono text-xs truncate">{url}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyLink}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(url, '_blank')}>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { copyLink(); }}>
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Validade */}
        {(link.expires_at || link.max_uses) && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Limites</p>
            <div className="space-y-1 text-sm">
              {link.expires_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expira em {format(new Date(link.expires_at), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
              )}
              {link.max_uses && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Uso: {link.used_count || 0} / {link.max_uses}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SideDrawer>
  );
}