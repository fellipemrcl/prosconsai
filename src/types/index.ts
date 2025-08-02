export interface ProConItem {
  id: string;
  text: string;
  createdAt: Date;
}

export interface ProConList {
  id: string;
  title: string;
  description?: string;
  pros: ProConItem[];
  cons: ProConItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ItemType = 'pro' | 'con';

export type AnalysisLanguage = 'en-US' | 'pt-BR';

export interface AIAnalysis {
  recommendation: 'proceed' | 'avoid' | 'consider_carefully';
  confidence: number; // 0-100
  reasoning: string;
  keyFactors: string[];
  suggestedConsiderations: string[];
  language: AnalysisLanguage;
  createdAt: Date;
}
