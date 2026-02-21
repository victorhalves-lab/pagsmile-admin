import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function TabSocios({ subaccount }) {
  const partners = subaccount.partners || [];

  if (partners.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Nenhum sócio cadastrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {partners.map((p, i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{p.name || `Sócio ${i + 1}`}</p>
                <p className="text-xs text-gray-500">{p.cpf || p.document || '-'}</p>
                {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <Badge variant="outline" className="font-bold">{p.ownership_percentage || 0}%</Badge>
              {p.is_legal_representative && <Badge className="bg-blue-100 text-blue-700 text-[10px]">Representante Legal</Badge>}
              {p.is_pep && <Badge className="bg-orange-100 text-orange-700 text-[10px]">PEP</Badge>}
            </div>
          </div>
          {(p.birth_date || p.nationality || p.phone) && (
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-3 gap-4 text-xs">
              {p.birth_date && <div><span className="text-gray-400">Nascimento</span><p className="font-medium">{p.birth_date}</p></div>}
              {p.nationality && <div><span className="text-gray-400">Nacionalidade</span><p className="font-medium">{p.nationality}</p></div>}
              {p.phone && <div><span className="text-gray-400">Telefone</span><p className="font-medium">{p.phone}</p></div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}