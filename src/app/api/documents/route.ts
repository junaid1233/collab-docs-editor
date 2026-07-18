import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDocumentSchema } from "@/lib/validation";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await prisma.document.findMany({
    where: { ownerId: session.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      createdAt: true,
      owner: { select: { name: true, email: true } },
    },
  });

  const shared = await prisma.document.findMany({
    where: {
      shares: { some: { userId: session.id } },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      createdAt: true,
      owner: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json({ owned, shared });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = createDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title: parsed.data.title ?? "Untitled Document",
        content: parsed.data.content ?? JSON.stringify({ type: "doc", content: [] }),
        ownerId: session.id,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
