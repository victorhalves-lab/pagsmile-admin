import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Pause, Mail, X, Tag, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function SubaccountsBulkBar({ selectedIds = [], onClear, onAction }) {
  if (selectedIds.length === 0) return null;

  const handleAction = (action) => {
    if (onAction) {
      onAction(action, selectedIds);
    } else {
      toast.success(`Ação "${action}" aplicada em ${selectedIds.length} subcontas`);
    }
  };

  return (
    <div className="sticky top-20 z-20 bg-blue-600 text-white shadow-lg rounded-lg flex items-center gap-3 px-4 py-2.5 animate-in slide-in-from-top-2">
      <Badge className="bg-white text-blue-600 hover:bg-white">
        {selectedIds.length} selecionada{selectedIds.length > 1 ? 's' : ''}
      </Badge>

      <div className="h-6 w-px bg-white/30" />

      <div className="flex items-center gap-1 flex-1 flex-wrap">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleAction('approve')}
          className="text-white hover:bg-white/10"
        >
          <CheckCircle2 className="w-4 h-4 mr-1" />
          Aprovar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleAction('reject')}
          className="text-white hover:bg-white/10"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Rejeitar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleAction('suspend')}
          className="text-white hover:bg-white/10"
        >
          <Pause className="w-4 h-4 mr-1" />
          Suspender
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleAction('email')}
          className="text-white hover:bg-white/10"
        >
          <Mail className="w-4 h-4 mr-1" />
          Re-engajar
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleAction('tag')}
          className="text-white hover:bg-white/10"
        >
          <Tag className="w-4 h-4 mr-1" />
          Aplicar Tag
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => handleAction('rates')}
          className="text-white hover:bg-white/10"
        >
          <Settings className="w-4 h-4 mr-1" />
          Aplicar Taxas
        </Button>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClear}
        className="text-white hover:bg-white/10 h-8 w-8"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}