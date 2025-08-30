import { sign } from "jsonwebtoken";
import z from "zod";

export const createTaskInput = z.object({
  options: z.array(
    z.object({
      imageUrl: z.string(),
    })
  ),
  title: z.string().optional(),
  payment_signature: z.string(),
});
