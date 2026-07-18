import { prisma } from "./prisma";

export async function canAccessDocument(
  documentId: string,
  userId: string
): Promise<boolean> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      shares: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  if (!document) return false;
  if (document.ownerId === userId) return true;
  return document.shares.length > 0;
}

export async function isDocumentOwner(
  documentId: string,
  userId: string
): Promise<boolean> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { ownerId: true },
  });
  return document?.ownerId === userId;
}

export type DocumentAccess = {
  canRead: boolean;
  canWrite: boolean;
  isOwner: boolean;
};

export async function getDocumentAccess(
  documentId: string,
  userId: string
): Promise<DocumentAccess> {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      shares: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  if (!document) {
    return { canRead: false, canWrite: false, isOwner: false };
  }

  const isOwner = document.ownerId === userId;
  const isShared = document.shares.length > 0;

  return {
    canRead: isOwner || isShared,
    canWrite: isOwner || isShared,
    isOwner,
  };
}
