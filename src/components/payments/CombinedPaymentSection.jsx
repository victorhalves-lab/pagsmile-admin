import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, CreditCard, QrCode, Sparkles, TrendingUp, Eye } from 'lucide-react';

/**
 * Bloco compartilhado de "Pagamento Combinado" para Payment Links e Checkouts.
 * Recebe um objeto `value` (combinedPayment config) e um callback `onChange`.
 *
 * Estrutura do value:
 * {
 *   enabled: boolean,
 *   combos: { card_pix: bool, two_cards: bool, two_cards_pix: bool },
 *   min_ticket: number,
 *   max_methods: 2 | 3 | 4
 * }
 */

const COMBOS = [
  {
    id: 'card_pix',
    label: 'Cartão + PIX',
    description: 'Cliente paga parte no cartão e o restante via PIX',
    lift: '+18%',
    icons: [CreditCard, QrCode],
    colors: ['text-blue-600 bg-blue-50', 'text-emerald-600 bg-emerald-50'],
    recommended: true
  },
  {
    id: 'two_cards',
    label: '2 Cartões',
    description: 'Distribui o valor entre 2 cartões diferentes',
    lift: '+24%',
    icons: [CreditCard, CreditCard],
    colors: ['text-blue-600 bg-blue-50', 'text-violet-600 bg-violet-50']
  },
  {
    id: 'two_cards_pix',
    label: '2 Cartões + PIX',
    description: 'Para tickets altos — divide entre 3 fontes',
    lift: '+31%',
    icons: [CreditCard, CreditCard, QrCode],
    colors: ['text-blue-600 bg-blue-50', 'text-violet-600 bg-violet-50', 'text-emerald-600 bg-emerald-50']
  }
];

const defaultValue = {
  enabled: false,
  combos: { card_pix: false, two_cards: false, two_cards_pix: false },
  min_ticket: 500,
  max_methods: 2
};

export default function CombinedPaymentSection({ value, onChange }) {
  const config = { ...defaultValue, ...(value || {}), combos: { ...defaultValue.combos, ...((value || {}).combos || {}) } };

  const update = (patch) => onChange({ ...config, ...patch });
  const toggleCombo = (id) => update({ combos: { ...config.combos, [id]: !config.combos[id] } });

  const activeCombos = Object.values(config.combos).filter(Boolean).length;

  return (
    <Card className="border-l-4 border-l-violet-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Pagamento Combinado
                <Badge className="bg-violet-100 text-violet-700 text-[10px]">NOVO</Badge>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Cliente divide o pagamento entre 2+ métodos · Aumenta conversão de tickets altos</p>
            </div>
          </div>
          <Switch checked={config.enabled} onCheckedChange={(v) => update({ enabled: v })} />
        </div>
      </CardHeader>

      {config.enabled && (
        <CardContent className="space-y-4">
          {/* Banner de impacto */}
          <div className="bg-gradient-to-r from-violet-50 to-emerald-50 border border-violet-200 rounded-lg p-3 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-700">
              <strong className="text-slate-900">Lojistas que ativam pagamento combinado em links de R$ 500+ tiveram, em média, +22% de conversão.</strong> O cliente pode finalizar a compra mesmo quando um cartão não tem limite suficiente.
            </div>
          </div>

          {/* Combos */}
          <div>
            <Label className="text-xs text-slate-500 mb-2 block">Combinações Permitidas</Label>
            <div className="space-y-2">
              {COMBOS.map((combo) => {
                const enabled = config.combos[combo.id];
                return (
                  <div
                    key={combo.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer ${
                      enabled ? 'border-violet-300 bg-violet-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => toggleCombo(combo.id)}
                  >
                    <div className="flex -space-x-1.5">
                      {combo.icons.map((Icon, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${combo.colors[i]}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{combo.label}</span>
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">
                          <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                          {combo.lift} conversão
                        </Badge>
                        {combo.recommended && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Recomendado</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{combo.description}</p>
                    </div>
                    <Switch checked={enabled} onCheckedChange={() => toggleCombo(combo.id)} onClick={(e) => e.stopPropagation()} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label className="text-xs text-slate-500">Ticket mínimo (R$)</Label>
              <Input
                type="number"
                value={config.min_ticket}
                onChange={(e) => update({ min_ticket: parseFloat(e.target.value) || 0 })}
                className="mt-1"
                min="0"
                step="50"
              />
              <p className="text-[10px] text-slate-500 mt-1">Combinado só aparece em tickets ≥ R$ {config.min_ticket}</p>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Máx. métodos simultâneos</Label>
              <select
                className="w-full h-10 px-3 border rounded-md mt-1 bg-white text-sm"
                value={config.max_methods}
                onChange={(e) => update({ max_methods: parseInt(e.target.value) })}
              >
                <option value={2}>2 métodos</option>
                <option value={3}>3 métodos</option>
                <option value={4}>4 métodos</option>
              </select>
              <p className="text-[10px] text-slate-500 mt-1">Limita quantas fontes o cliente pode usar</p>
            </div>
          </div>

          {/* Preview */}
          {activeCombos > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                <Eye className="w-3.5 h-3.5" />
                Preview do Checkout — o cliente verá:
              </div>
              <div className="bg-white border border-slate-200 rounded-md p-3 text-xs space-y-1.5">
                <div className="font-mono text-slate-500">Total: R$ 1.500,00</div>
                <div className="text-slate-600">💳 Pagar tudo no Cartão</div>
                <div className="text-slate-600">📱 Pagar tudo via PIX</div>
                <div className="text-violet-700 font-semibold flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Dividir em 2+ formas ({activeCombos} {activeCombos === 1 ? 'opção' : 'opções'})
                </div>
              </div>
            </div>
          )}

          {activeCombos === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
              ⚠️ Selecione pelo menos uma combinação acima para ativar o pagamento combinado.
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}