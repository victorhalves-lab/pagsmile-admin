import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MOCK_SPREAD_MDR_EVOLUTION } from '@/components/mentor/mocks/spreadMdrMock';

export default function SpreadMDREvolutionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />Evolução do spread MDR (18 meses) — crédito à vista e-commerce
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={MOCK_SPREAD_MDR_EVOLUTION}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `${v.toFixed(2)}%`} tick={{ fontSize: 10 }} domain={['dataMin - 0.1', 'dataMax + 0.1']} />
              <Tooltip formatter={(v) => `${v.toFixed(3)}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="visa_credit_ec" name="Visa" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mastercard_credit_ec" name="Mastercard" stroke="#ea580c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="elo_credit_ec" name="Elo" stroke="#eab308" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="benchmark_market" name="Benchmark mercado" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-500 italic mt-2">
          Linha tracejada cinza representa benchmark de mercado consolidado (média ponderada Cielo/Rede/Stone).
        </p>
      </CardContent>
    </Card>
  );
}