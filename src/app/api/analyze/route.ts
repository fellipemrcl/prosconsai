import { NextRequest, NextResponse } from 'next/server';
import { generateAIAnalysis } from '@/lib/openai';
import { ProConList, AnalysisLanguage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { proConList, language }: { proConList: ProConList; language?: AnalysisLanguage } = await request.json();
    
    // Validate the request data
    if (!proConList || !proConList.title) {
      return NextResponse.json(
        { error: 'Invalid pros and cons list data' },
        { status: 400 }
      );
    }

    // Check if there are any pros or cons to analyze
    if (proConList.pros.length === 0 && proConList.cons.length === 0) {
      return NextResponse.json(
        { error: 'Cannot analyze empty pros and cons list' },
        { status: 400 }
      );
    }

    const analysis = await generateAIAnalysis(proConList, language || 'en-US');
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key is not configured' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
