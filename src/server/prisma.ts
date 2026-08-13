// Validate and sanitize DATABASE_URL before injecting into Prisma Client engine
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL.trim();
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    console.warn('[ShopSphere Prisma] DATABASE_URL is invalid or does not match postgresql:// or postgres:// protocol. Disabling Prisma.');
    delete process.env.DATABASE_URL;
  }
}

import { PrismaClient } from '@prisma/client';

declare global {
  var prismaGlobalClient: PrismaClient | undefined;
}

const getPrismaClient = (): PrismaClient => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient();
  } else {
    if (!globalThis.prismaGlobalClient) {
      globalThis.prismaGlobalClient = new PrismaClient({
        log: ['error', 'warn'],
      });
    }
    return globalThis.prismaGlobalClient;
  }
};

export const prisma = getPrismaClient();
export default prisma;
