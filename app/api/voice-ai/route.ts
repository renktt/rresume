import { NextRequest, NextResponse } from 'next/server';
import { RENANTE_PROFILE } from '@/lib/digital-twin-personality';
import { generateVoiceRAGResponse } from '@/lib/rag-system';

// RAG-powered voice response generator - optimized for speech
async function generateVoiceResponse(message: string, context?: string): Promise<string> {
  try {
    // Use RAG system for intelligent voice responses
    const response = await generateVoiceRAGResponse(message);
    return response;
  } catch (error) {
    console.error('Voice RAG error:', error);
    return `I'm ${RENANTE_PROFILE.name}, a ${RENANTE_PROFILE.title}. I'd be happy to answer your questions about my skills, projects, or experience.`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate contextual response
    const response = await generateVoiceResponse(message, context);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Voice AI error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
}
