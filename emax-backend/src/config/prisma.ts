import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed", err);
  });