import { cache } from "react";
import { prisma } from ".";

export const getOrganizationAccess = cache(
  async (userId: string, organizationSlug: string) =>
    await prisma.organizationMember.findFirst({
      where: {
        userId,
        organization: {
          slug: organizationSlug,
        },
      },
    })
);
