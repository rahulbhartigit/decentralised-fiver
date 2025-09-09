import z from "zod";
export declare const createTaskInput: z.ZodObject<{
    options: z.ZodArray<z.ZodObject<{
        imageUrl: z.ZodString;
    }, z.core.$strip>>;
    title: z.ZodOptional<z.ZodString>;
    payment_signature: z.ZodString;
}, z.core.$strip>;
export declare const createSubmissionInput: z.ZodObject<{
    taskId: z.ZodString;
    selection: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=types.d.ts.map