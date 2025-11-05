import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateResponse, generateResponseWithImages } from "@/lib/gemini";
import { uploadFileToUT } from "@/lib/uploadthing";
import { parseFile } from "@/lib/fileParser";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const conversationId = formData.get("conversationId") as string | null;
    const files = formData.getAll("files") as File[];

    let convId = conversationId;

    if (!convId) {
      const newConversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title: content?.slice(0, 50) || "New Chat",
          type: "chat",
        },
      });
      convId = newConversation.id;
    }

    let fileContext = "";
    const uploadedFileIds: string[] = [];
    const imageData: Array<{ base64: string; mimeType: string }> = [];

    if (files.length > 0) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { text, pages, imageData: imgData } = await parseFile(buffer, file.type);

        const { url, key } = await uploadFileToUT(file);

        const dbFile = await prisma.file.create({
          data: {
            name: key,
            originalName: file.name,
            type: file.type,
            size: file.size,
            pages,
            url,
            userId: session.user.id,
          },
        });

        uploadedFileIds.push(dbFile.id);
        
        if (text) {
          fileContext += `\n\n[Content from file "${file.name}"]\n${text.slice(0, 15000)}\n`;
        }
        
        if (imgData) {
          imageData.push({
            base64: imgData.base64,
            mimeType: imgData.mimeType,
          });
        }
      }
    }

    const userMessage = await prisma.message.create({
      data: {
        conversationId: convId,
        role: "user",
        content: content || "Analyze these files",
      },
    });

    if (uploadedFileIds.length > 0) {
      await prisma.messageFile.createMany({
        data: uploadedFileIds.map((fileId) => ({
          messageId: userMessage.id,
          fileId,
        })),
      });
    }

    const fullPrompt = fileContext
      ? `${content || "Please analyze the following files:"}\n${fileContext}`
      : content;

    let aiResponse: string;
    
    if (imageData.length > 0) {
      aiResponse = await generateResponseWithImages(fullPrompt, imageData);
    } else {
      aiResponse = await generateResponse(fullPrompt);
    }

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
