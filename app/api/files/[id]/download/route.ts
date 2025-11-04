import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { downloadFile } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const file = await prisma.file.findUnique({
      where: { id: params.id },
    });

    if (!file || file.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const blob = await downloadFile(file.name);

    return new NextResponse(blob, {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${file.originalName}"`,
      },
    });
  } catch (error) {
    console.error("Download file error:", error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    );
  }
}
