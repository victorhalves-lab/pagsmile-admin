import React, { useState, useMemo } from 'react';
import { Users as UsersIcon, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import UsersKPIBar from '@/components/mentor/users/UsersKPIBar';
import UsersFilters from '@/components/mentor/users/UsersFilters';
import UsersTable from '@/components/mentor/users/UsersTable';
import UsersBulkBar from '@/components/mentor/users/UsersBulkBar';
import UserCreateEditDrawer from '@/components/mentor/users/UserCreateEditDrawer';
import UserSuspendDialog from '@/components/mentor/users/UserSuspendDialog';
import UserResetActionDialog from '@/components/mentor/users/UserResetActionDialog';
import { MOCK_USERS } from '@/components/mentor/mocks/usersMock';
import { toast } from 'sonner';

export default function AdminIntUsersHub() {
  const [users] = useState(MOCK_USERS);
  const [selected, setSelected] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [suspendUser, setSuspendUser] = useState(null);
  const [resetAction, setResetAction] = useState({ user: null, action: null });

  const [filters, setFilters] = useState({
    search: '', status: 'all', role: 'all', department: 'all', mfa: 'all', dormant: 'all',
  });

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!u.name.toLowerCase().includes(s) && !u.email.toLowerCase().includes(s)) return false;
      }
      if (filters.status !== 'all' && u.status !== filters.status) return false;
      if (filters.role !== 'all' && u.role !== filters.role) return false;
      if (filters.department !== 'all' && u.department !== filters.department) return false;
      if (filters.mfa === 'enabled' && !u.mfa_enabled) return false;
      if (filters.mfa === 'disabled' && u.mfa_enabled) return false;
      if (filters.dormant !== 'all') {
        if (filters.dormant === 'never' && u.last_login) return false;
        const days = u.last_login ? (Date.now() - new Date(u.last_login).getTime()) / 86400000 : Infinity;
        if (filters.dormant === 'recent' && days > 7) return false;
        if (filters.dormant === 'dormant' && days <= 30) return false;
      }
      return true;
    });
  }, [users, filters]);

  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((u) => u.id));

  const handleBulkAction = (action) => {
    toast.success(`Ação "${action}" aplicada em ${selected.length} usuário(s) · auditoria registrada`);
    setSelected([]);
  };

  return (
    <div className="space-y-4 pb-12">
      <PageHeader
        title="Hub de Usuários"
        subtitle="Gerenciamento RBAC · 9 perfis · permissões granulares · trilha auditável imutável"
        icon={UsersIcon}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Usuários', page: 'AdminIntUsersHub' },
        ]}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />Convidar usuário
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-900 dark:text-violet-200">
            <strong>Modelo RBAC + ABAC.</strong> 9 perfis pré-definidos cobrem 95% dos casos · permissões customizadas para exceções · MFA obrigatório para perfis críticos.
            Toda alteração de perfil/permissão gera trilha auditável (SOC 2 CC6.3). Bloqueios automáticos após 5 tentativas falhas. Detecção de contas dormentes (30+ dias) e usuários sem MFA.
          </div>
        </CardContent>
      </Card>

      <UsersKPIBar users={users} />
      <UsersFilters filters={filters} onChange={setFilters} />
      <UsersBulkBar count={selected.length} onAction={handleBulkAction} onClear={() => setSelected([])} />
      <UsersTable
        users={filtered}
        selected={selected}
        onToggleSelect={toggleSelect}
        onToggleAll={toggleAll}
        onView={(u) => toast.info(`Drawer de detalhes de ${u.name}`)}
        onEdit={(u) => setEditUser(u)}
        onResetPwd={(u) => setResetAction({ user: u, action: 'reset_password' })}
        onResetMfa={(u) => setResetAction({ user: u, action: 'reset_mfa' })}
        onSuspend={(u) => setSuspendUser(u)}
        onUnlock={(u) => setResetAction({ user: u, action: 'unlock' })}
      />

      <UserCreateEditDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => {}}
      />
      <UserCreateEditDrawer
        open={!!editUser}
        onOpenChange={(o) => !o && setEditUser(null)}
        user={editUser}
        onSaved={() => {}}
      />
      <UserSuspendDialog
        open={!!suspendUser}
        onOpenChange={(o) => !o && setSuspendUser(null)}
        user={suspendUser}
      />
      <UserResetActionDialog
        open={!!resetAction.action}
        onOpenChange={(o) => !o && setResetAction({ user: null, action: null })}
        user={resetAction.user}
        action={resetAction.action}
      />
    </div>
  );
}