import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const programInfo = {
  vdmp: { name: 'VDMP', fullName: 'Visa Dispute Monitoring Program', brand: 'Visa' },
  vfmp: { name: 'VFMP', fullName: 'Visa Fraud Monitoring Program', brand: 'Visa' },
  ecm: { name: 'ECM', fullName: 'Excessive Chargeback Merchant', brand: 'Mastercard' },
  efm: { name: 'EFM', fullName: 'Excessive Fraud Merchant', brand: 'Mastercard' }
};

const statusConfig = {
  normal: { label: 'Normal', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  early_warning: { label: 'Alerta Preventivo', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  standard: { label: 'Em Programa', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
  excessive: { label: 'Excessivo', color: 'bg-red-100 text-red-700', icon: XCircle },
  in_program: { label: 'Em Monitoramento', color: 'bg-red-100 text-red-700', icon: AlertTriangle }
};

const trendIcons = {
  up: { icon: TrendingUp, color: 'text-red-500' },
  down: { icon: TrendingDown, color: 'text-green-500' },
  stable: { icon: Minus, color: 'text-gray-500' }
};

function ComplianceCard({ compliance }) {
  const program = programInfo[compliance.program_type] || {};
  const statusCfg = statusConfig[compliance.status] || statusConfig.normal;
  const StatusIcon = statusCfg.icon;
  const trendCfg = trendIcons[compliance.trend] || trendIcons.stable;
  const TrendIcon = trendCfg.icon;

  const isInDanger = ['standard', 'excessive', 'in_program'].includes(compliance.status);

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isInDanger ? "border-red-200 bg-red-50" : "border-gray-200 bg-white"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className={cn(
            "w-5 h-5",
            compliance.card_brand === 'visa' ? 'text-blue-800' : 'text-red-600'
          )} />
          <div>
            <p className="font-semibold text-sm">{program.brand}</p>
            <p className="text-xs text-gray-500">{program.name}</p>
          </div>
        </div>
        <Badge className={statusCfg.color}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusCfg.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Ratio Atual</p>
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-lg font-bold",
              compliance.current_ratio >= compliance.threshold_critical ? "text-red-600" :
              compliance.current_ratio >= compliance.threshold_warning ? "text-yellow-600" : "text-green-600"
            )}>
              {compliance.current_ratio?.toFixed(2)}%
            </span>
            <TrendIcon className={cn("w-4 h-4", trendCfg.color)} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">Limite</p>
          <p className="text-lg font-semibold text-gray-700">
            {compliance.threshold_critical?.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">CBs no Mês</p>
          <p className="font-semibold">{compliance.monthly_chargebacks || 0}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Projeção</p>
          <p className={cn(
            "font-semibold",
            (compliance.projected_ratio || 0) >= compliance.threshold_critical ? "text-red-600" : "text-gray-700"
          )}>
            {compliance.projected_ratio?.toFixed(2) || '-'}%
          </p>
        </div>
      </div>

      {compliance.estimated_fines > 0 && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-xs text-red-600">
            Multas estimadas: <span className="font-semibold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' }).format(compliance.estimated_fines)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function ComplianceOverview({ complianceData = [], showAlerts = true }) {
  const hasIssues = complianceData.some(c => 
    ['early_warning', 'standard', 'excessive', 'in_program'].includes(c.status)
  );

  const criticalItems = complianceData.filter(c => 
    ['standard', 'excessive', 'in_program'].includes(c.status)
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Compliance com Bandeiras</CardTitle>
          {!hasIssues && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Tudo Normal
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showAlerts && criticalItems.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você está em {criticalItems.length} programa(s) de monitoramento. 
              Ação imediata necessária para evitar multas e descredenciamento.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceData.map((compliance, idx) => (
            <ComplianceCard key={idx} compliance={compliance} />
          ))}
        </div>

        {complianceData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhum dado de compliance disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}