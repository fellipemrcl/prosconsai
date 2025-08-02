import OpenAI from 'openai';
import { ProConList, AIAnalysis } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIAnalysis(proConList: ProConList): Promise<AIAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const prosText = proConList.pros.map(item => item.text).join('\n- ');
  const consText = proConList.cons.map(item => item.text).join('\n- ');

  const prompt = `Analyze the following pros and cons list for making a decision about: "${proConList.title}"

${proConList.description ? `Description: ${proConList.description}` : ''}

PROS:
- ${prosText}

CONS:
- ${consText}

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

Return only the JSON object without any additional text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert decision analyst. Provide clear, balanced, and actionable recommendations based on pros and cons analysis. Return only valid JSON.'
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
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw new Error('Failed to generate AI analysis. Please try again.');
  }
}
