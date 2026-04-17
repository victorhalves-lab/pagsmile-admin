import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CreditCard,
  QrCode,
  Copy,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Split,
  Repeat,
  Send,
  RotateCcw,
  Printer,
  Tag,
  MessageSquare,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard as CardIcon,
  Calendar,
  DollarSign,
  Percent,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';

const TimelineEvent = ({ icon: Icon, iconColor, title, description, timestamp, isLast }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", iconColor)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
    </div>
    <div className={cn("pb-6", isLast && "pb-0")}>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value, copyable, mono }) => (
  <div className="flex items-start justify-between py-2">
    <span className="text-sm text-gray-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className={cn("text-sm font-medium text-gray-900 text-right", mono && "font-mono")}>
        {value || '-'}
      </span>
      {copyable && value && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => navigator.clipboard.writeText(value)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Copiar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  </div>
);

export default function TransactionDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('id');

  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [note, setNote] = useState('');

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const transactions = await base44.entities.Transaction.filter({ id: transactionId });
      return transactions[0] || null;
    },
    enabled: !!transactionId
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleRefund = () => {
    console.log('Refunding:', { amount: refundAmount, reason: refundReason });
    setShowRefundDialog(false);
    setRefundAmount('');
    setRefundReason('');
  };

  const handleAddNote = () => {
    console.log('Adding note:', note);
    setShowNoteDialog(false);
    setNote('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Transação não encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(createPageUrl('Transactions'))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const isCard = transaction.type === 'card';
  const isPix = transaction.type === 'pix';

  // Mock timeline events
  const timelineEvents = [
    {
      icon: Clock,
      iconColor: 'bg-blue-500',
      title: 'Transação Criada',
      description: `Via ${transaction.channel || 'API'}`,
      timestamp: transaction.created_date ? format(new Date(transaction.created_date), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }) : '-'
    },
    ...(transaction.antifraud_status ? [{
      icon: Shield,
      iconColor: transaction.antifraud_status === 'approved' ? 'bg-green-500' : 'bg-yellow-500',
      title: 'Análise Antifraude',
      description: `Score: ${transaction.risk_score || 'N/A'} - ${transaction.antifraud_status === 'approved' ? 'Aprovado' : 'Em Revisão'}`,
      timestamp: transaction.created_date ? format(new Date(transaction.created_date), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }) : '-'
    }] : []),
    {
      icon: transaction.status === 'approved' ? CheckCircle : transaction.status === 'declined' ? XCircle : Clock,
      iconColor: transaction.status === 'approved' ? 'bg-green-500' : transaction.status === 'declined' ? 'bg-red-500' : 'bg-yellow-500',
      title: transaction.status === 'approved' ? 'Pagamento Aprovado' : transaction.status === 'declined' ? 'Pagamento Recusado' : 'Aguardando Pagamento',
      description: transaction.status === 'declined' ? (transaction.decline_reason || 'Motivo não informado') : (isCard ? `Código de autorização: ${transaction.authorization_code || 'N/A'}` : `E2EID: ${transaction.pix_key || 'N/A'}`),
      timestamp: transaction.updated_date ? format(new Date(transaction.updated_date), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }) : '-'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalhes da Transação"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: transaction.transaction_id?.slice(0, 8) || 'Detalhe', page: 'TransactionDetail' }
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate(createPageUrl('Transactions'))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        }
      />

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center",
                isCard ? 'bg-blue-100' : 'bg-teal-100'
              )}>
                {isCard ? (
                  <CreditCard className="w-7 h-7 text-blue-600" />
                ) : (
                  <QrCode className="w-7 h-7 text-teal-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{formatCurrency(transaction.amount)}</h2>
                  <StatusBadge status={transaction.status} size="lg" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 font-mono">{transaction.transaction_id}</span>
                  <button 
                    onClick={() => copyToClipboard(transaction.transaction_id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {transaction.antifraud_status && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Antifraude
                    </Badge>
                  )}
                  {transaction.has_split && (
                    <Badge variant="outline" className="gap-1">
                      <Split className="w-3 h-3" />
                      Split
                    </Badge>
                  )}
                  {transaction.is_recurring && (
                    <Badge variant="outline" className="gap-1">
                      <Repeat className="w-3 h-3" />
                      Recorrente
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {transaction.status === 'approved' && (
                <Button variant="outline" onClick={() => {
                  setRefundAmount(String(transaction.amount));
                  setShowRefundDialog(true);
                }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {isPix ? 'Devolver' : 'Estornar'}
                </Button>
              )}
              {transaction.status === 'pre_authorized' && (
                <>
                  <Button className="bg-[#00D26A] hover:bg-[#00A854]">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Capturar
                  </Button>
                  <Button variant="outline">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => setShowNoteDialog(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Nota
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Reenviar Webhook
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineEvents.map((event, idx) => (
                <TimelineEvent
                  key={idx}
                  {...event}
                  isLast={idx === timelineEvents.length - 1}
                />
              ))}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isCard ? 'Dados do Cartão' : 'Dados do Pix'}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100">
              {isCard ? (
                <>
                  <InfoRow label="Bandeira" value={transaction.card_brand?.toUpperCase()} />
                  <InfoRow label="BIN" value="411111" copyable mono />
                  <InfoRow label="Últimos 4 Dígitos" value={transaction.card_last_four} mono />
                  <InfoRow label="Tipo de Cartão" value="Crédito" />
                  <InfoRow label="Banco Emissor" value="Itaú Unibanco" />
                  <InfoRow label="País de Emissão" value="🇧🇷 Brasil" />
                  <InfoRow label="Parcelamento" value={transaction.installments > 1 ? `${transaction.installments}x de ${formatCurrency(transaction.amount / transaction.installments)}` : 'À vista'} />
                  <InfoRow label="Código de Autorização" value={transaction.authorization_code || '123456'} copyable mono />
                  <InfoRow label="NSU" value="789456123" copyable mono />
                  <InfoRow label="3D Secure" value={transaction.threeds_authenticated ? '✓ Autenticado (ECI 05)' : 'Não aplicado'} />
                </>
              ) : (
                <>
                  <InfoRow label="E2EID" value={transaction.pix_key || 'E18236120202012345678901234567'} copyable mono />
                  <InfoRow label="Tipo de Cobrança" value="Cobrança Imediata" />
                  <InfoRow label="Chave Pix Recebedora" value="pagsmile@empresa.com" copyable />
                  <InfoRow label="Tempo de Pagamento" value="2 min 34 seg" />
                  <InfoRow label="Data de Liquidação" value={transaction.settlement_date ? format(new Date(transaction.settlement_date), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '-'} />
                </>
              )}
            </CardContent>
          </Card>

          {/* Values and Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Valores e Taxas</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100">
              <InfoRow label="Valor Bruto" value={formatCurrency(transaction.amount)} />
              <InfoRow label="MDR (Taxa de Processamento)" value={`${formatCurrency(transaction.fee_amount || transaction.amount * 0.0349)} (${transaction.fee_percentage || 3.49}%)`} />
              <InfoRow label="Taxa de Antecipação" value="R$ 0,00" />
              <div className="flex items-start justify-between py-2 bg-green-50 -mx-6 px-6 mt-2">
                <span className="text-sm font-medium text-green-700">Valor Líquido</span>
                <span className="text-sm font-bold text-green-700">
                  {formatCurrency(transaction.net_amount || transaction.amount * 0.9651)}
                </span>
              </div>
              <InfoRow label="Data de Liquidação" value={transaction.settlement_date || 'D+30 - 26/02/2026'} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do Pagador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.customer_name || 'Cliente'}</p>
                  <p className="text-xs text-gray-500">CPF: {transaction.customer_document || '***.***.***-**'}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{transaction.customer_email || 'email@exemplo.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">(11) 99999-9999</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">
                    Av. Paulista, 1000 - Bela Vista<br />
                    São Paulo - SP, 01310-100
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Perfil do Cliente
              </Button>
            </CardContent>
          </Card>

          {/* Reference Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Códigos de Referência</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-gray-100">
              <InfoRow label="ID PagSmile" value={transaction.transaction_id} copyable mono />
              <InfoRow label="ID Pedido Merchant" value={transaction.merchant_order_id || 'ORD-123456'} copyable mono />
              {isCard && (
                <>
                  <InfoRow label="TID" value="1234567890123456789" copyable mono />
                  <InfoRow label="ARN" value="12345678901234567890123" copyable mono />
                </>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          {transaction.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40">
                  {JSON.stringify(transaction.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Refund Side Drawer */}
      <SideDrawer
        open={showRefundDialog}
        onOpenChange={setShowRefundDialog}
        title={isPix ? 'Devolver Pix' : 'Estornar Transação'}
        description={isPix ? 'Solicitar devolução do valor ao pagador' : 'Estornar o valor ao cliente'}
        icon={RotateCcw}
        iconClassName="bg-red-100 text-red-600"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRefund} className="bg-[#00D26A] hover:bg-[#00A854]">
              Confirmar {isPix ? 'Devolução' : 'Estorno'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Valor a {isPix ? 'devolver' : 'estornar'}</Label>
            <Input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Máximo: {formatCurrency(transaction.amount)}
            </p>
          </div>
          <div>
            <Label>Motivo {isPix && <span className="text-red-500">*</span>}</Label>
            <Textarea
              placeholder="Descreva o motivo..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </SideDrawer>

      {/* Note Side Drawer */}
      <SideDrawer
        open={showNoteDialog}
        onOpenChange={setShowNoteDialog}
        title="Adicionar Nota"
        description="Inserir uma nota interna sobre esta transação"
        icon={MessageSquare}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddNote} className="bg-[#00D26A] hover:bg-[#00A854]">
              Salvar Nota
            </Button>
          </div>
        }
      >
        <Textarea
          placeholder="Digite sua nota..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={6}
        />
      </SideDrawer>
    </div>
  );
}