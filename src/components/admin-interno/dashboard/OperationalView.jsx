import React, { useState, useEffect } from 'react';
import KPICard from './shared/KPICard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Zap, Clock, Server, AlertTriangle, PlayCircle, PauseCircle,
  CheckCircle2, XCircle, AlertCircle, RefreshCw, Wallet, QrCode, CreditCard
} from 'lucide-react';

const TransactionRow = ({ tx }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${
        tx.status === 'approved' ? 'bg-green-100 text-green-600' :
        tx.status === 'declined' ? 'bg-red-100 text-red-600' :
        'bg-yellow-100 text-yellow-600'
      }`}>
        {tx.method === 'pix' ? <QrCode className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tx.merchant}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          {tx.time} • {tx.method === 'card' && <span className="uppercase">{tx.brand} • </span>}
          <span className="font-mono">{tx.id}</span>
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
        R$ {tx.amount.toFixed(2)}
      </p>
      <Badge variant={
        tx.status === 'approved' ? 'success' :
        tx.status === 'declined' ? 'destructive' :
        'secondary'
      } className="h-5 px-1.5 text-[10px]">
        {tx.status}
      </Badge>
    </div>
  </div>
);

const AlertRow = ({ alert }) => (
  <div className={`p-3 rounded-lg border mb-3 flex items-start gap-3 ${
    alert.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50' :
    alert.severity === 'high' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50' :
    'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50'
  }`}>
    <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
      alert.severity === 'critical' ? 'text-red-600' :
      alert.severity === 'high' ? 'text-orange-600' :
      'text-blue-600'
    }`} />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{alert.title}</h4>
        <span className="text-xs text-slate-500">{alert.time}</span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.description}</p>
      <div className="mt-2 flex gap-2">
        <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 bg-white dark:bg-slate-800">
          Ver detalhes
        </Button>
        <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2">
          Reconhecer
        </Button>
      </div>
    </div>
  </div>
);

export default function OperationalView() {
  const [isLive, setIsLive] = useState(true);
  const [transactions, setTransactions] = useState([
    { id: 'TXN-8392', merchant: 'Mega Loja', amount: 1250.00, status: 'approved', method: 'card', brand: 'visa', time: '10:42:05' },
    { id: 'TXN-8391', merchant: 'E-commerce X', amount: 45.90, status: 'approved', method: 'pix', time: '10:42:02' },
    { id: 'TXN-8390', merchant: 'Serviços LTDA', amount: 3200.00, status: 'declined', method: 'card', brand: 'master', time: '10:41:58' },
    { id: 'TXN-8389', merchant: 'Mega Loja', amount: 89.90, status: 'approved', method: 'card', brand: 'elo', time: '10:41:55' },
    { id: 'TXN-8388', merchant: 'Marketplace B', amount: 150.00, status: 'pending', method: 'pix', time: '10:41:50' },
  ]);

  // Simulate live feed
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newTx = {
        id: `TXN-${Math.floor(Math.random() * 9000) + 1000}`,
        merchant: ['Mega Loja', 'E-commerce X', 'Serviços LTDA', 'Tech Sol', 'Marketplace B'][Math.floor(Math.random() * 5)],
        amount: Math.random() * 1000,
        status: Math.random() > 0.2 ? 'approved' : (Math.random() > 0.5 ? 'declined' : 'pending'),
        method: Math.random() > 0.4 ? 'card' : 'pix',
        brand: ['visa', 'master', 'elo', 'amex'][Math.floor(Math.random() * 4)],
        time: new Date().toLocaleTimeString('pt-BR')
      };
      setTransactions(prev => [newTx, ...prev.slice(0, 19)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const alerts = [
    { title: 'Latência Alta - API Gateway', description: 'Latência p95 acima de 2s nos últimos 5 min.', severity: 'critical', time: '2m atrás' },
    { title: 'Taxa de Recusa Anormal', description: 'Merchant Mega Loja com recusa de 45% (vs média 12%).', severity: 'high', time: '15m atrás' },
    { title: 'Webhooks com Falha', description: '3 endpoints retornando 500.', severity: 'medium', time: '32m atrás' },
  ];

  return (
    <div className="space-y-6">
      {/* Real-time KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="TPV Hoje" value="R$ 1.2M" change={12} changeLabel="vs ontem" icon={Zap} />
        <KPICard title="TPS Atual" value="45.2" change={5} changeLabel="trans/s" icon={Activity} />
        <KPICard title="Aprovação Hoje" value="88.4%" change={-0.5} changeLabel="vs média" icon={CheckCircle2} />
        <KPICard title="Latência Med" value="240ms" change={10} positiveIsBad={true} changeLabel="vs média" icon={Clock} />
        <KPICard title="Pix Pendentes" value="142" change={2} changeLabel="qr codes" icon={QrCode} />
        <KPICard title="Webhooks Err" value="3" change={-1} positiveIsBad={true} changeLabel="falhando" icon={Server} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed */}
        <Card className="lg:col-span-2 h-[600px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                Feed de Transações
                {isLive && <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>}
              </CardTitle>
              <CardDescription>Monitoramento em tempo real</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setIsLive(!isLive)}>
                {isLive ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-6">
              <div className="space-y-1 pb-6">
                {transactions.map((tx, i) => (
                  <TransactionRow key={`${tx.id}-${i}`} tx={tx} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Alerts & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Alertas Ativos
                <Badge variant="destructive" className="ml-auto">3</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.map((alert, i) => (
                <AlertRow key={i} alert={alert} />
              ))}
              <Button variant="ghost" className="w-full mt-2 text-xs">Ver histórico de alertas</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'API Gateway', status: 'operational' },
                { name: 'Processador Cartão', status: 'operational' },
                { name: 'Pix (SPI)', status: 'degraded' },
                { name: 'Antifraude', status: 'operational' },
                { name: 'Database', status: 'operational' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 capitalize">
                      {service.status === 'operational' ? 'Operacional' : 'Degradado'}
                    </span>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Importing Activity here to avoid variable shadowing warning if I imported it at the top
import { Activity } from 'lucide-react';