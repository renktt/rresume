import { NextRequest, NextResponse } from 'next/server';
import { RENANTE_PROFILE } from '@/lib/digital-twin-personality';
import { vectorHelpers } from '@/lib/vector';
import { generateDigitalTwinResponse, GROQ_MODELS, generateGroqResponse } from '@/lib/groq';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Groq-powered voice response generator - optimized for speech
async function generateVoiceResponse(message: string, context?: string): Promise<string> {
  // Fetch real data from Redis database
  let resumeData: any[] = [];
  let projectsData: any[] = [];
  
  try {
    const [resume, projects] = await Promise.all([
      vectorHelpers.getResume(),
      vectorHelpers.getProjects()
    ]);
    
    resumeData = Array.isArray(resume) ? resume : [];
    projectsData = Array.isArray(projects) ? projects : [];
    
    // Sort resume by section and order
    resumeData.sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.order - b.order;
    });
    // Sort projects by createdAt descending
    projectsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.log('Database fetch error:', error);
  }

  // Create voice-optimized system prompt
  const voiceSystemPrompt = `You are ${RENANTE_PROFILE.name}'s AI Digital Twin speaking via voice interface.

CRITICAL VOICE GUIDELINES:
- Keep responses SHORT and CONVERSATIONAL (2-4 sentences max)
- Speak naturally as if in a real conversation
- Avoid markdown, bullet points, or special formatting
- Use simple, clear language optimized for speech
- Be concise but informative
- Always speak in first person as ${RENANTE_PROFILE.name}

${buildVoiceContext(resumeData, projectsData)}

Remember: This is VOICE output. Be brief, natural, and conversational!`;

  // Generate voice-optimized response using Groq with faster model
  try {
    const response = await generateGroqResponse({
      messages: [
        { role: 'system', content: voiceSystemPrompt },
        { role: 'user', content: message },
      ],
      model: GROQ_MODELS.LLAMA_3_8B, // Use 8B for faster voice responses
      temperature: 0.7,
      maxTokens: 150, // Limit for voice (shorter responses)
    });
    
    // Clean up any markdown or special formatting for voice
    return response
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, '. ')
      .replace(/•/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
      .trim();
  } catch (error) {
    console.error('Groq voice AI error:', error);
    return `I'm ${RENANTE_PROFILE.name}, a ${RENANTE_PROFILE.title}. I'd be happy to answer your questions about my skills, projects, or experience. Could you please rephrase your question?`;
  }
}

// Helper to build concise voice context
function buildVoiceContext(resumeData: any[], projectsData: any[]): string {
  let context = `\nPROFILE: ${RENANTE_PROFILE.title} specializing in ${RENANTE_PROFILE.specialization}`;
  
  if (projectsData.length > 0) {
    context += `\nPROJECTS: ${projectsData.length} completed projects`;
    const featured = projectsData.filter(p => p.featured);
    if (featured.length > 0) {
      context += ` including ${featured.map(p => p.title).join(', ')}`;
    }
  }
  
  const skills = resumeData.filter(r => r.section === 'skills');
  if (skills.length > 0) {
    context += `\nSKILLS: ${skills.map(s => s.title).join(', ')}`;
  }
  
  const education = resumeData.filter(r => r.section === 'education');
  if (education.length > 0) {
    context += `\nEDUCATION: ${education[0].title}`;
  }
  
  return context;
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
