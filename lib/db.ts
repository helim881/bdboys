// lib/db.ts
import prisma from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";

declare global {
  var prisma: PrismaClient | undefined;
}

const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

export default db;

export const getSiteSettings = cache(async () => {
  const settings = await prisma.setting.findFirst({
    where: { id: 1 },
  });
  return settings;
});
