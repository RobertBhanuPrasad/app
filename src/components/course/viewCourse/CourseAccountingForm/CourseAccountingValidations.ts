import { z } from "zod";

export const accountingValidationSchema = () => {
  return z.object({
    revenue: revenueValidationSchema,
  });
};

const revenueValidationSchema = z.array(
  z.object({
    deposit_date: z.date({
      required_error: "Deposit date is a required field",
    }),
    deposit_amount: z
      .string({
        required_error: "Deposit amount is a required field",
      })
      .nonempty({ message: "Deposit amount is a required field"})
      .regex(/^\d+(\.\d+)?$/, "Please enter a valid number")
      .or(z.number()),
    notes: z.string().optional(),
  })
);
