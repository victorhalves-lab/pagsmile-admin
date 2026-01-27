import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisputeTrendChart({ 
  data = [], 
  thresholdWarning = 0.65,
  thresholdCritical = 0.9,
  title = "Tendência de Ratio",
  dataKeys = [
    { key: 'visaRatio', name: 'Visa', color: '#1a1f71' },
    { key: 'mastercardRatio', name: 'Mastercard', color: '#eb001b' }
  ]
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}%`, '']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              
              {/* Threshold lines */}
              <ReferenceLine 
                y={thresholdWarning} 
                stroke="#eab308" 
                strokeDasharray="5 5"
                label={{ value: 'Alerta', position: 'right', fontSize: 10, fill: '#eab308' }}
              />
              <ReferenceLine 
                y={thresholdCritical} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: 'Crítico', position: 'right', fontSize: 10, fill: '#ef4444' }}
              />
              
              {/* Data lines */}
              {dataKeys.map((dk) => (
                <Line
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  name={dk.name}
                  stroke={dk.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-yellow-500" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-gray-600">Limite Alerta ({thresholdWarning}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-gray-600">Limite Crítico ({thresholdCritical}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}