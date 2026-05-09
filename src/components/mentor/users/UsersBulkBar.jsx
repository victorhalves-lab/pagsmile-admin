import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldOff, KeyRound, Mail, X, Download, Power } from 'lucide-react';

export default function UsersBulkBar({ count, onAction, onClear }) {
  if (count === 0) return null;
  return (
    <Card className="border-blue-300 bg-blue-50 dark:bg-blue-900/20 sticky top-2 z-10 shadow-md">
      <CardContent className="p-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClear}>
            <X className="w-3.5 h-3.5" />
          </Button>
          <span className="text-sm font-bold">{count} usuário{count > 1 ? 's' : ''} selecionado{count > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => onAction?.('reset_pwd')}>
            <KeyRound className="w-3 h-3 mr-1" />Reset senhas
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAction?.('force_mfa')}>
            <Mail className="w-3 h-3 mr-1" />Forçar MFA
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAction?.('export')}>
            <Download className="w-3 h-3 mr-1" />Exportar
          </Button>
          <Button size="sm" variant="outline" className="text-amber-700" onClick={() => onAction?.('suspend')}>
            <ShieldOff className="w-3 h-3 mr-1" />Suspender
          </Button>
          <Button size="sm" variant="outline" className="text-red-700" onClick={() => onAction?.('deactivate')}>
            <Power className="w-3 h-3 mr-1" />Desativar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}