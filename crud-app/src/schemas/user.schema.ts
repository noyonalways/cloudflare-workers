import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.email().max(255),
});

export const updateUserSchema = createUserSchema.partial().refine(
  (data) => data.username !== undefined || data.email !== undefined,
  { message: "At least one of username or email is required" }
);

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
