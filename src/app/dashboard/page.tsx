import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const owned = await prisma.document.findMany({
    where: { ownerId: session.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
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
      owner: { select: { name: true, email: true } },
    },
  });

  return (
    <DashboardClient
      userName={session.name}
      owned={owned.map((doc) => ({
        ...doc,
        updatedAt: doc.updatedAt.toISOString(),
      }))}
      shared={shared.map((doc) => ({
        ...doc,
        updatedAt: doc.updatedAt.toISOString(),
      }))}
    />
  );
}
