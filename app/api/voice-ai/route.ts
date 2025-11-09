import { NextRequest, NextResponse } from 'next/server';
import { RENANTE_PROFILE } from '@/lib/digital-twin-personality';
import prisma from '@/lib/db';

// Smart response generator for voice AI - concise for speech
async function generateVoiceResponse(message: string, context?: string): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // Get all skills
  const allSkills = [
    ...RENANTE_PROFILE.skills.frontend,
    ...RENANTE_PROFILE.skills.backend,
    ...RENANTE_PROFILE.skills.database,
    ...RENANTE_PROFILE.skills.ai
  ];
  
  // Fetch real data from database
  let resumeData: any[] = [];
  let projectsData: any[] = [];
  
  try {
    [resumeData, projectsData] = await Promise.all([
      prisma.resume.findMany({ orderBy: [{ section: 'asc' }, { order: 'asc' }] }),
      prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
    ]);
  } catch (error) {
    console.log('Database fetch skipped:', error);
  }
  
  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return `Hello! I'm ${RENANTE_PROFILE.name}'s Digital Twin. I'm a ${RENANTE_PROFILE.title}. How can I help you today?`;
  }
  
  // Skills
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
    const topSkills = [...RENANTE_PROFILE.skills.frontend.slice(0, 3), ...RENANTE_PROFILE.skills.backend.slice(0, 2), ...RENANTE_PROFILE.skills.database.slice(0, 1)];
    return `I have expertise in ${topSkills.join(', ')}, and many more technologies. I specialize in full-stack web development with a focus on modern frameworks and best practices. I've applied these skills across ${projectsData.length} projects. What would you like to know more about?`;
  }
  
  // Projects
  if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('built') || lowerMessage.includes('work')) {
    if (projectsData.length > 0) {
      const topProjects = projectsData.slice(0, 3).map(p => p.title).join(', ');
      return `I've built ${projectsData.length} projects including ${topProjects}. Each showcases my full-stack development skills with technologies like React, Next.js, and MySQL. Check out the Projects page to see live demos and code!`;
    }
    return `I've built several projects including this portfolio system with an AI Digital Twin, and various full-stack applications with MySQL databases. Check out the Projects page to see my work!`;
  }
  
  // Education
  if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('school') || lowerMessage.includes('degree')) {
    const education = resumeData.filter(item => item.section === 'education');
    if (education.length > 0) {
      return `I'm a ${RENANTE_PROFILE.title} specializing in ${RENANTE_PROFILE.specialization}. ${education[0].description} I'm passionate about continuous learning and building innovative web applications!`;
    }
    return `I'm a ${RENANTE_PROFILE.title} specializing in ${RENANTE_PROFILE.specialization}. I'm passionate about web development and continuous learning through hands-on projects!`;
  }
  
  // Resume/Experience
  if (lowerMessage.includes('resume') || lowerMessage.includes('experience') || lowerMessage.includes('qualification')) {
    const experience = resumeData.filter(item => item.section === 'experience');
    let response = `My resume showcases my technical skills in ${allSkills.slice(0, 5).join(', ')}, and more.`;
    if (experience.length > 0) {
      response += ` I have experience in ${experience[0].title}, and have completed ${projectsData.length} projects.`;
    }
    response += ` Visit the Resume page to see all my qualifications and download my full CV!`;
    return response;
  }
  
  // Contact
  if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email') || lowerMessage.includes('hire')) {
    return `You can reach me through the Contact page where you'll find various ways to get in touch. I'd be happy to discuss opportunities, collaborations, or answer any questions about my work!`;
  }
  
  // About
  if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('tell me about yourself')) {
    return `I'm ${RENANTE_PROFILE.name}, a ${RENANTE_PROFILE.title} with expertise in ${allSkills.slice(0, 4).join(', ')}. I'm passionate about ${RENANTE_PROFILE.interests.slice(0, 3).join(', ')}. I've built ${projectsData.length} projects and I love creating innovative web applications that solve real problems!`;
  }
  
  // What can you tell me / help with
  if (lowerMessage.includes('what can you') || lowerMessage.includes('help') || lowerMessage.includes('tell me')) {
    return `I can tell you about my technical skills, my ${projectsData.length} projects, my education and background, work experience, and how to contact me. I'm here to showcase my capabilities as a full-stack developer. What would you like to know?`;
  }
  
  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `You're very welcome! Feel free to ask me anything else about my skills, projects, or experience. I'm always happy to help!`;
  }
  
  // Default with context
  if (context?.includes('resume')) {
    return `I'd be happy to discuss my qualifications and experience in ${allSkills.slice(0, 3).join(', ')}. I have ${projectsData.length} completed projects demonstrating these skills. What would you like to know?`;
  }
  
  if (context?.includes('project')) {
    return `This project showcases my full-stack development skills using modern technologies. I love building web applications with clean architecture and great user experience. What interests you most about it?`;
  }
  
  // Generic fallback
  return `I'm Renante's Digital Twin. I can tell you about my skills in ${allSkills.slice(0, 4).join(', ')}, my ${projectsData.length} projects, education, and experience. I specialize in full-stack web development. What would you like to know?`;
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
