import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ExternalLink, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function MentorSettlementMerchantCard({ merchant }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Building2 className="w-4 h-4 text-violet-600" /> Lojista destinatário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Link to={createPageUrl('AdminIntMerchantProfile') + `?id=${merchant.merchant_id}`} className="inline-flex items-center gap-1 text-base font-bold text-slate-800 hover:text-violet-700">
            {merchant.fantasy_name}
            <ExternalLink className="w-3 h-3" />
          </Link>
          <p className="text-[11px] text-slate-500">{merchant.legal_name}</p>
          <p className="text-[11px] font-mono text-slate-500">{merchant.document}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{merchant.status}</Badge>
          <Badge variant="outline" className="text-[10px]">{merchant.size}</Badge>
          <Badge variant="outline" className="text-[10px]">{merchant.segment}</Badge>
          <Badge className="bg-blue-100 text-blue-700 text-[10px] gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" /> Risco {merchant.risk_score}/100
          </Badge>
        </div>
        {merchant.csm && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 pt-1 border-t">
            <User className="w-3 h-3" />
            <span>CS: <strong>{merchant.csm}</strong></span>
            <a href={`mailto:${merchant.csm_email}`} className="text-violet-600 hover:underline ml-auto">contato</a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}