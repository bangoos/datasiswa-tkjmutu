import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create libsql client for Turso
const libsql = createClient({
  url: process.env.DATABASE_URL || "file:./db/custom.db",
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "file:./db/custom.db",
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export { libsql };
