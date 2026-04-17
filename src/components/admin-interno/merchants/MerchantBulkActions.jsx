import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  ChevronDown, Tag, FolderPlus, FolderMinus, CheckCircle,
  Lock, Ban, Mail, Download, Settings, X, AlertTriangle, Eye
} from 'lucide-react';

const BLOCK_REASONS = [
  { value: 'cb_ratio', label: 'CB Ratio Excessivo' },
  { value: 'med_ratio', label: 'MED Ratio Excessivo' },
  { value: 'fraud', label: 'Fraude Comprovada' },
  { value: 'docs', label: 'Documentação Irregular' },
  { value: 'suspicious', label: 'Atividade Suspeita' },
  { value: 'judicial', label: 'Solicitação Judicial' },
  { value: 'other', label: 'Outro (especificar)' }
];

export default function MerchantBulkActions({ selectedCount, selectedIds, onClearSelection, onAction }) {
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  const [blockReason, setBlockReason] = useState('');
  const [blockJustification, setBlockJustification] = useState('');
  const [blockConfirmation, setBlockConfirmation] = useState('');
  const [notifyMerchants, setNotifyMerchants] = useState(true);
  const [blockSubaccounts, setBlockSubaccounts] = useState(false);

  const handleBlock = () => {
    if (blockConfirmation !== 'BLOQUEAR') return;
    onAction('block', {
      merchantIds: selectedIds,
      reason: blockReason,
      justification: blockJustification,
      notifyMerchants,
      blockSubaccounts
    });
    setShowBlockModal(false);
    resetBlockForm();
  };

  const resetBlockForm = () => {
    setBlockReason('');
    setBlockJustification('');
    setBlockConfirmation('');
    setNotifyMerchants(true);
    setBlockSubaccounts(false);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Checkbox checked={true} />
          <span className="font-medium">{selectedCount} merchants selecionados</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Ações em Massa
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowTagsModal(true)}>
              <Tag className="w-4 h-4 mr-2" /> Adicionar Tags
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Tag className="w-4 h-4 mr-2" /> Remover Tags
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowGroupModal(true)}>
              <FolderPlus className="w-4 h-4 mr-2" /> Adicionar ao Grupo
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderMinus className="w-4 h-4 mr-2" /> Remover do Grupo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <CheckCircle className="w-4 h-4 mr-2" /> Ativar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-yellow-600">
              <Lock className="w-4 h-4 mr-2" /> Suspender
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => setShowBlockModal(true)}>
              <Ban className="w-4 h-4 mr-2" /> Bloquear
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowEmailModal(true)}>
              <Mail className="w-4 h-4 mr-2" /> Enviar E-mail
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" /> Exportar Selecionados
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" /> Alterar Configuração em Massa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="w-4 h-4 mr-1" /> Limpar Seleção
        </Button>
      </div>

      {/* Block Modal */}
      <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Ban className="w-5 h-5" /> Bloquear Merchants
            </DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 p-3 mt-2 bg-red-50 text-red-800 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>Esta ação irá bloquear {selectedCount} merchants.</span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-sm space-y-1">
              <p className="font-medium">Efeitos do bloqueio:</p>
              <ul className="list-disc list-inside text-slate-600">
                <li>Novas transações serão rejeitadas imediatamente</li>
                <li>Saques pendentes serão cancelados</li>
                <li>Acesso ao portal será bloqueado</li>
                <li>E-mail de notificação será enviado</li>
              </ul>
            </div>

            <div>
              <Label>Motivo do Bloqueio *</Label>
              <Select value={blockReason} onValueChange={setBlockReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo..." />
                </SelectTrigger>
                <SelectContent>
                  {BLOCK_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Justificativa Detalhada *</Label>
              <Textarea
                placeholder="Descreva em detalhes a razão do bloqueio..."
                value={blockJustification}
                onChange={(e) => setBlockJustification(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-slate-500 mt-1">Mínimo 50 caracteres</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notify"
                  checked={notifyMerchants}
                  onCheckedChange={setNotifyMerchants}
                />
                <Label htmlFor="notify">Notificar merchants por e-mail</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="subaccounts"
                  checked={blockSubaccounts}
                  onCheckedChange={setBlockSubaccounts}
                />
                <Label htmlFor="subaccounts">Bloquear também contas vinculadas (subcontas)</Label>
              </div>
            </div>

            <div>
              <Label>Confirmação</Label>
              <p className="text-sm text-slate-500 mb-2">Digite "BLOQUEAR" para confirmar:</p>
              <Input
                placeholder="BLOQUEAR"
                value={blockConfirmation}
                onChange={(e) => setBlockConfirmation(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlock}
              disabled={
                !blockReason ||
                blockJustification.length < 50 ||
                blockConfirmation !== 'BLOQUEAR'
              }
            >
              <Ban className="w-4 h-4 mr-2" /> Bloquear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tags Modal */}
      <Dialog open={showTagsModal} onOpenChange={setShowTagsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Tags</DialogTitle>
            <DialogDescription>
              Merchants selecionados: {selectedCount}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione as Tags</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['VIP', 'Novo Cliente', 'Alto Risco', 'Promoção Q1', 'Requer Atenção', 'Piloto'].map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox id={`tag-${tag}`} />
                    <Label htmlFor={`tag-${tag}`}>🏷️ {tag}</Label>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-slate-500">
              ⚠️ Merchants que já possuem estas tags não serão afetados.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagsModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowTagsModal(false)}>
              <Tag className="w-4 h-4 mr-2" /> Adicionar Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Modal */}
      <Dialog open={showGroupModal} onOpenChange={setShowGroupModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar ao Grupo</DialogTitle>
            <DialogDescription>
              Merchants selecionados: {selectedCount}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Selecione o Grupo</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">📁 VIP (45 merchants)</SelectItem>
                  <SelectItem value="parceria">📁 Parceria ABC (123 merchants)</SelectItem>
                  <SelectItem value="promo">📁 Taxa Promo Q1 (67 merchants)</SelectItem>
                  <SelectItem value="monitoramento">📁 Monitoramento (12 merchants)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-slate-500">
              ⚠️ Merchants já pertencentes a este grupo não serão afetados.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGroupModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowGroupModal(false)}>
              <FolderPlus className="w-4 h-4 mr-2" /> Adicionar ao Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar E-mail em Massa</DialogTitle>
            <DialogDescription>
              Destinatários: {selectedCount} merchants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template ou escreva do zero..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Boas-vindas</SelectItem>
                  <SelectItem value="update">Atualização de Taxas</SelectItem>
                  <SelectItem value="maintenance">Manutenção Programada</SelectItem>
                  <SelectItem value="custom">Escrever do zero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assunto *</Label>
              <Input placeholder="[PagSmile] Comunicado Importante" />
            </div>
            <div>
              <Label>Mensagem *</Label>
              <Textarea
                placeholder="Olá {{nome_contato}},&#10;&#10;Gostaríamos de informar..."
                rows={8}
              />
              <p className="text-xs text-slate-500 mt-1">
                Variáveis disponíveis: {'{{nome_contato}}'} {'{{nome_fantasia}}'} {'{{cnpj}}'} {'{{id_merchant}}'} {'{{saldo}}'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancelar
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button onClick={() => setShowEmailModal(false)}>
              <Mail className="w-4 h-4 mr-2" /> Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}