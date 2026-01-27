import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  ChevronDown, 
  RefreshCw, 
  X, 
  CreditCard,
  RotateCcw,
  Tag,
  Send,
  FileDown,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionMassActions({
  selectedCount = 0,
  selectedTransactions = [],
  onClearSelection,
  onCaptureBatch,
  onCancelBatch,
  onRefundBatch,
  onReprocessBatch,
  onAddTags,
  onResendWebhooks,
  onExport,
}) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [exportFormat, setExportFormat] = useState('csv');
  const [exportColumns, setExportColumns] = useState(['all']);
  const [refundReason, setRefundReason] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const availableTags = [
    { id: 1, name: 'Revisar', color: 'yellow' },
    { id: 2, name: 'VIP', color: 'purple' },
    { id: 3, name: 'Suspeito', color: 'red' },
    { id: 4, name: 'Prioridade', color: 'blue' },
    { id: 5, name: 'Parceiro', color: 'green' },
  ];

  const exportColumnOptions = [
    { value: 'all', label: 'Todas as colunas' },
    { value: 'basic', label: 'Informações básicas' },
    { value: 'financial', label: 'Dados financeiros' },
    { value: 'customer', label: 'Dados do cliente' },
  ];

  const handleConfirmAction = (action, title, description) => {
    setConfirmAction({ action, title, description });
    setShowConfirmDialog(true);
  };

  const executeConfirmedAction = () => {
    if (confirmAction?.action) {
      confirmAction.action();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleExport = () => {
    onExport?.({ format: exportFormat, columns: exportColumns });
    setShowExportDialog(false);
  };

  const handleRefund = () => {
    onRefundBatch?.(selectedTransactions, refundReason);
    setShowRefundDialog(false);
    setRefundReason('');
  };

  const handleAddTags = () => {
    const tagsToAdd = [...selectedTags];
    if (newTag.trim()) {
      tagsToAdd.push({ id: Date.now(), name: newTag.trim(), color: 'gray' });
    }
    onAddTags?.(selectedTransactions, tagsToAdd);
    setShowTagsDialog(false);
    setSelectedTags([]);
    setNewTag('');
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-[#101F3E] rounded-lg text-white">
        <div className="flex items-center gap-2">
          <Badge className="bg-[#00D26A] text-white px-2">
            {selectedCount}
          </Badge>
          <span className="text-sm">
            {selectedCount === 1 ? 'transação selecionada' : 'transações selecionadas'}
          </span>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <div className="flex items-center gap-2">
          {/* Export */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={() => setShowExportDialog(true)}
          >
            <FileDown className="w-4 h-4 mr-1" />
            Exportar
          </Button>

          {/* Capture (for pre-auth) */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={() => handleConfirmAction(
              () => onCaptureBatch?.(selectedTransactions),
              'Capturar Transações',
              `Deseja capturar ${selectedCount} transações pré-autorizadas?`
            )}
          >
            <CreditCard className="w-4 h-4 mr-1" />
            Capturar
          </Button>

          {/* Cancel */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={() => handleConfirmAction(
              () => onCancelBatch?.(selectedTransactions),
              'Cancelar Transações',
              `Deseja cancelar ${selectedCount} transações? Esta ação não pode ser desfeita.`
            )}
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>

          {/* Refund */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={() => setShowRefundDialog(true)}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Estornar
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                Mais Ações
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleConfirmAction(
                () => onReprocessBatch?.(selectedTransactions),
                'Reprocessar Transações',
                `Deseja reprocessar ${selectedCount} transações recusadas?`
              )}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reprocessar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTagsDialog(true)}>
                <Tag className="w-4 h-4 mr-2" />
                Adicionar Tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleConfirmAction(
                () => onResendWebhooks?.(selectedTransactions),
                'Reenviar Webhooks',
                `Deseja reenviar webhooks para ${selectedCount} transações?`
              )}>
                <Send className="w-4 h-4 mr-2" />
                Reenviar Webhooks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1" />

        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={onClearSelection}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar Transações</DialogTitle>
            <DialogDescription>
              Exportar {selectedCount} transações selecionadas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Formato</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Colunas</Label>
              <Select value={exportColumns[0]} onValueChange={(v) => setExportColumns([v])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportColumnOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} className="bg-[#00D26A] hover:bg-[#00A854]">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estornar Transações</DialogTitle>
            <DialogDescription>
              Estornar {selectedCount} transações selecionadas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Atenção</p>
                <p>Esta ação não pode ser desfeita. Os valores serão devolvidos aos clientes.</p>
              </div>
            </div>
            <div>
              <Label>Motivo do Estorno (opcional)</Label>
              <Textarea
                placeholder="Descreva o motivo do estorno..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRefund} variant="destructive">
              Estornar {selectedCount} Transações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tags Dialog */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Tags</DialogTitle>
            <DialogDescription>
              Adicionar tags a {selectedCount} transações
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tags Disponíveis</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                    className={cn(
                      "cursor-pointer",
                      selectedTags.includes(tag.id) && 'bg-[#00D26A]'
                    )}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag.id)
                          ? prev.filter(t => t !== tag.id)
                          : [...prev, tag.id]
                      );
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label>Nova Tag</Label>
              <Input
                placeholder="Digite o nome da nova tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagsDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTags} className="bg-[#00D26A] hover:bg-[#00A854]">
              <Tag className="w-4 h-4 mr-2" />
              Adicionar Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.title}</DialogTitle>
            <DialogDescription>
              {confirmAction?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={executeConfirmedAction} className="bg-[#00D26A] hover:bg-[#00A854]">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}