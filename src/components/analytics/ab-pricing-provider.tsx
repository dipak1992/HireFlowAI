"use client";

// src/components/analytics/ab-pricing-provider.tsx
// PostHog feature flag provider for A/B pricing experiment

import { createContext, useContext, useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { getPricingVariant, type PricingVariant } from "@/lib/ab-testing";

interface PricingContextValue {
  variant: PricingVariant;
  isLoading: boolean;
}

const PricingContext = createContext<PricingContextValue>({
  variant: {
    id: "control",
    price: 19,
    label: "$19/month",
    description: "Standard pricing",
  },
  isLoading: true,
});

export function ABPricingProvider({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  const [variant, setVariant] = useState<PricingVariant>(getPricingVariant(undefined));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!posthog) {
      setIsLoading(false);
      return;
    }

    // Check if flags are already loaded
    const flag = posthog.getFeatureFlag("pricing-experiment");
    if (flag !== undefined) {
      setVariant(getPricingVariant(flag));
      setIsLoading(false);
      return;
    }

    // Wait for flags to load
    posthog.onFeatureFlags(() => {
      const resolvedFlag = posthog.getFeatureFlag("pricing-experiment");
      setVariant(getPricingVariant(resolvedFlag));
      setIsLoading(false);
    });
  }, [posthog]);

  return (
    <PricingContext.Provider value={{ variant, isLoading }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricingVariant(): PricingContextValue {
  return useContext(PricingContext);
}
