import { redisHelpers } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects: any = await redisHelpers.getProjects();
    
    // Sort by createdAt descending
    const sorted = projects.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, techStack, githubLink, demoLink, imageUrl, featured } = body;

    const project = await redisHelpers.addProject({
      title,
      description,
      techStack,
      githubLink,
      demoLink,
      imageUrl,
      featured: featured || false,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
