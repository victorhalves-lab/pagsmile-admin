import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MapPin, Clock } from 'lucide-react';
import { MOCK_REVEAL_AUDIT } from '@/components/mentor/mocks/supplierCredentialsMock';

export default function SupplierCredentialAuditLog({ events = MOCK_REVEAL_AUDIT }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Eye className="w-4 h-4" />Trilha de revelações ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-3">
          {events.map((e) => (
            <li key={e.id} className="ml-4">
              <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] mt-1.5" />
              <Card>
                <CardContent className="p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-bold">{e.credential_name}</p>
                      <p className="text-[10px] text-slate-500">{new Date(e.timestamp).toLocaleString('pt-BR')}</p>
                    </div>
                    <Badge className="text-[10px] bg-amber-100 text-amber-700 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />{e.duration_seconds}s exposta
                    </Badge>
                  </div>
                  <p className="text-xs italic">"{e.reason}"</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
                    <span><strong>{e.user}</strong></span>
                    <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{e.geo}</span>
                    <span>IP {e.ip_address}</span>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}