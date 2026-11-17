// Canonical ticket pricing — shared between client display and server validation.
export type TierId = "adult" | "student" | "child" | "senior" | "family";

export const TICKET_PRICES: Record<TierId, { price: number; visitorsPerUnit: number }> = {
  adult:   { price: 500,  visitorsPerUnit: 1 },
  student: { price: 300,  visitorsPerUnit: 1 },
  child:   { price: 200,  visitorsPerUnit: 1 },
  senior:  { price: 250,  visitorsPerUnit: 1 },
  family:  { price: 1400, visitorsPerUnit: 4 },
};

export function computeTicket(tier: TierId, qty: number) {
  const cfg = TICKET_PRICES[tier];
  if (!cfg) throw new Error("Invalid ticket tier");
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new Error("Quantity must be 1–20");
  return {
    visitors: cfg.visitorsPerUnit * qty,
    total: cfg.price * qty,
  };
}
