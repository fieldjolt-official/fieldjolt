import type { PrismaClient } from "@fieldjolt/db";
import { initTRPC, TRPCError } from "@trpc/server";
import type { User } from "better-auth";
import superjson from "superjson";
import { ZodError } from "zod";

export type Context = {
  prisma: PrismaClient;
  user: User | null;
};

export const createTRPCContext = async (opts: {
  prisma: PrismaClient;
  user: User | null;
}): Promise<Context> => ({
  prisma: opts.prisma,
  user: opts.user,
});

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
