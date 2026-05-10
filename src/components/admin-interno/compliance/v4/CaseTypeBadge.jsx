import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Store } from 'lucide-react';

export default function CaseTypeBadge({ tipo }) {
  if (tipo === 'merchant') {
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0 gap-1">
        <Store className="w-3 h-3" /> Merchant
      </Badge>
    );
  }
  if (tipo === 'subseller_pj') {
    return (
      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 gap-1">
        <Building2 className="w-3 h-3" /> Subseller PJ
      </Badge>
    );
  }
  if (tipo === 'subseller_pf') {
    return (
      <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-0 gap-1">
        <User className="w-3 h-3" /> Subseller PF
      </Badge>
    );
  }
  return null;
}