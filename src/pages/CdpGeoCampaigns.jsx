import React, { useState } from 'react';
import { MapPin, Plus, Target, Users, Radio } from 'lucide-react';

const geoCampaigns = [
  { id: 'g1', name: 'Pop-up Shopping SP', region: 'São Paulo · raio 5km', radius_km: 5, target: 12400, sent: 8200, conv: 410, status: 'ativa' },
  { id: 'g2', name: 'Praia Promo - RJ Litoral', region: 'Rio de Janeiro · litoral', radius_km: 15, target: 8900, sent: 5400, conv: 280, status: 'ativa' },
  { id: 'g3', name: 'Campus Universitário', region: 'Campinas · UNICAMP', radius_km: 3, target: 4200, sent: 0, conv: 0, status: 'programada' },
];

const hotspots = [
  { city: 'São Paulo', clients: 18400, intensity: 100 },
  { city: 'Rio de Janeiro', clients: 11200, intensity: 61 },
  { city: 'Belo Horizonte', clients: 6400, intensity: 35 },
  { city: 'Curitiba', clients: 4800, intensity: 26 },
  { city: 'Porto Alegre', clients: 3900, intensity: 21 },
  { city: 'Recife', clients: 3100, intensity: 17 },
];

const statusStyle = {
  ativa: 'bg-mint-100 text-mint-700 border-mint-200',
  programada: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function CdpGeoCampaigns() {
  const [selected, setSelected] = useState(geoCampaigns[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campanhas por Geolocalização</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Disparo de campanhas baseado na localização do cliente</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-500 hover:bg-mint-600 text-white text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Nova campanha geo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Heatmap mock */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-mint-500" /> Mapa de calor de clientes
          </h3>
          <div className="space-y-2.5">
            {hotspots.map((h) => (
              <div key={h.city}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400" /> {h.city}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{h.clients.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-mint-400 via-mint-500 to-mint-600" style={{ width: `${h.intensity}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campaign detail */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-mint-500" /> Campanha selecionada
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-mint-50 text-mint-600 flex items-center justify-center"><Target className="w-5 h-5" /></div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{selected.name}</p>
              <p className="text-xs text-slate-500">{selected.region}</p>
            </div>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[selected.status]}`}>{selected.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
              <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-[10px] text-slate-500">Alcança</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{selected.target.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-[10px] text-slate-500">Enviados</p>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{selected.sent.toLocaleString('pt-BR')}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
              <p className="text-[10px] text-slate-500">Conv.</p>
              <p className="font-mono font-bold text-mint-600 text-sm">{selected.conv.toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500 uppercase mt-4 mb-2">Outras campanhas</p>
          <div className="space-y-1.5">
            {geoCampaigns.filter((c) => c.id !== selected.id).map((c) => (
              <button key={c.id} onClick={() => setSelected(c)} className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{c.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle[c.status]}`}>{c.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}