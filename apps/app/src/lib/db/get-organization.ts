import { cache } from "react";
import { prisma } from ".";

export const getOrganizations = cache(
  async (userId: string) =>
    await prisma.organizationMember.findMany({
      where: {
        userId,
      },
      select: {
        organization: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })
);
