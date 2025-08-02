'use client';

import { useState } from 'react';
import { Brain, Lightbulb, AlertTriangle, CheckCircle, XCircle, Loader2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProConStore } from '@/store/procon';
import { AIAnalysis, AnalysisLanguage } from '@/types';

interface AIAnalysisCardProps {
  className?: string;
}

export function AIAnalysisCard({ className }: AIAnalysisCardProps) {
  const { 
    currentList, 
    currentAnalysis, 
    isAnalyzing, 
    analysisLanguage, 
    analyzeCurrentList, 
    clearAnalysis, 
    setAnalysisLanguage 
  } = useProConStore();
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setError(null);
      await analyzeCurrentList();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze list';
      setError(errorMessage);
    }
  };

  const handleLanguageChange = (language: AnalysisLanguage) => {
    setAnalysisLanguage(language);
    // Clear current analysis when language changes
    if (currentAnalysis) {
      clearAnalysis();
    }
  };

  const getTranslations = (lang: AnalysisLanguage) => {
    if (lang === 'pt-BR') {
      return {
        title: 'Análise de Decisão IA',
        description: 'Obtenha insights com IA para ajudá-lo a tomar a melhor decisão baseada nos seus prós e contras.',
        addProsConsPrompt: 'Adicione alguns prós e contras para obter análise da IA',
        readyToAnalyze: 'Pronto para analisar sua decisão',
        analyzeButton: 'Analisar Decisão',
        analyzing: 'Analisando seus prós e contras...',
        analysisError: 'Erro na Análise',
        tryAgain: 'Tentar Novamente',
        reAnalyze: 'Re-analisar',
        clearAnalysis: 'Limpar Análise',
        analysisReasoning: 'Raciocínio da Análise',
        keyFactors: 'Fatores Principais',
        additionalConsiderations: 'Considerações Adicionais',
        analysisGenerated: 'Análise gerada em',
        recommendations: {
          proceed: 'Recomendado Prosseguir',
          avoid: 'Recomendado Evitar', 
          consider_carefully: 'Considerar Cuidadosamente'
        },
        confidence: 'confiança'
      };
    }
    return {
      title: 'AI Decision Analysis',
      description: 'Get AI-powered insights to help you make the best decision based on your pros and cons.',
      addProsConsPrompt: 'Add some pros and cons to get AI analysis',
      readyToAnalyze: 'Ready to analyze your decision',
      analyzeButton: 'Analyze Decision',
      analyzing: 'Analyzing your pros and cons...',
      analysisError: 'Analysis Error',
      tryAgain: 'Try Again',
      reAnalyze: 'Re-analyze',
      clearAnalysis: 'Clear Analysis',
      analysisReasoning: 'Analysis Reasoning',
      keyFactors: 'Key Factors',
      additionalConsiderations: 'Additional Considerations',
      analysisGenerated: 'Analysis generated on',
      recommendations: {
        proceed: 'Recommended to Proceed',
        avoid: 'Recommended to Avoid',
        consider_carefully: 'Consider Carefully'
      },
      confidence: 'confidence'
    };
  };

  const t = getTranslations(analysisLanguage);

  const getRecommendationIcon = (recommendation: AIAnalysis['recommendation']) => {
    switch (recommendation) {
      case 'proceed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'avoid':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'consider_carefully':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getRecommendationColor = (recommendation: AIAnalysis['recommendation']) => {
    switch (recommendation) {
      case 'proceed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'avoid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'consider_carefully':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getRecommendationText = (recommendation: AIAnalysis['recommendation']) => {
    return t.recommendations[recommendation];
  };

  const canAnalyze = currentList && (currentList.pros.length > 0 || currentList.cons.length > 0);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              {t.title}
            </CardTitle>
            <CardDescription>
              {t.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-gray-500" />
            <select
              value={analysisLanguage}
              onChange={(e) => handleLanguageChange(e.target.value as AnalysisLanguage)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en-US">English (US)</option>
              <option value="pt-BR">Português (Brasil)</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentAnalysis && !isAnalyzing && (
          <div className="text-center py-4">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              {!canAnalyze 
                ? t.addProsConsPrompt
                : t.readyToAnalyze
              }
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              {t.analyzeButton}
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-gray-600">{t.analyzing}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{t.analysisError}</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="mt-3"
            >
              {t.tryAgain}
            </Button>
          </div>
        )}

        {currentAnalysis && !isAnalyzing && (
          <div className="space-y-4">
            {/* Recommendation Header */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getRecommendationColor(currentAnalysis.recommendation)}`}>
                {getRecommendationIcon(currentAnalysis.recommendation)}
                <span className="font-medium">
                  {getRecommendationText(currentAnalysis.recommendation)}
                </span>
              </div>
              <Badge variant="secondary">
                {currentAnalysis.confidence}% {t.confidence}
              </Badge>
            </div>

            {/* Reasoning */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{t.analysisReasoning}</h4>
              <p className="text-gray-700 leading-relaxed">{currentAnalysis.reasoning}</p>
            </div>

            {/* Key Factors */}
            {currentAnalysis.keyFactors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  {t.keyFactors}
                </h4>
                <ul className="space-y-2">
                  {currentAnalysis.keyFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Considerations */}
            {currentAnalysis.suggestedConsiderations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  {t.additionalConsiderations}
                </h4>
                <ul className="space-y-2">
                  {currentAnalysis.suggestedConsiderations.map((consideration, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="h-1.5 w-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {t.reAnalyze}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAnalysis}
              >
                {t.clearAnalysis}
              </Button>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-gray-500 pt-2">
              {t.analysisGenerated} {currentAnalysis.createdAt.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
