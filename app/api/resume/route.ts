import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resumeData = await prisma.resume.findMany({
      orderBy: [
        { section: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('Error fetching resume data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { section, title, description, dateRange, order } = body;

    const resumeItem = await prisma.resume.create({
      data: {
        section,
        title,
        description,
        dateRange,
        order: order || 0,
      },
    });

    return NextResponse.json(resumeItem, { status: 201 });
  } catch (error) {
    console.error('Error creating resume item:', error);
    return NextResponse.json(
      { error: 'Failed to create resume item' },
      { status: 500 }
    );
  }
}
