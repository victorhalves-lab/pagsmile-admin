import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Share2, Globe, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ShowcaseHero({ showcase, onEdit, onShare, onView }) {
  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div className="relative h-40 bg-gradient-to-br from-[#2bc196] via-emerald-500 to-teal-600">
        {showcase?.banner_url && (
          <img src={showcase.banner_url} alt="banner" className="w-full h-full object-cover" />
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="sm" variant="secondary" onClick={onView} className="bg-white/90 hover:bg-white">
            <Eye className="w-3.5 h-3.5 mr-1" /> Ver vitrine
          </Button>
          <Button size="sm" variant="secondary" onClick={onShare} className="bg-white/90 hover:bg-white">
            <Share2 className="w-3.5 h-3.5 mr-1" /> Compartilhar
          </Button>
        </div>
      </div>

      <div className="p-4 flex items-center gap-4 -mt-12 relative">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {showcase?.logo_url ? (
            <img src={showcase.logo_url} alt={showcase.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-2xl font-bold text-slate-500">
              {showcase?.name?.[0] || '?'}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 mt-12">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold truncate">{showcase?.name || 'Minha vitrine'}</h2>
            <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Ativa</Badge>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {showcase?.description || 'Configure sua vitrine pública'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <Globe className="w-3 h-3" />
            <span className="font-mono truncate">{showcase?.url || 'pag.sm/sua-loja'}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-12">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Settings className="w-3.5 h-3.5 mr-1" /> Personalizar
          </Button>
          <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={onEdit}>
            <Edit className="w-3.5 h-3.5 mr-1" /> Editar
          </Button>
        </div>
      </div>
    </Card>
  );
}