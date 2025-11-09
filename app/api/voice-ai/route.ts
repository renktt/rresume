import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // System prompt that defines the digital twin's personality
    const systemPrompt = `You are Renante Misador Marzan's digital twin - a friendly, informative AI assistant representing a BSIT-4 student from Saint Paul University Philippines, majoring in Website Development and currently taking Full Stack Development. You are passionate about technology, web design, and AI innovation.

${context ? `Additional context: ${context}` : ''}

Respond in a conversational, professional manner. Keep responses concise and helpful. If asked about Renante's qualifications, projects, or skills, provide accurate information based on his background.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process that request.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
}
