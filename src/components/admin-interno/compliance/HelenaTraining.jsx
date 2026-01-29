import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles, Brain, ThumbsUp, ThumbsDown, Target, TrendingUp,
  AlertTriangle, CheckCircle2, XCircle, BarChart3, RefreshCw,
  MessageSquare, Eye, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Mock performance data
const performanceData = [
  { month: 'Jul', accuracy: 89, precision: 87, recall: 91 },
  { month: 'Ago', accuracy: 90, precision: 88, recall: 92 },
  { month: 'Set', accuracy: 91, precision: 90, recall: 91 },
  { month: 'Out', accuracy: 92, precision: 91, recall: 93 },
  { month: 'Nov', accuracy: 93, precision: 92, recall: 94 },
  { month: 'Dez', accuracy: 94, precision: 93, recall: 95 },
];

// Mock pending reviews
const pendingReviews = [
  {
    id: 'REV001',
    submission_id: 'SUB002',
    business_name: 'Comércio Digital ME',
    helena_decision: 'approved',
    helena_score: 85,
    helena_justification: 'Aprovação automática - todos os critérios atendidos',
    date: '2024-01-28T14:30:00'
  },
  {
    id: 'REV002',
    submission_id: 'SUB003',
    business_name: 'Loja Virtual Express',
    helena_decision: 'rejected',
    helena_score: 22,
    helena_justification: 'Rejeição automática - múltiplas inconsistências críticas',
    date: '2024-01-26T16:45:00'
  },
];

// Mock feedback history
const feedbackHistory = [
  {
    id: 'FB001',
    submission_id: 'SUB010',
    business_name: 'Tech Corp SA',
    helena_decision: 'approved',
    analyst_feedback: 'correct',
    comment: 'Helena acertou na aprovação. Cliente de baixo risco.',
    analyst: 'maria.silva@pagsmile.com',
    date: '2024-01-27T10:30:00'
  },
  {
    id: 'FB002',
    submission_id: 'SUB011',
    business_name: 'E-Shop Brasil',
    helena_decision: 'manual_review',
    analyst_feedback: 'incorrect',
    comment: 'Helena poderia ter aprovado automaticamente. Score de 78 era suficiente.',
    analyst: 'carlos.oliveira@pagsmile.com',
    date: '2024-01-26T15:45:00'
  },
  {
    id: 'FB003',
    submission_id: 'SUB012',
    business_name: 'Digital Services LTDA',
    helena_decision: 'rejected',
    analyst_feedback: 'correct',
    comment: 'Rejeição correta. Documentos claramente adulterados.',
    analyst: 'ana.costa@pagsmile.com',
    date: '2024-01-25T09:20:00'
  },
];

export default function HelenaTraining() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  const submitFeedback = () => {
    console.log('Feedback submitted:', { 
      review: selectedReview, 
      feedback: feedbackType, 
      comment: feedbackComment 
    });
    setSelectedReview(null);
    setFeedbackType(null);
    setFeedbackComment('');
  };

  return (
    <div className="space-y-6">
      {/* Helena Performance Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Acurácia Geral</p>
                <p className="text-3xl font-bold text-purple-600">94.2%</p>
                <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2.1% vs mês anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Precisão</p>
                <p className="text-2xl font-bold">93.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Recall</p>
                <p className="text-2xl font-bold">95.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Falsos Positivos</p>
                <p className="text-2xl font-bold">3.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Evolução de Performance da Helena
          </CardTitle>
          <CardDescription>Métricas de acurácia, precisão e recall ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} name="Acurácia" />
              <Line type="monotone" dataKey="precision" stroke="#2bc196" strokeWidth={2} name="Precisão" />
              <Line type="monotone" dataKey="recall" stroke="#3b82f6" strokeWidth={2} name="Recall" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Decisões para Revisar</CardTitle>
                <CardDescription>Forneça feedback sobre as decisões da Helena</CardDescription>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-0">
                {pendingReviews.length} pendentes
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div key={review.id} className="p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.business_name}</span>
                    <Badge className={`border-0 ${
                      review.helena_decision === 'approved' ? 'bg-green-100 text-green-700' :
                      review.helena_decision === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {review.helena_decision === 'approved' ? 'Aprovado' :
                       review.helena_decision === 'rejected' ? 'Rejeitado' : 'Manual'}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">Score: {review.helena_score}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{review.helena_justification}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => setSelectedReview(review)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Revisar e Dar Feedback
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedback Recente</CardTitle>
            <CardDescription>Histórico de feedback fornecido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedbackHistory.map((fb) => (
                <div key={fb.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{fb.business_name}</span>
                    <div className="flex items-center gap-2">
                      {fb.analyst_feedback === 'correct' ? (
                        <Badge className="bg-green-100 text-green-700 border-0">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Correto
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-0">
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          Incorreto
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{fb.comment}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Por: {fb.analyst.split('@')[0]}</span>
                    <span>{new Date(fb.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Status de Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Feedbacks coletados</span>
                <span className="font-medium">1,247</span>
              </div>
              <Progress value={83} className="h-2" />
              <p className="text-xs text-slate-500">Meta: 1,500 para próximo retreino</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Casos anotados</span>
                <span className="font-medium">892</span>
              </div>
              <Progress value={89} className="h-2" />
              <p className="text-xs text-slate-500">Meta: 1,000 para próximo retreino</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Qualidade dos dados</span>
                <span className="font-medium">97%</span>
              </div>
              <Progress value={97} className="h-2" />
              <p className="text-xs text-slate-500">Mínimo requerido: 95%</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div>
              <p className="text-sm text-slate-500">Último retreinamento</p>
              <p className="font-medium">15 de Janeiro, 2024</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Próximo retreinamento estimado</p>
              <p className="font-medium">15 de Fevereiro, 2024</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Iniciar Retreinamento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle className="text-base">Feedback para Helena</CardTitle>
              <CardDescription>{selectedReview.business_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Decisão da Helena</span>
                </div>
                <p className="text-sm text-purple-700">
                  {selectedReview.helena_decision === 'approved' ? 'Aprovado automaticamente' :
                   selectedReview.helena_decision === 'rejected' ? 'Rejeitado automaticamente' :
                   'Encaminhado para análise manual'}
                </p>
                <p className="text-sm text-purple-600 mt-1">Score: {selectedReview.helena_score}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">A decisão da Helena estava correta?</label>
                <div className="flex gap-3">
                  <Button
                    variant={feedbackType === 'correct' ? 'default' : 'outline'}
                    className={feedbackType === 'correct' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => setFeedbackType('correct')}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Sim, correto
                  </Button>
                  <Button
                    variant={feedbackType === 'incorrect' ? 'default' : 'outline'}
                    className={feedbackType === 'incorrect' ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => setFeedbackType('incorrect')}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Não, incorreto
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comentário (opcional)</label>
                <Textarea
                  placeholder="Explique por que a decisão estava correta ou incorreta..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>
            </CardContent>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setSelectedReview(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={submitFeedback}
                disabled={!feedbackType}
                className="bg-[#2bc196] hover:bg-[#239b7a]"
              >
                Enviar Feedback
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}