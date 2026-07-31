import z from "zod";

const refillObj = z.object({
    name: z.string(),
    quantity: z.number().nonnegative("Estoques negativos não são aceitos."),
    category: z.string()
});

export const refillSchema = z.array(refillObj);