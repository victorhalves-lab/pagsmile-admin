import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Input com auto-fill visual: ao digitar e ter o tamanho mínimo, simula consulta
 * a uma API externa (CNPJ via ReceitaWS, CEP via ViaCEP) e mostra feedback visual.
 * 
 * Props:
 * - label: rótulo
 * - value: valor controlado
 * - onChange: callback (value) => void
 * - placeholder: placeholder
 * - minLength: tamanho mínimo para disparar lookup
 * - onLookup: callback async (value) => Promise<{ ...autoFillData }>
 * - onAutoFill: callback (autoFillData) => void
 * - required: bool
 */
export default function AutoFillField({
  label,
  value,
  onChange,
  placeholder,
  minLength = 14,
  onLookup,
  onAutoFill,
  required,
  helpText,
  ...rest
}) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const newVal = e.target.value;
    onChange(newVal);
    setStatus('idle');
    setErrorMsg('');
  };

  const handleBlur = async () => {
    const cleanValue = value?.replace(/\D/g, '');
    if (!cleanValue || cleanValue.length < minLength || !onLookup) return;
    
    setStatus('loading');
    try {
      const result = await onLookup(cleanValue);
      if (result) {
        setStatus('success');
        onAutoFill?.(result);
      } else {
        setStatus('error');
        setErrorMsg('Não encontrado');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Erro na consulta');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label} {required && '*'}</Label>
        {status === 'success' && (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Auto-preenchido
          </Badge>
        )}
      </div>
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "pr-9",
            status === 'success' && "border-emerald-400 focus-visible:ring-emerald-300",
            status === 'error' && "border-red-400 focus-visible:ring-red-300"
          )}
          {...rest}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === 'loading' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
        </div>
      </div>
      {status === 'error' && errorMsg && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}
      {helpText && status !== 'error' && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}