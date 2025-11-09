import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
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

    const project = await prisma.project.create({
      data: {
        title,
        description,
        techStack,
        githubLink,
        demoLink,
        imageUrl,
        featured: featured || false,
      },
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
