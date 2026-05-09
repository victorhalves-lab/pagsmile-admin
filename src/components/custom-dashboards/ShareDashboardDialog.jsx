import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Lock, Mail, Copy, Plus, X, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareDashboardDialog({ open, onOpenChange, dashboard }) {
  const [isPublic, setIsPublic] = useState(false);
  const [expiry, setExpiry] = useState('7d');
  const [emails, setEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState('view');

  const publicUrl = `https://app.pagsmile.com/public/dash/${dashboard?.id || 'preview'}?token=eyJhb...`;

  const addEmail = () => {
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput('');
    }
  };

  const removeEmail = (e) => setEmails(emails.filter(x => x !== e));

  const handleSave = () => {
    toast.success(`Dashboard compartilhado${emails.length > 0 ? ` com ${emails.length} pessoa(s)` : ''}`);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartilhar dashboard</DialogTitle>
          <DialogDescription>Defina permissões e gere link público</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Public link toggle */}
          <div className="flex items-start justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-white dark:bg-slate-700 rounded">
                {isPublic ? <Globe className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <p className="text-sm font-bold">{isPublic ? 'Link público ativo' : 'Apenas convidados'}</p>
                <p className="text-[10px] text-slate-500">{isPublic ? 'Qualquer um com o link pode visualizar' : 'Somente pessoas convidadas podem acessar'}</p>
              </div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {isPublic && (
            <>
              <div>
                <Label className="text-[10px] uppercase font-bold">Expiração do link</Label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d" className="text-xs">24 horas</SelectItem>
                    <SelectItem value="7d" className="text-xs">7 dias</SelectItem>
                    <SelectItem value="30d" className="text-xs">30 dias</SelectItem>
                    <SelectItem value="never" className="text-xs">Sem expiração</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] uppercase font-bold">Link público</Label>
                <div className="flex gap-2">
                  <Input value={publicUrl} readOnly className="h-9 text-xs font-mono" />
                  <Button size="sm" variant="outline" className="h-9" onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Link copiado!'); }}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Email invites */}
          <div>
            <Label className="text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Users className="w-3 h-3" /> Convidar por email
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="email@empresa.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                className="h-9 text-xs"
              />
              <Select value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="view" className="text-xs">Visualizar</SelectItem>
                  <SelectItem value="edit" className="text-xs">Editar</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={addEmail} className="h-9">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {emails.map(e => (
                  <Badge key={e} variant="outline" className="gap-1 pr-1">
                    <Mail className="w-3 h-3" />
                    {e}
                    <button onClick={() => removeEmail(e)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancelar</Button>
          <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={handleSave}>
            Salvar e enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}