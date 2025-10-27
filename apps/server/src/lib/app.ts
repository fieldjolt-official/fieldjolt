import { Hono } from "hono";
import { createFactory } from "hono/factory";
import type { HonoEnv } from "./types";

export const createApp = () => new Hono<HonoEnv>();

export const factory = createFactory<HonoEnv>();

export const createRouter = () => new Hono<HonoEnv>();
