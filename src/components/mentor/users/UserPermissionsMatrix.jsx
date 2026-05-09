import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { PERMISSION_CATEGORIES } from '@/components/mentor/mocks/usersMock';

export default function UserPermissionsMatrix({ selected = [], onChange, readOnly = false }) {
  const toggle = (id) => {
    if (readOnly) return;
    onChange?.(selected.includes(id) ? selected.filter((p) => p !== id) : [...selected, id]);
  };

  const totalCritical = Object.values(PERMISSION_CATEGORIES).flatMap((c) => c.permissions).filter((p) => p.critical && selected.includes(p.id)).length;
  const totalSelected = selected.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-100 text-violet-700">{totalSelected} permissões</Badge>
          {totalCritical > 0 && (
            <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />{totalCritical} críticas
            </Badge>
          )}
        </div>
      </div>
      {Object.entries(PERMISSION_CATEGORIES).map(([catKey, cat]) => {
        const catSelected = cat.permissions.filter((p) => selected.includes(p.id)).length;
        return (
          <Card key={catKey}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />{cat.label}
                </p>
                <Badge variant="outline" className="text-[10px]">{catSelected}/{cat.permissions.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {cat.permissions.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-start gap-2 p-1.5 rounded text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${selected.includes(p.id) && p.critical ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                  >
                    <Checkbox
                      checked={selected.includes(p.id)}
                      onCheckedChange={() => toggle(p.id)}
                      disabled={readOnly}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span>{p.label}</span>
                      {p.critical && (
                        <Badge className="ml-1 text-[8px] bg-red-100 text-red-700 px-1 py-0">CRÍTICA</Badge>
                      )}
                      <p className="text-[9px] text-slate-500 font-mono">{p.id}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}