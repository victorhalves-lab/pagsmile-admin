import React from 'react';
import { Button } from '@/components/ui/button';
import SideDrawer from '@/components/common/SideDrawer';
import { Loader2 } from 'lucide-react';

/**
 * EntityFormDrawer — Drawer genérico para criação/edição de entidades.
 *
 * Props:
 *  - open, onOpenChange (controle do drawer)
 *  - title, description, icon
 *  - size: 'sm' | 'md' | 'lg' | 'xl'
 *  - onSubmit: () => void | Promise<void>  — chamado ao clicar em "Salvar"
 *  - submitLabel (default: "Salvar")
 *  - cancelLabel (default: "Cancelar")
 *  - submitDisabled (boolean)
 *  - submitting (boolean) — mostra spinner
 *  - submitVariant: 'default' | 'destructive' (default 'default')
 *  - hideFooter (boolean) — útil quando o body já tem CTA próprio
 *  - children (form fields)
 */
export default function EntityFormDrawer({
  open,
  onOpenChange,
  title,
  description,
  icon,
  size = 'md',
  onSubmit,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  submitDisabled = false,
  submitting = false,
  submitVariant = 'default',
  hideFooter = false,
  children,
}) {
  const handleSubmit = async () => {
    if (submitting || submitDisabled) return;
    if (onSubmit) await onSubmit();
  };

  const footer = hideFooter ? null : (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
        {cancelLabel}
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={submitDisabled || submitting}
        variant={submitVariant === 'destructive' ? 'destructive' : 'default'}
      >
        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      size={size}
      footer={footer}
    >
      {children}
    </SideDrawer>
  );
}