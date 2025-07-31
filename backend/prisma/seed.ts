import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = ["ADMIN", "MANAGER", "STYLIST", "CUSTOMER"];

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  console.log("✅ Seeded roles successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
