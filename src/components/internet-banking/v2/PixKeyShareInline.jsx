import React from 'react';
import { MessageCircle, Mail, QrCode, Link2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

/**
 * Quick share por chave: QR + WhatsApp + Email + Link.
 * + Toggle Pause/Activate (sem deletar).
 */
export default function PixKeyShareInline({ pixKey, paused = false, onTogglePause }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Link2 className="w-4 h-4 mr-1" />
            Compartilhar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Compartilhar chave</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <QrCode className="w-4 h-4 mr-2 text-slate-700" />
            Gerar QR Code
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
            Enviar por WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="w-4 h-4 mr-2 text-blue-600" />
            Enviar por E-mail
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link2 className="w-4 h-4 mr-2 text-purple-600" />
            Copiar link de pagamento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        onClick={onTogglePause}
        className={paused ? "text-emerald-600 border-emerald-300 hover:bg-emerald-50" : "text-slate-600"}
      >
        {paused ? (
          <>
            <Play className="w-4 h-4 mr-1" />
            Reativar
          </>
        ) : (
          <>
            <Pause className="w-4 h-4 mr-1" />
            Pausar
          </>
        )}
      </Button>
    </>
  );
}