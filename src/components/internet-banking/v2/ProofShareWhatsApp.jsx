import React from 'react';
import { MessageCircle, Mail, FileImage, FileText } from 'lucide-react';
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
 * Substitui o botão de Share simples — agora abre dropdown com WhatsApp / Email / formatos.
 * Não remove o botão Download PDF original — coexiste.
 */
export default function ProofShareWhatsApp({ proof }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Compartilhar</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
          Enviar por WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail className="w-4 h-4 mr-2 text-blue-600" />
          Enviar por E-mail
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Formatos</DropdownMenuLabel>
        <DropdownMenuItem>
          <FileText className="w-4 h-4 mr-2" />
          Baixar PDF
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileImage className="w-4 h-4 mr-2" />
          Baixar PNG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}