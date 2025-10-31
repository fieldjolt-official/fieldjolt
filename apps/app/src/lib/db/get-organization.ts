import { cacheLife, cacheTag } from "next/cache";
import { prisma } from ".";

export async function getOrganizations(userId: string) {
  "use cache: private";

  cacheLife("default");
  cacheTag(`user-${userId}-orgs`);

  return await prisma.organizationMember.findMany({
    where: { userId },
    select: {
      organization: {
        select: { id: true, name: true, slug: true },
      },
      role: {
        select: { id: true, name: true, permissions: true },
      },
      team: {
        select: { id: true, name: true, icon: true, color: true },
      },
    },
  });
}

export type Organization = Awaited<ReturnType<typeof getOrganizations>>[number];
