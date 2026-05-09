import React, { useState } from 'react';
import { Lock, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import SupplierCredentialsKPIBar from '@/components/mentor/projects/credentials/SupplierCredentialsKPIBar';
import SupplierCredentialsTable from '@/components/mentor/projects/credentials/SupplierCredentialsTable';
import SupplierCredentialRevealDialog from '@/components/mentor/projects/credentials/SupplierCredentialRevealDialog';
import SupplierCredentialCreateDrawer from '@/components/mentor/projects/credentials/SupplierCredentialCreateDrawer';
import SupplierCredentialRevokeDialog from '@/components/mentor/projects/credentials/SupplierCredentialRevokeDialog';
import SupplierCredentialAuditLog from '@/components/mentor/projects/credentials/SupplierCredentialAuditLog';
import SupplierCredentialRotationSuggestions from '@/components/mentor/projects/credentials/SupplierCredentialRotationSuggestions';
import { MOCK_SUPPLIER_CREDENTIALS } from '@/components/mentor/mocks/supplierCredentialsMock';
import { toast } from 'sonner';

export default function AdminIntSupplierCredentials() {
  const [credentials] = useState(MOCK_SUPPLIER_CREDENTIALS);
  const [revealCred, setRevealCred] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeCred, setRevokeCred] = useState(null);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Cofre de Credenciais"
        subtitle="Vault corporativo de credenciais de fornecedores · criptografia AES-256 · revelação sob OTP + auditoria"
        icon={Lock}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Cofre de Credenciais', page: 'AdminIntSupplierCredentials' }]}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Nova credencial
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20 border-amber-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <strong>Compliance SOC 2 + ISO 27001.</strong> Todas credenciais são armazenadas com criptografia AES-256 em repouso e TLS 1.3 em trânsito.
            Revelação requer OTP + razão documentada. Cada acesso gera trilha auditável imutável visível pelo time de Segurança.
            Renovações automáticas notificadas em D-90/60/30/7. Credenciais sem uso há 60+ dias são candidatas a revogação automática.
          </div>
        </CardContent>
      </Card>

      <SupplierCredentialsKPIBar credentials={credentials} />

      <SupplierCredentialRotationSuggestions
        credentials={credentials}
        onRotate={(c) => toast.info(`Iniciando rotação de "${c.name}" · novo valor será gerado e antigo expirará em 7 dias`)}
      />

      <SupplierCredentialsTable
        credentials={credentials}
        onReveal={setRevealCred}
        onRenew={(c) => toast.info(`Drawer de renovação aberto para "${c.name}"`)}
        onRevoke={setRevokeCred}
        onViewHistory={(c) => toast.info(`Histórico de uso de "${c.name}" · ${c.usage_count_30d.toLocaleString('pt-BR')} chamadas em 30d`)}
      />

      <SupplierCredentialAuditLog />

      <SupplierCredentialRevealDialog
        open={!!revealCred}
        onOpenChange={(o) => !o && setRevealCred(null)}
        credential={revealCred}
      />

      <SupplierCredentialCreateDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => {}}
      />

      <SupplierCredentialRevokeDialog
        open={!!revokeCred}
        onOpenChange={(o) => !o && setRevokeCred(null)}
        credential={revokeCred}
        onConfirmed={() => {}}
      />
    </div>
  );
}