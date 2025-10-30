import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { Pool } from "pg";
import { PrismaClient } from ".";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  maxUses: 1,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.$transaction(async (tx) => {
    let user = await tx.user.findUnique({
      where: { email: "test@fieldjolt.com" },
    });

    if (user) {
      console.log("✅ User already exists, skipping seed");
      return;
    }

    // 1. Create user
    console.log("👤 Creating user...");
    user = await tx.user.create({
      data: {
        id: Math.random().toString(36).substring(2, 9),
        name: "Test User",
        email: "test@fieldjolt.com",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.account.create({
      data: {
        id: Math.random().toString(36).substring(2, 9),
        accountId: Math.random().toString(36).substring(2, 9),
        providerId: "credential",
        userId: user.id,
        password: await hashPassword("password"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ User created:", user.email);

    console.log("🏢 Creating organization...");
    const organization = await tx.organization.create({
      data: {
        name: "Acme HVAC Services",
        slug: "acme-hvac",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Organization created:", organization.slug);

    console.log("🔐 Creating roles...");
    const ownerRole = await tx.organizationRole.create({
      data: {
        name: "Owner",
        permissions: [
          "org:manage",
          "org:delete",
          "members:manage",
          "roles:manage",
          "teams:manage",
          "jobs:manage",
          "customers:manage",
          "billing:manage",
          "settings:manage",
        ],
        isDefault: true,
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const _adminRole = await tx.organizationRole.create({
      data: {
        name: "Admin",
        permissions: [
          "members:manage",
          "teams:manage",
          "jobs:manage",
          "customers:manage",
          "settings:view",
        ],
        isDefault: true,
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const _memberRole = await tx.organizationRole.create({
      data: {
        name: "Member",
        permissions: [
          "jobs:view",
          "jobs:create",
          "customers:view",
          "customers:create",
        ],
        isDefault: true,
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Roles created: Owner, Admin, Member");

    console.log("👥 Creating teams...");
    const serviceTeam = await tx.organizationTeam.create({
      data: {
        name: "Service Team",
        icon: "wrench",
        color: "#3b82f6",
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const _salesTeam = await tx.organizationTeam.create({
      data: {
        name: "Sales Team",
        icon: "phone",
        color: "#10b981",
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const _installTeam = await tx.organizationTeam.create({
      data: {
        name: "Installation Team",
        icon: "hammer",
        color: "#f59e0b",
        organizationId: organization.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Teams created: Service, Sales, Installation");

    console.log("🔗 Adding user to organization...");
    await tx.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        roleId: ownerRole.id,
        teamId: serviceTeam.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ User added to organization with Owner role");
  });

  console.log("\n🎉 Seeding complete!");
  console.log("\n📝 Test credentials:");
  console.log("   Email: test@fieldjolt.com");
  console.log("   Password: password");
  console.log("   Organization: acme-hvac");
  console.log("\n🔗 Login at: http://localhost:3000/auth");
  console.log("🔗 Dashboard: http://localhost:3000/acme-hvac");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
