import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, progress } = body;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { progress },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
