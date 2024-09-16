import { z } from "zod";

export const AccountPrivilegesSchema = z.enum(['admin', 'user']);

export type AccountPrivileges = z.infer<typeof AccountPrivilegesSchema>;

export const AccountSchema = z.object({
  email: z.string(),
  priviledge: AccountPrivilegesSchema,
})

export type Account = z.infer<typeof AccountSchema>;