import React, { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Star,
  Trash2,
  Building2,
  Mail,
  Phone,
  Hash,
  ArrowRightLeft,
  Shield,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export default function IBPixKeys() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKeyType, setSelectedKeyType] = useState('email');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [keyToDelete, setKeyToDelete] = useState(null);

  const pixKeys = [
    {
      id: 1,
      type: 'cnpj',
      value: '98.765.432/0001-10',
      icon: Building2,
      label: 'CNPJ',
      isPrimary: true,
      registeredAt: '15/01/2025'
    },
    {
      id: 2,
      type: 'email',
      value: 'financeiro@lojaabc.com.br',
      icon: Mail,
      label: 'E-mail',
      isPrimary: false,
      registeredAt: '20/01/2025'
    },
    {
      id: 3,
      type: 'random',
      value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      icon: Hash,
      label: 'Chave Aleatória',
      isPrimary: false,
      registeredAt: '25/01/2025'
    },
  ];

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key.value);
    setCopiedKey(key.id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = (key) => {
    setKeyToDelete(key);
    setShowDeleteDialog(true);
  };

  const keyTypeOptions = [
    {
      id: 'cnpj',
      label: 'CPF/CNPJ',
      description: 'Seu CNPJ: 98.765.432/0001-10',
      icon: Building2,
      disabled: true,
      disabledReason: 'Já cadastrado nesta conta'
    },
    {
      id: 'email',
      label: 'E-mail',
      description: 'Informe o e-mail que deseja cadastrar',
      icon: Mail,
      disabled: false
    },
    {
      id: 'phone',
      label: 'Telefone',
      description: 'Informe o telefone com DDD',
      icon: Phone,
      disabled: false
    },
    {
      id: 'random',
      label: 'Chave Aleatória',
      description: 'Geraremos uma chave única automaticamente',
      icon: Hash,
      disabled: false
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Minhas Chaves Pix</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Você pode cadastrar até 20 chaves por conta
          </p>
        </div>
        <Button
          onClick={() => setShowRegisterModal(true)}
          className="bg-[#00D26A] hover:bg-[#00B85C]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Cadastrar Chave
        </Button>
      </div>

      {/* Keys Count */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-[#00D26A]" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Chaves cadastradas: <strong>{pixKeys.length} de 20</strong>
            </span>
          </div>
          <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00D26A] rounded-full"
              style={{ width: `${(pixKeys.length / 20) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Keys */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Chaves Ativas
        </h2>
        <Card>
          <CardContent className="p-0 divide-y dark:divide-slate-700">
            {pixKeys.map((key) => (
              <div key={key.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mt-1">
                      <key.icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white">{key.label}</p>
                        {key.isPrimary && (
                          <Badge className="bg-[#00D26A]/10 text-[#00D26A] border-0">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Principal
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-mono mt-1 break-all">
                        {key.value}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Cadastrada em: {key.registeredAt}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 ml-13">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(key)}
                    className={cn(
                      "transition-all",
                      copiedKey === key.id && "bg-emerald-50 border-emerald-200 text-emerald-600"
                    )}
                  >
                    {copiedKey === key.id ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copiar
                      </>
                    )}
                  </Button>

                  {key.isPrimary ? (
                    <Button variant="outline" size="sm" disabled>
                      <Star className="w-4 h-4 mr-1 fill-current text-amber-500" />
                      Principal
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4 mr-1" />
                      Definir como principal
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(key)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Other Actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          Outras Ações
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Portabilidade de Chave</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Trazer uma chave que está em outro banco para cá.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Reivindicar Chave</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Recuperar uma chave cadastrada indevidamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Register Key Modal */}
      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Chave Pix</DialogTitle>
            <DialogDescription>
              Selecione o tipo de chave que deseja cadastrar
            </DialogDescription>
          </DialogHeader>

          <RadioGroup value={selectedKeyType} onValueChange={setSelectedKeyType} className="space-y-3">
            {keyTypeOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border transition-all",
                  option.disabled
                    ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50"
                    : selectedKeyType === option.id
                    ? "border-[#00D26A] bg-[#00D26A]/5"
                    : "hover:border-slate-300 cursor-pointer"
                )}
              >
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  disabled={option.disabled}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4 text-slate-500" />
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                  {option.disabled && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {option.disabledReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>

          {(selectedKeyType === 'email' || selectedKeyType === 'phone') && (
            <div className="space-y-2 pt-4">
              <Label>
                {selectedKeyType === 'email' ? 'E-mail' : 'Telefone'}
              </Label>
              <Input
                placeholder={selectedKeyType === 'email' ? 'vendas@lojaabc.com.br' : '(11) 99999-9999'}
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>Ao cadastrar, você precisará confirmar a posse do e-mail/telefone.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterModal(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00B85C]">
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Chave Pix?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a chave <strong>{keyToDelete?.value}</strong>?
              Esta ação não pode ser desfeita e você não poderá mais receber Pix nesta chave.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}