import { PrismaClient } from '@prisma/client';

/**
 * في Next.js أثناء التطوير الـ Hot-Reload ممكن ينشئ
 * أكثر من نسخة من PrismaClient ويسبب تحذير:
 * "PrismaClient is already in use..."
 *
 * الحل: نخزّن نسخة واحدة في متغيّر عام (globalThis)
 * ونستخدمها في كل الاستدعاءات.
 */

declare global {
  // تعريف متغيّر عام حتى يتعرّف عليه TypeScript
  // (داخل block `globalThis`)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['error', 'warn'], // أحذف 'query' لو ما تبي تشوف الاستعلامات
  });

// في التطوير نخزّنها عشان ما تتكرّر
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
