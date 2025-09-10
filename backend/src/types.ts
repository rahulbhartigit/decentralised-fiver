import z from "zod";

export const createTaskInput = z.object({
  options: z
    .array(
      z.object({
        imageUrl: z.string(),
      })
    )
    .min(2),
  title: z.string().optional(),
  payment_signature: z.string(),
});

export const createSubmissionInput = z.object({
  taskId: z.string(),
  selection: z.string(),
});
