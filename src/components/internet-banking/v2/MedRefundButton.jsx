import React from 'react';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Botão "Solicitar Devolução (MED)" no detalhe de transação received.
 * Conexão visual com B8/B9. Não executa devolução real, apenas surface a ação.
 */
export default function MedRefundButton({ transaction }) {
  // Só faz sentido para PIX recebido nos últimos 80 dias (regra MED)
  if (!transaction || transaction.type !== 'received') return null;

  const handleClick = () => {
    // No futuro: abrir wizard MED. Por ora apenas indica disponibilidade.
    alert('Encaminhando para o fluxo de Devolução MED PIX (B8/B9)...');
  };

  return (
    <Button
      variant="outline"
      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
      onClick={handleClick}
    >
      <Undo2 className="w-4 h-4 mr-2" />
      Devolução (MED)
    </Button>
  );
}