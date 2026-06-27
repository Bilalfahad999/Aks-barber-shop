export const SERVICE_PRICES: Record<string, number> = {
  "Classic Haircut": 40,
  "Skin Fade": 50,
  "Beard Trim": 25,
  "Hair + Beard Combo": 60,
  "Kids Cut": 30,
  "Luxury Hot Towel Shave": 45,
  "Hair Wash": 15,
  "VIP Grooming Package": 90,
};

export function calcTotal(services: string[]): number {
  return services.reduce((sum, s) => sum + (SERVICE_PRICES[s] ?? 0), 0);
}

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  total: number;
  offerLabel: string | null;
}

export function calcWithOffer(
  services: string[],
  offer?: { type: string; value: string } | null
): PriceBreakdown {
  const subtotal = calcTotal(services);
  if (!offer) return { subtotal, discount: 0, total: subtotal, offerLabel: null };

  if (offer.type === "discount") {
    const pct = parseFloat(offer.value.replace("%", ""));
    if (!isNaN(pct)) {
      const discount = Math.round(subtotal * pct) / 100;
      return { subtotal, discount, total: subtotal - discount, offerLabel: offer.value + " off" };
    }
  }
  if (offer.type === "free_service") {
    return { subtotal, discount: 0, total: subtotal, offerLabel: offer.value };
  }
  return { subtotal, discount: 0, total: subtotal, offerLabel: offer.value };
}
