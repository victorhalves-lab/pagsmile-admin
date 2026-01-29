import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  Plus,
  Link2,
  CreditCard,
  QrCode,
  ArrowUpFromLine,
  Users,
  ShieldAlert,
  BarChart3,
  Settings2,
  GripVertical,
  Check,
  X,
  Repeat,
  FileText,
  Wallet,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Todas as ações disponíveis
const allActions = [
  { id: 'new_checkout', label: 'Novo Checkout', description: 'Criar checkout de pagamento', icon: CreditCard, page: 'CheckoutBuilder', color: 'bg-blue-500' },
  { id: 'new_link', label: 'Link de Pagamento', description: 'Gerar link rápido', icon: Link2, page: 'PaymentLinkCreate', color: 'bg-purple-500' },
  { id: 'pix_receive', label: 'Receber Pix', description: 'Gerar QR Code Pix', icon: QrCode, page: 'IBPixReceive', color: 'bg-emerald-500' },
  { id: 'withdraw', label: 'Sacar', description: 'Solicitar saque', icon: ArrowUpFromLine, page: 'Withdrawals', color: 'bg-amber-500' },
  { id: 'new_subscription', label: 'Nova Assinatura', description: 'Criar assinatura', icon: Repeat, page: 'Subscriptions', color: 'bg-indigo-500' },
  { id: 'new_customer', label: 'Novo Cliente', description: 'Cadastrar cliente', icon: Users, page: 'Customers', color: 'bg-cyan-500' },
  { id: 'disputes', label: 'Ver Disputas', description: 'Gerenciar chargebacks', icon: ShieldAlert, page: 'DisputeDashboard', color: 'bg-red-500' },
  { id: 'reports', label: 'Relatórios', description: 'Acessar relatórios', icon: BarChart3, page: 'Reports', color: 'bg-slate-600' },
  { id: 'financial', label: 'Financeiro', description: 'Visão financeira', icon: Wallet, page: 'FinancialOverview', color: 'bg-green-600' },
  { id: 'extract', label: 'Extrato', description: 'Ver extrato completo', icon: FileText, page: 'FinancialStatement', color: 'bg-teal-500' },
  { id: 'dia_copilot', label: 'DIA Copilot', description: 'Assistente IA', icon: Sparkles, page: 'DIACopilot', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
];

const defaultActions = ['new_checkout', 'new_link', 'pix_receive', 'withdraw'];

export default function QuickActionsCustomizable() {
  const queryClient = useQueryClient();
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActions);
  const [tempSelected, setTempSelected] = useState([]);

  // Fetch user preferences
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: preferences = [] } = useQuery({
    queryKey: ['userPreferences', user?.email],
    queryFn: () => base44.entities.UserPreferences.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const userPrefs = preferences[0];

  // Mutation to save preferences
  const saveMutation = useMutation({
    mutationFn: async (quickActions) => {
      if (userPrefs) {
        return base44.entities.UserPreferences.update(userPrefs.id, { quick_actions: quickActions });
      } else {
        return base44.entities.UserPreferences.create({ quick_actions: quickActions });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userPreferences']);
      toast.success('Ações rápidas atualizadas!');
      setShowCustomizeDialog(false);
    },
    onError: () => {
      toast.error('Erro ao salvar preferências');
    }
  });

  useEffect(() => {
    if (userPrefs?.quick_actions?.length > 0) {
      setSelectedActions(userPrefs.quick_actions);
    }
  }, [userPrefs]);

  const handleOpenCustomize = () => {
    setTempSelected([...selectedActions]);
    setShowCustomizeDialog(true);
  };

  const handleToggleAction = (actionId) => {
    setTempSelected(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else if (prev.length < 4) {
        return [...prev, actionId];
      }
      return prev;
    });
  };

  const handleSave = () => {
    if (tempSelected.length === 0) {
      toast.error('Selecione pelo menos uma ação');
      return;
    }
    saveMutation.mutate(tempSelected);
    setSelectedActions(tempSelected);
  };

  // Get the actions to display
  const displayActions = allActions.filter(a => selectedActions.includes(a.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Ações Rápidas</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenCustomize}
          className="text-slate-500 hover:text-slate-700 h-7 text-xs px-2"
        >
          <Settings2 className="w-3.5 h-3.5 mr-1" />
          Personalizar
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayActions.map((action) => (
          <Link key={action.id} to={createPageUrl(action.page)}>
            <Card className="group hover:shadow-md hover:border-[#2bc196]/30 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
                  action.color
                )}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white text-xs truncate">{action.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {displayActions.length < 4 && (
          <Card
            className="group hover:shadow-md transition-all duration-200 cursor-pointer border-dashed h-full"
            onClick={handleOpenCustomize}
          >
            <CardContent className="p-3 flex items-center gap-3 h-full">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 transition-colors">
                <Plus className="w-4 h-4 text-slate-400" />
              </div>
              <p className="font-medium text-slate-500 text-xs">Adicionar</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customize Dialog */}
      <Dialog open={showCustomizeDialog} onOpenChange={setShowCustomizeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personalizar Ações Rápidas</DialogTitle>
            <DialogDescription>
              Selecione até 4 ações que você mais utiliza para acesso rápido no dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {tempSelected.length}/4 selecionadas
              </p>
              {tempSelected.length === 4 && (
                <p className="text-sm text-amber-600">Máximo de ações atingido</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {allActions.map((action) => {
                const isSelected = tempSelected.includes(action.id);
                const isDisabled = !isSelected && tempSelected.length >= 4;

                return (
                  <div
                    key={action.id}
                    onClick={() => !isDisabled && handleToggleAction(action.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                      isSelected
                        ? "border-[#2bc196] bg-[#2bc196]/5"
                        : isDisabled
                        ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      action.color
                    )}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{action.label}</p>
                      <p className="text-xs text-slate-500 truncate">{action.description}</p>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#2bc196] border-[#2bc196]"
                        : "border-slate-300"
                    )}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomizeDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending || tempSelected.length === 0}
              className="bg-[#2bc196] hover:bg-[#239b7a]"
            >
              {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}