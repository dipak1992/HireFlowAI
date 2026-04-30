// src/lib/ab-testing.ts
// A/B test pricing variants via PostHog feature flags

export interface PricingVariant {
  id: "control" | "variant_a" | "variant_b";
  price: number;
  label: string;
  description: string;
}

export const PRICING_VARIANTS: Record<string, PricingVariant> = {
  control: {
    id: "control",
    price: 19,
    label: "$19/month",
    description: "Standard pricing",
  },
  variant_a: {
    id: "variant_a",
    price: 14,
    label: "$14/month",
    description: "Introductory pricing",
  },
  variant_b: {
    id: "variant_b",
    price: 24,
    label: "$24/month",
    description: "Premium pricing",
  },
};

/**
 * Get the pricing variant from a PostHog feature flag value.
 * Defaults to "control" if the flag is not set or unrecognized.
 */
export function getPricingVariant(featureFlag: string | boolean | undefined): PricingVariant {
  if (typeof featureFlag === "string" && featureFlag in PRICING_VARIANTS) {
    return PRICING_VARIANTS[featureFlag];
  }
  return PRICING_VARIANTS.control;
}
