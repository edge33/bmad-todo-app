import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const examples = [
  { description: "Learn how to use this app", completed: false },
  { description: "Check out the UI", completed: true },
  { description: "Add your first task", completed: false },
];

async function main() {
  for (const task of examples) {
    await prisma.task.upsert({
      where: { description: task.description },
      update: {},
      create: task, 
    });
  }
  console.log("Seeded example tasks.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
