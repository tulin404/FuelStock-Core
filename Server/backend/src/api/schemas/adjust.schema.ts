import z from "zod";

const adjustObj = z.object({
    id: z.uuid(),
    change: z.number(),
    newStock: z.number().nonnegative()
});

export const adjustSchema = z.array(adjustObj);