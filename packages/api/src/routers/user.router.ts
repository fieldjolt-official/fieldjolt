import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const userData = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        organizations: {
          include: {
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
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    return userData;
  }),
});
