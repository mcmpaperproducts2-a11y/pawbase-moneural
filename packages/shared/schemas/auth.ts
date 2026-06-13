import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1),
  rememberMe: z.boolean().default(false)
});

export type LoginInput = z.infer<typeof loginSchema>;
