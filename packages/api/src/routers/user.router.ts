import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  organizations: protectedProcedure.query(async ({ ctx }) => {
    const organizations = await ctx.prisma.organizationMember.findMany({
      where: {
        userId: ctx.user.id,
      },
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
    return organizations;
  }),
});
