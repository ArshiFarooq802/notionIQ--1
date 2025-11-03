import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateResponse } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, conversationId } = await req.json();

    let convId = conversationId;

    if (!convId) {
      const newConversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: content.slice(0, 50),
          type: "chat",
        },
      });
      convId = newConversation.id;
    }

    await prisma.message.create({
      data: {
        conversationId: convId,
        role: "user",
        content,
      },
    });

    const aiResponse = await generateResponse(content);

    await prisma.message.create({
      data: {
        conversationId: convId,
        role: "assistant",
        content: aiResponse,
      },
    });

    return NextResponse.json({ conversationId: convId, response: aiResponse });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
