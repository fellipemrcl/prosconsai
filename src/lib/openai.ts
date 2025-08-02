import OpenAI from 'openai';
import { ProConList, AIAnalysis, AnalysisLanguage } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getLanguageInstructions = (language: AnalysisLanguage) => {
  switch (language) {
    case 'pt-BR':
      return {
        systemMessage: 'Você é um analista de decisões especialista. Forneça recomendações claras, equilibradas e práticas baseadas na análise de prós e contras. Responda apenas com JSON válido em português brasileiro.',
        promptTemplate: `Analise a seguinte lista de prós e contras para tomar uma decisão sobre: "${'{title}'}"

${'{description}'}

PRÓS:
- {prosText}

CONTRAS:
- {consText}

Com base nesta análise, forneça uma recomendação estruturada no seguinte formato JSON:
{
  "recommendation": "proceed" | "avoid" | "consider_carefully",
  "confidence": número (0-100),
  "reasoning": "Explicação detalhada da recomendação",
  "keyFactors": ["Fatores mais importantes que influenciaram a decisão"],
  "suggestedConsiderations": ["Fatores adicionais a considerar antes de decidir"]
}

Foque em:
1. Pesar a significância e impacto de cada pró e contra
2. Identificar riscos e oportunidades potenciais
3. Considerar implicações de curto e longo prazo
4. Fornecer insights práticos

Retorne apenas o objeto JSON sem texto adicional.`
      };
    case 'en-US':
    default:
      return {
        systemMessage: 'You are an expert decision analyst. Provide clear, balanced, and actionable recommendations based on pros and cons analysis. Return only valid JSON in American English.',
        promptTemplate: `Analyze the following pros and cons list for making a decision about: "${'{title}'}"

${'{description}'}

PROS:
- {prosText}

CONS:
- {consText}

Based on this analysis, provide a structured recommendation in the following JSON format:
{
  "recommendation": "proceed" | "avoid" | "consider_carefully",
  "confidence": number (0-100),
  "reasoning": "Detailed explanation of the recommendation",
  "keyFactors": ["Most important factors that influenced the decision"],
  "suggestedConsiderations": ["Additional factors to consider before deciding"]
}

Focus on:
1. Weighing the significance and impact of each pro and con
2. Identifying potential risks and opportunities
3. Considering both short-term and long-term implications
4. Providing actionable insights

Return only the JSON object without any additional text.`
      };
  }
};

export async function generateAIAnalysis(proConList: ProConList, language: AnalysisLanguage = 'en-US'): Promise<AIAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const prosText = proConList.pros.map(item => item.text).join('\n- ');
  const consText = proConList.cons.map(item => item.text).join('\n- ');
  const languageInstructions = getLanguageInstructions(language);

  const prompt = languageInstructions.promptTemplate
    .replace('{title}', proConList.title)
    .replace('{description}', proConList.description ? `Description: ${proConList.description}` : '')
    .replace('{prosText}', prosText)
    .replace('{consText}', consText);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: languageInstructions.systemMessage
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysisData = JSON.parse(content);
    
    return {
      ...analysisData,
      language,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw new Error('Failed to generate AI analysis. Please try again.');
  }
}
