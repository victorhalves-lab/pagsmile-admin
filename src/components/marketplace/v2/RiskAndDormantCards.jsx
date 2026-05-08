import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { AlertTriangle, Clock, ShieldAlert, Building2, ChevronRight, Mail } from 'lucide-react';

export default function RiskAndDormantCards({ subaccounts = [] }) {
  const atRisk = subaccounts.filter(s => 
    s.risk_level === 'high' || s.status === 'suspended' || s.status === 'blocked'
  );

  const dormant = subaccounts.filter(s => 
    s.status === 'active' && (s.total_transactions || 0) === 0
  );

  const noKyc = subaccounts.filter(s =>
    s.status === 'active' && s.compliance_status !== 'compliant'
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Sub-merchants em risco */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              Subcontas em Risco
            </CardTitle>
            <Badge variant="destructive">{atRisk.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {atRisk.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">Nenhuma subconta em risco</p>
          ) : (
            <>
              <div className="space-y-2 mb-3">
                {atRisk.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 bg-red-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{s.business_name}</p>
                        <p className="text-[10px] text-red-600">
                          {s.status === 'suspended' ? 'Suspensa' : 
                           s.status === 'blocked' ? 'Bloqueada' : 'Risco Alto'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full text-red-700 border-red-200 hover:bg-red-100" asChild>
                <Link to={createPageUrl('SubaccountsList')}>
                  Ver todas ({atRisk.length})
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sub-merchants dormentes */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
              <Clock className="w-4 h-4" />
              Subcontas Dormentes
            </CardTitle>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">{dormant.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {dormant.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">Todas as subcontas ativas estão transacionando</p>
          ) : (
            <>
              <p className="text-[10px] text-amber-700 mb-2">
                Ativas mas sem transação no último período
              </p>
              <div className="space-y-2 mb-3">
                {dormant.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 bg-amber-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{s.business_name}</p>
                        <p className="text-[10px] text-amber-600">Sem TX recente</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full text-amber-700 border-amber-200 hover:bg-amber-100">
                <Mail className="w-3 h-3 mr-1" />
                Re-engajar ({dormant.length})
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sem KYC válido */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <ShieldAlert className="w-4 h-4" />
              KYC Pendente / Vencido
            </CardTitle>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">{noKyc.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {noKyc.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">Todas as subcontas com KYC válido</p>
          ) : (
            <>
              <p className="text-[10px] text-orange-700 mb-2 font-semibold">
                ⚠️ Ação regulatória requerida
              </p>
              <div className="space-y-2 mb-3">
                {noKyc.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 bg-orange-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{s.business_name}</p>
                        <p className="text-[10px] text-orange-600">
                          {s.compliance_status === 'pending_docs' ? 'Docs pendentes' :
                           s.compliance_status === 'under_review' ? 'Em revisão' : 'Não conforme'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full text-orange-700 border-orange-200 hover:bg-orange-100">
                Solicitar Documentos ({noKyc.length})
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}