import { z } from "zod";

export const accountingValidationSchema = () => {
  return z.object({
    amount: z.string({ required_error: "amount required" }),
    revenue: revenueValidationSchema,
  });
};

const revenueValidationSchema = z.array(
  z.object({
    deposit_date: z.date({
      required_error: "deposit date is required field.",
    }),
    deposit_amount: z
      .string({
        required_error: "Deposit Amount is required field",
      })
      .nonempty({ message: "Amount is required field" })
      .regex(/^\d+(\.\d+)?$/, "Please enter a valid money value.")
      .or(z.number()),
    notes: z.string().optional(),
  })
);
