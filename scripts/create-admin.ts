// scripts/create-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("\n🔐 Create a SEZHIYAM FOUNDATION admin user\n");

  const email = (await ask("Email: ")).trim().toLowerCase();
  const name = (await ask("Full name: ")).trim();
  const password = (await ask("Password (min 8 chars): ")).trim();

  if (!email || !email.includes("@")) {
    console.error("❌ Invalid email");
    process.exit(1);
  }
  if (!name) {
    console.error("❌ Name required");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.error(`❌ An admin with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.create({
    data: {
      email,
      name,
      passwordHash,
      role: "superadmin",
      active: true,
    },
  });

  console.log(`\n✅ Admin created: ${user.email} (${user.name})`);
  console.log(`   Role: ${user.role}`);
  console.log(`   ID:   ${user.id}\n`);

  rl.close();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("❌ Error:", e);
  rl.close();
  await prisma.$disconnect();
  process.exit(1);
});