import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __PRISMA_CLIENT__: PrismaClient | undefined;
}

export const prisma: PrismaClient = globalThis.__PRISMA_CLIENT__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__PRISMA_CLIENT__ = prisma;
}

export async function initDatabase(): Promise<void> {
  await prisma.$connect();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
