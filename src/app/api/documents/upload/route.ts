import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getFileExtension,
  isAllowedUpload,
  markdownToTipTapJson,
  plainTextToTipTapJson,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!isAllowedUpload(file.name)) {
      return NextResponse.json(
        {
          error: "Unsupported file type. Only .txt and .md files are supported.",
        },
        { status: 400 }
      );
    }

    const text = await file.text();
    const extension = getFileExtension(file.name);
    const contentJson =
      extension === ".md"
        ? markdownToTipTapJson(text)
        : plainTextToTipTapJson(text);

    const baseName = file.name.replace(/\.(txt|md)$/i, "") || "Imported Document";

    const document = await prisma.document.create({
      data: {
        title: baseName,
        content: JSON.stringify(contentJson),
        ownerId: session.id,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
