import { z } from "zod";

export const WashingMachineSchema = z.object({
  _id: z.string().min(1),
  label: z.string().min(1),
});

export type WashingMachine = z.infer<typeof WashingMachineSchema>;