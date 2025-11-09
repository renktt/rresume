import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId } = body;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { 
        completed: true,
        progress: 100,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error completing course:', error);
    return NextResponse.json(
      { error: 'Failed to complete course' },
      { status: 500 }
    );
  }
}
