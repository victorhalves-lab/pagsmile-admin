import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, ChevronDown, Check, Building2, CreditCard, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function MCCCNAESelector({ 
  formData, 
  handleChange,
  cnaeField = 'cnae_declared',
  mccField = 'mcc_declared',
  required = true 
}) {
  const [cnaeSearch, setCnaeSearch] = useState('');
  const [mccSearch, setMccSearch] = useState('');
  const [cnaeOpen, setCnaeOpen] = useState(false);
  const [mccOpen, setMccOpen] = useState(false);

  // Fetch MCC table
  const { data: mccList = [], isLoading } = useQuery({
    queryKey: ['mcc-list'],
    queryFn: () => base44.entities.MCC.list('-cnae', 1000),
    staleTime: 1000 * 60 * 30, // 30 min cache
  });

  // Group MCCs by CNAE for easier lookup
  const cnaeOptions = useMemo(() => {
    const uniqueCnaes = new Map();
    mccList.forEach(item => {
      if (item.cnae && !uniqueCnaes.has(item.cnae)) {
        uniqueCnaes.set(item.cnae, {
          cnae: item.cnae,
          denominacao: item.denominacao_cnae || '',
          secao: item.secao || ''
        });
      }
    });
    return Array.from(uniqueCnaes.values());
  }, [mccList]);

  // Filter CNAEs based on search
  const filteredCnaes = useMemo(() => {
    if (!cnaeSearch) return cnaeOptions.slice(0, 50);
    const search = cnaeSearch.toLowerCase();
    return cnaeOptions.filter(c => 
      c.cnae.toLowerCase().includes(search) ||
      c.denominacao.toLowerCase().includes(search)
    ).slice(0, 50);
  }, [cnaeOptions, cnaeSearch]);

  // Get MCCs for selected CNAE or all if no CNAE selected
  const mccOptions = useMemo(() => {
    const selectedCnae = formData[cnaeField];
    if (selectedCnae) {
      return mccList.filter(m => m.cnae === selectedCnae);
    }
    // Return unique MCCs
    const uniqueMccs = new Map();
    mccList.forEach(item => {
      if (item.mcc_code && !uniqueMccs.has(item.mcc_code)) {
        uniqueMccs.set(item.mcc_code, item);
      }
    });
    return Array.from(uniqueMccs.values());
  }, [mccList, formData[cnaeField]]);

  // Filter MCCs based on search
  const filteredMccs = useMemo(() => {
    if (!mccSearch) return mccOptions.slice(0, 50);
    const search = mccSearch.toLowerCase();
    return mccOptions.filter(m => 
      m.mcc_code?.toLowerCase().includes(search) ||
      m.nome_mcc?.toLowerCase().includes(search) ||
      m.nome_mcc_description?.toLowerCase().includes(search)
    ).slice(0, 50);
  }, [mccOptions, mccSearch]);

  // Get display values
  const selectedCnae = cnaeOptions.find(c => c.cnae === formData[cnaeField]);
  const selectedMcc = mccList.find(m => m.mcc_code === formData[mccField]);

  // Auto-suggest MCC when CNAE changes
  useEffect(() => {
    if (formData[cnaeField] && !formData[mccField]) {
      const suggestedMcc = mccList.find(m => m.cnae === formData[cnaeField]);
      if (suggestedMcc) {
        handleChange(mccField, suggestedMcc.mcc_code);
      }
    }
  }, [formData[cnaeField]]);

  return (
    <div className="space-y-4">
      {/* CNAE Selector */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          CNAE da Empresa {required && '*'}
        </Label>
        <Popover open={cnaeOpen} onOpenChange={setCnaeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={cnaeOpen}
              className={cn(
                "w-full justify-between h-10 font-normal",
                !formData[cnaeField] && "text-muted-foreground"
              )}
            >
              {selectedCnae ? (
                <span className="flex items-center gap-2 truncate">
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedCnae.cnae}
                  </Badge>
                  <span className="truncate text-sm">{selectedCnae.denominacao}</span>
                </span>
              ) : (
                <span>Selecione o CNAE...</span>
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por código ou descrição..."
                  value={cnaeSearch}
                  onChange={(e) => setCnaeSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            <ScrollArea className="h-[250px]">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-slate-500">Carregando...</div>
              ) : filteredCnaes.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">Nenhum CNAE encontrado</div>
              ) : (
                <div className="p-1">
                  {filteredCnaes.map((cnae) => (
                    <button
                      key={cnae.cnae}
                      onClick={() => {
                        handleChange(cnaeField, cnae.cnae);
                        // Reset MCC when CNAE changes
                        handleChange(mccField, '');
                        setCnaeOpen(false);
                        setCnaeSearch('');
                      }}
                      className={cn(
                        "w-full flex items-start gap-2 p-2 rounded-md text-left hover:bg-slate-100 transition-colors",
                        formData[cnaeField] === cnae.cnae && "bg-primary/5"
                      )}
                    >
                      {formData[cnaeField] === cnae.cnae && (
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      )}
                      <div className={cn("flex-1", formData[cnaeField] !== cnae.cnae && "ml-6")}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {cnae.cnae}
                          </Badge>
                          {cnae.secao && (
                            <span className="text-[10px] text-slate-400">{cnae.secao}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mt-0.5 line-clamp-2">{cnae.denominacao}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <p className="text-[11px] text-slate-500">
          Código Nacional de Atividade Econômica principal da empresa
        </p>
      </div>

      {/* MCC Selector */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          MCC (Merchant Category Code) {required && '*'}
        </Label>
        <Popover open={mccOpen} onOpenChange={setMccOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={mccOpen}
              className={cn(
                "w-full justify-between h-10 font-normal",
                !formData[mccField] && "text-muted-foreground"
              )}
            >
              {selectedMcc ? (
                <span className="flex items-center gap-2 truncate">
                  <Badge className="bg-primary/10 text-primary border-0 font-mono text-xs">
                    {selectedMcc.mcc_code}
                  </Badge>
                  <span className="truncate text-sm">{selectedMcc.nome_mcc}</span>
                </span>
              ) : (
                <span>Selecione o MCC...</span>
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por código ou nome..."
                  value={mccSearch}
                  onChange={(e) => setMccSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            {formData[cnaeField] && (
              <div className="px-3 py-2 bg-blue-50 border-b flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-blue-700">
                  Exibindo MCCs relacionados ao CNAE selecionado
                </span>
              </div>
            )}
            <ScrollArea className="h-[250px]">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-slate-500">Carregando...</div>
              ) : filteredMccs.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">Nenhum MCC encontrado</div>
              ) : (
                <div className="p-1">
                  {filteredMccs.map((mcc, idx) => (
                    <button
                      key={`${mcc.mcc_code}-${idx}`}
                      onClick={() => {
                        handleChange(mccField, mcc.mcc_code);
                        setMccOpen(false);
                        setMccSearch('');
                      }}
                      className={cn(
                        "w-full flex items-start gap-2 p-2 rounded-md text-left hover:bg-slate-100 transition-colors",
                        formData[mccField] === mcc.mcc_code && "bg-primary/5"
                      )}
                    >
                      {formData[mccField] === mcc.mcc_code && (
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      )}
                      <div className={cn("flex-1", formData[mccField] !== mcc.mcc_code && "ml-6")}>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary/10 text-primary border-0 font-mono text-xs">
                            {mcc.mcc_code}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 mt-0.5">{mcc.nome_mcc}</p>
                        {mcc.nome_mcc_description && (
                          <p className="text-xs text-slate-500 mt-0.5">{mcc.nome_mcc_description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <p className="text-[11px] text-slate-500">
          Código que identifica o tipo de negócio para processamento de cartões
        </p>
      </div>
    </div>
  );
}