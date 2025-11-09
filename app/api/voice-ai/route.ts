import { NextRequest, NextResponse } from 'next/server';
import { RENANTE_PROFILE } from '@/lib/digital-twin-personality';

// Smart response generator for voice AI
function generateVoiceResponse(message: string, context?: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Get all skills
  const allSkills = [
    ...RENANTE_PROFILE.skills.frontend,
    ...RENANTE_PROFILE.skills.backend,
    ...RENANTE_PROFILE.skills.database,
    ...RENANTE_PROFILE.skills.ai
  ];
  
  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return `Hello! I'm ${RENANTE_PROFILE.name}'s Digital Twin. I'm a ${RENANTE_PROFILE.title}. How can I help you today?`;
  }
  
  // Skills
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
    return `I have expertise in ${allSkills.slice(0, 5).join(', ')}, and more. I specialize in full-stack web development with React, Next.js, and TypeScript. What would you like to know more about?`;
  }
  
  // Projects
  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
    return `I've built several projects including this portfolio system with an AI Digital Twin, and various full-stack applications. Check out the Projects page to see my work!`;
  }
  
  // Education
  if (lowerMessage.includes('education') || lowerMessage.includes('study')) {
    return `I'm a ${RENANTE_PROFILE.title} specializing in ${RENANTE_PROFILE.specialization}. I'm passionate about web development and continuous learning!`;
  }
  
  // Resume/Experience
  if (lowerMessage.includes('resume') || lowerMessage.includes('experience')) {
    return `My resume showcases my technical skills in ${allSkills.slice(0, 4).join(', ')}, and more. Visit the Resume page to see all my qualifications and achievements!`;
  }
  
  // Contact
  if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
    return `You can reach me through the Contact page. I'd be happy to discuss opportunities or answer any questions!`;
  }
  
  // About
  if (lowerMessage.includes('about') || lowerMessage.includes('who are you')) {
    return `I'm ${RENANTE_PROFILE.name}, a ${RENANTE_PROFILE.title}. I'm passionate about ${RENANTE_PROFILE.interests.slice(0, 3).join(', ')}, and building innovative web applications!`;
  }
  
  // Default with context
  if (context?.includes('resume')) {
    return `I'd be happy to discuss my qualifications and experience in ${allSkills.slice(0, 3).join(', ')}. What would you like to know?`;
  }
  
  if (context?.includes('project')) {
    return `This project showcases my full-stack development skills. I love building modern web applications with clean architecture. What interests you most?`;
  }
  
  // Generic
  return `I'm Renante's Digital Twin. I can tell you about my skills in ${allSkills.slice(0, 3).join(', ')}, my projects, education, and experience. What would you like to know?`;
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
    const response = generateVoiceResponse(message, context);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Voice AI error:', error);
    return NextResponse.json(
      { error: 'Failed to process voice input' },
      { status: 500 }
    );
  }
}
