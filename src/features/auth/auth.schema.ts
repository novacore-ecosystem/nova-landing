import { z } from "zod";

/** Messages are translation keys (resolved with `t()` at render) so validation copy follows the Bootstrap → frontend translation priority like all other text. */
export const loginSchema = z.object({
  email: z.string().min(1, "auth.validation.emailRequired").email("auth.validation.emailInvalid"),
  password: z.string().min(1, "auth.validation.passwordRequired"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
