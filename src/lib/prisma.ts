import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function parseLibsqlUrl(databaseUrl: string) {
  const [baseUrl, query = ""] = databaseUrl.split("?");
  const params = new URLSearchParams(query);
  const authToken = params.get("authToken") ?? undefined;

  return { url: baseUrl, authToken };
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl?.startsWith("libsql://")) {
    const { url, authToken } = parseLibsqlUrl(databaseUrl);
    const adapter = new PrismaLibSql({ url, authToken });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { createPrismaClient };
