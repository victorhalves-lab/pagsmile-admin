import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Printer, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function MentorReceiptCard({ transaction }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Receipt className="w-4 h-4 text-slate-600" />Comprovante Visual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-4 font-mono text-[11px] text-slate-700">
          <p className="text-center font-bold mb-2">═══ COMPROVANTE PAGSMILE ═══</p>
          <p>Transação: {transaction?.transaction_id?.slice(0, 12) || 'tx_sample'}</p>
          <p>Data: {new Date().toLocaleString('pt-BR')}</p>
          <p>Valor: R$ {(transaction?.amount || 1259.90).toFixed(2)}</p>
          <p>Status: APROVADA ✓</p>
          <p>Adquirente: Cielo</p>
          <p>NSU: 789456123 · Auth: 123456</p>
          <p className="text-center mt-2 font-bold">─── Obrigado ───</p>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success('Segunda via emitida em PDF')}>
            <Printer className="w-3.5 h-3.5 mr-1" />Reimprimir PDF
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success('Comprovante enviado por e-mail ao pagador')}>
            <Send className="w-3.5 h-3.5 mr-1" />Enviar ao pagador
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}