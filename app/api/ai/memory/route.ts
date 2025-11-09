import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Retrieve conversation history for a session
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get recent chat messages
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    // Get AI memory context
    const memory = await prisma.aiMemory.findMany({
      where: { sessionId },
      orderBy: { lastInteraction: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      messages: messages.reverse(), // Oldest first for display
      memory,
    });
  } catch (error) {
    console.error('Error fetching memory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memory' },
      { status: 500 }
    );
  }
}

// POST - Store new interaction in memory
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      sessionId,
      conversationType,
      message,
      response,
      context,
      role,
      content
    } = body;

    // Store in AI memory for context tracking
    if (message && response) {
      await prisma.aiMemory.create({
        data: {
          userId: userId || 'anonymous',
          sessionId,
          conversationType,
          message,
          response,
          context: context ? JSON.stringify(context) : null,
        },
      });
    }

    // Store in chat messages for conversation history
    if (role && content) {
      await prisma.chatMessage.create({
        data: {
          sessionId,
          role,
          content,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing memory:', error);
    return NextResponse.json(
      { error: 'Failed to store memory' },
      { status: 500 }
    );
  }
}

// DELETE - Clear session memory (optional, for privacy)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.chatMessage.deleteMany({ where: { sessionId } }),
      prisma.aiMemory.deleteMany({ where: { sessionId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { error: 'Failed to delete memory' },
      { status: 500 }
    );
  }
}
