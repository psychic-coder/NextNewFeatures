import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content must atleast of 1 character" })
    .max(300, { message: "Content must be no longer then 300 characters" }),
});
