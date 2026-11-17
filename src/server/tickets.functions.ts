import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeTicket, type TierId } from "@/lib/ticketPricing";

const BookSchema = z.object({
  tier: z.enum(["adult", "student", "child", "senior", "family"]),
  qty: z.number().int().min(1).max(20),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const bookTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => BookSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Reject past dates
    const today = new Date().toISOString().slice(0, 10);
    if (data.visit_date < today) {
      throw new Error("Visit date cannot be in the past");
    }

    // Server-side canonical pricing — never trust client totals
    const { visitors, total } = computeTicket(data.tier as TierId, data.qty);

    const { error } = await supabase.from("tickets").insert({
      user_id: userId,
      visit_date: data.visit_date,
      visitors,
      total_amount: total,
      status: "confirmed",
    });
    if (error) throw new Error(error.message);

    return { success: true, visitors, total };
  });
