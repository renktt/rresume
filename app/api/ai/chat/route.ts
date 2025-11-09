import { NextResponse } from 'next/server';
import { RENANTE_PROFILE } from '@/lib/digital-twin-personality';
import { redisHelpers } from '@/lib/redis';
import { generateDigitalTwinResponse } from '@/lib/groq';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Groq-powered response generator
async function generateContextualResponse(message: string, context?: string, conversationHistory?: any[]): Promise<string> {
  // Fetch real data from Redis database
  let resumeData: any[] = [];
  let projectsData: any[] = [];
  
  try {
    const [resume, projects] = await Promise.all([
      redisHelpers.getResume(),
      redisHelpers.getProjects()
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

  // Convert conversation history to proper format
  const chatHistory: ChatMessage[] = (conversationHistory || [])
    .filter((msg: any) => msg.role && msg.content)
    .map((msg: any) => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    }));

  // Generate response using Groq AI
  try {
    const response = await generateDigitalTwinResponse(message, {
      conversationHistory: chatHistory,
      resumeData,
      projectsData,
      personalityProfile: RENANTE_PROFILE,
    });
    
    return response;
  } catch (error) {
    console.error('Groq AI error:', error);
    // Fallback to basic response if Groq fails
    return `I apologize, but I'm having trouble processing your request at the moment. I'm ${RENANTE_PROFILE.name}'s Digital Twin, and I'd be happy to answer questions about skills, projects, experience, or how to get in touch. Please try asking again or rephrase your question.`;
  }
  
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, context, sessionId, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate AI-powered response with conversation history
    const response = await generateContextualResponse(message, context, conversationHistory);

    // Store in Redis memory
    try {
      const currentSessionId = sessionId || 'default';
      
      // Store user message
      await redisHelpers.addChatMessage(currentSessionId, {
        sessionId: currentSessionId,
        role: 'user',
        content: message,
      });

      // Store assistant response
      await redisHelpers.addChatMessage(currentSessionId, {
        sessionId: currentSessionId,
        role: 'assistant',
        content: response,
      });

      // Store in AI memory for context
      await redisHelpers.addAiMemory(currentSessionId, {
        userId: 'anonymous',
        sessionId: currentSessionId,
        conversationType: 'chat',
        message,
        response,
        context: context ? JSON.stringify(context) : null,
      });
    } catch (memoryError) {
      console.log('Memory storage error:', memoryError);
    }

    return NextResponse.json({
      response,
      conversationId: sessionId || 'default',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
