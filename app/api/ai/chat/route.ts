import { NextResponse } from 'next/server';
import { RENANTE_PROFILE } from '@/lib/digital-twin-personality';

// Smart response generator based on message content
function generateContextualResponse(message: string, context?: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Get all skills as flat array
  const allSkills = [
    ...RENANTE_PROFILE.skills.frontend,
    ...RENANTE_PROFILE.skills.backend,
    ...RENANTE_PROFILE.skills.database,
    ...RENANTE_PROFILE.skills.ai
  ];
  
  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return `Hello! I'm Renante's Digital Twin. I'm a ${RENANTE_PROFILE.title} passionate about ${RENANTE_PROFILE.interests.join(', ')}. How can I help you learn more about my skills and experience?`;
  }
  
  // Skills questions
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
    return `I have expertise in:\n• Frontend: ${RENANTE_PROFILE.skills.frontend.join(', ')}\n• Backend: ${RENANTE_PROFILE.skills.backend.join(', ')}\n• Database: ${RENANTE_PROFILE.skills.database.join(', ')}\n• AI: ${RENANTE_PROFILE.skills.ai.join(', ')}\n\nI'm particularly skilled in building full-stack web applications. Would you like to know more about any specific technology?`;
  }
  
  // Education questions
  if (lowerMessage.includes('education') || lowerMessage.includes('school') || lowerMessage.includes('study') || lowerMessage.includes('degree')) {
    return `I'm currently a ${RENANTE_PROFILE.title}. I'm specializing in ${RENANTE_PROFILE.specialization}. My current focus includes: ${RENANTE_PROFILE.currentFocus.join(', ')}. I have a strong foundation in modern web technologies and full-stack development!`;
  }
  
  // Projects questions
  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('built') || lowerMessage.includes('created')) {
    return `I've built several impressive projects including:\n• This portfolio system with an AI Digital Twin\n• Full-stack web applications with MySQL databases\n• AI-powered features with voice and chat capabilities\n• Responsive and modern web interfaces\n\nCheck out the Projects page to see my work in detail, including live demos and GitHub repositories!`;
  }
  
  // Resume questions
  if (lowerMessage.includes('resume') || lowerMessage.includes('experience') || lowerMessage.includes('work')) {
    return `My resume showcases my education, technical skills, and project experience. I have hands-on experience with: ${allSkills.slice(0, 6).join(', ')}, and more! Visit the Resume page to see all the details about my qualifications and achievements.`;
  }
  
  // Learning questions
  if (lowerMessage.includes('learn') || lowerMessage.includes('teaching')) {
    return `I'm passionate about continuous learning! I believe in learning by doing and creating hands-on projects. I'm always exploring new technologies and building real-world applications to expand my skills!`;
  }
  
  // Contact questions
  if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
    return `You can reach me through the Contact page where you'll find various ways to get in touch. Feel free to send a message and I'll respond as soon as possible!`;
  }
  
  // About questions
  if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('tell me about')) {
    return `I'm Renante's Digital Twin - an AI representation designed to help you learn about ${RENANTE_PROFILE.name}. I'm a ${RENANTE_PROFILE.title} passionate about ${RENANTE_PROFILE.interests.join(', ')}. I love building innovative web applications and solving complex problems with code!`;
  }
  
  // AI/Digital Twin questions
  if (lowerMessage.includes('ai') || lowerMessage.includes('digital twin') || lowerMessage.includes('how do you work')) {
    return `I'm an Advanced Digital Twin system built with Next.js, React, and TypeScript. I can communicate through both voice and text, and I maintain memory of our conversations across sessions. I was created to showcase Renante's skills in AI integration and full-stack development!`;
  }
  
  // Thank you responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `You're welcome! Feel free to ask me anything else about my skills, projects, or experience. I'm here to help!`;
  }
  
  // Help/What can you do
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you') || lowerMessage.includes('capabilities')) {
    return `I can help you with:\n• Information about my skills and technologies\n• Details about education and background\n• Overview of projects and portfolio\n• Resume and experience details\n• Learning philosophy and courses\n• Contact information\n\nJust ask me anything you'd like to know!`;
  }
  
  // Default contextual response
  if (context?.includes('resume')) {
    return `I'd be happy to discuss my resume and qualifications! I have expertise in ${allSkills.slice(0, 3).join(', ')} and more. What specific aspect would you like to know about?`;
  }
  
  if (context?.includes('project')) {
    return `This is one of my projects showcasing full-stack development skills. The project demonstrates proficiency in modern web technologies and clean code architecture. Would you like to know more about the technical implementation?`;
  }
  
  // Generic fallback
  return `That's an interesting question! I'm Renante's Digital Twin and I'm here to help you learn about my skills, projects, and experience. I specialize in ${allSkills.slice(0, 5).join(', ')}, and I'm passionate about ${RENANTE_PROFILE.interests.join(', ')}. Could you tell me more specifically what you'd like to know?`;
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

    // Generate contextual response based on message content
    const response = generateContextualResponse(message, context);

    // Store in memory (if database is available)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'anonymous',
          sessionId: sessionId || 'default',
          conversationType: 'chat',
          message,
          response,
          context,
          role: 'assistant',
          content: response,
        }),
      });
    } catch (memoryError) {
      console.log('Memory storage skipped (database not available)');
    }

    return NextResponse.json({
      response,
      conversationId: sessionId,
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
