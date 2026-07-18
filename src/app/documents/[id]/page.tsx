import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDocumentAccess } from "@/lib/documents";
import { prisma } from "@/lib/prisma";
import { DocumentEditor } from "@/components/DocumentEditorLoader";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const access = await getDocumentAccess(id, session.id);

  if (!access.canRead) {
    notFound();
  }

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      owner: { select: { email: true } },
      shares: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!document) {
    notFound();
  }

  return (
    <DocumentEditor
      documentId={document.id}
      initialTitle={document.title}
      initialContent={document.content}
      isOwner={access.isOwner}
      ownerEmail={document.owner.email}
      initialShares={document.shares.map((share) => share.user)}
    />
  );
}
