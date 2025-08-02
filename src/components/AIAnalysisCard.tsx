'use client';

import { useState } from 'react';
import { Brain, Lightbulb, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProConStore } from '@/store/procon';
import { AIAnalysis } from '@/types';

interface AIAnalysisCardProps {
  className?: string;
}

export function AIAnalysisCard({ className }: AIAnalysisCardProps) {
  const { currentList, currentAnalysis, isAnalyzing, analyzeCurrentList, clearAnalysis } = useProConStore();
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
    switch (recommendation) {
      case 'proceed':
        return 'Recommended to Proceed';
      case 'avoid':
        return 'Recommended to Avoid';
      case 'consider_carefully':
        return 'Consider Carefully';
    }
  };

  const canAnalyze = currentList && (currentList.pros.length > 0 || currentList.cons.length > 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Decision Analysis
        </CardTitle>
        <CardDescription>
          Get AI-powered insights to help you make the best decision based on your pros and cons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentAnalysis && !isAnalyzing && (
          <div className="text-center py-4">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              {!canAnalyze 
                ? 'Add some pros and cons to get AI analysis'
                : 'Ready to analyze your decision'
              }
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              Analyze Decision
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
            <p className="text-gray-600">Analyzing your pros and cons...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Analysis Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="mt-3"
            >
              Try Again
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
                {currentAnalysis.confidence}% confidence
              </Badge>
            </div>

            {/* Reasoning */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Analysis Reasoning</h4>
              <p className="text-gray-700 leading-relaxed">{currentAnalysis.reasoning}</p>
            </div>

            {/* Key Factors */}
            {currentAnalysis.keyFactors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  Key Factors
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
                  Additional Considerations
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
                Re-analyze
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAnalysis}
              >
                Clear Analysis
              </Button>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-gray-500 pt-2">
              Analysis generated on {currentAnalysis.createdAt.toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
