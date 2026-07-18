import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isDocumentOwner } from "@/lib/documents";
import { prisma } from "@/lib/prisma";
import { shareDocumentSchema } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const owner = await isDocumentOwner(id, session.id);
  if (!owner) {
    return NextResponse.json({ error: "Only the owner can view shares" }, { status: 403 });
  }

  const shares = await prisma.documentShare.findMany({
    where: { documentId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ shares });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const owner = await isDocumentOwner(id, session.id);
  if (!owner) {
    return NextResponse.json({ error: "Only the owner can share this document" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = shareDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === session.id) {
      return NextResponse.json({ error: "You cannot share with yourself" }, { status: 400 });
    }

    const existing = await prisma.documentShare.findUnique({
      where: {
        documentId_userId: {
          documentId: id,
          userId: targetUser.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Document already shared with this user" }, { status: 409 });
    }

    const share = await prisma.documentShare.create({
      data: {
        documentId: id,
        userId: targetUser.id,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ share }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to share document" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const owner = await isDocumentOwner(id, session.id);
  if (!owner) {
    return NextResponse.json({ error: "Only the owner can unshare this document" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  await prisma.documentShare.deleteMany({
    where: { documentId: id, userId },
  });

  return NextResponse.json({ success: true });
}
