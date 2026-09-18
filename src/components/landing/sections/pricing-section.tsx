import MuiBox from "@mui/material/Box";
import { Badge, Box, Button, Container, Grid, Heading, Text } from "@novacore/frontend-next-mui";
import { Check } from "lucide-react";

import { Surface } from "@/components/landing/visual/surface";
import type { PricingPlan } from "@/mocks/pricing.mock";

import { SectionIntro } from "./section-intro";

export interface PricingSectionProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  perMonthLabel: string;
  mostPopularLabel: string;
  ctaLabel: string;
  plans: PricingPlan[];
}

/**
 * A genuinely new section — `frontend-next-mui` ships no pricing component (confirmed absent
 * during research). Fully server-rendered: no pricing decision needs client JS. Uses a plain
 * transparent `section` (not the library's opaque `Section`) so the page backdrop runs unbroken
 * behind it; the highlighted plan gets a tinted, glowing surface instead of just a border.
 */
export function PricingSection({ eyebrow, title, subtitle, perMonthLabel, mostPopularLabel, ctaLabel, plans }: PricingSectionProps) {
  return (
    <MuiBox component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <Grid columns={{ xs: 1, md: 3 }} gap={3} sx={{ alignItems: "stretch" }}>
          {plans.map((plan) => (
            <Surface
              key={plan.id}
              variant={plan.highlighted ? "tint" : "glass"}
              hoverable
              sx={{
                p: 3.5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderWidth: plan.highlighted ? 2 : 1,
                borderColor: plan.highlighted ? "primary.main" : undefined,
              }}
            >
              <Box>
                {plan.highlighted ? (
                  <Badge tone="primary" sx={{ mb: 1.5 }}>
                    {mostPopularLabel}
                  </Badge>
                ) : null}
                <Heading size="h4">{plan.name}</Heading>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 1 }}>
                  <Text as="span" weight="bold" sx={{ fontSize: "2.5rem", lineHeight: 1.1 }}>
                    {plan.price}
                  </Text>
                  <Text as="span" color="muted">
                    {perMonthLabel}
                  </Text>
                </Box>
                <Text color="muted" sx={{ mt: 1 }}>
                  {plan.description}
                </Text>
              </Box>
              <Box as="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 1.25, flex: 1 }}>
                {plan.features.map((feature) => (
                  <Box key={feature} as="li" sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <MuiBox sx={{ color: "primary.main", display: "flex" }}>
                      <Check size={16} />
                    </MuiBox>
                    <Text size="bodySmall">{feature}</Text>
                  </Box>
                ))}
              </Box>
              <Button fullWidth variant={plan.highlighted ? "primary" : "outline"}>
                {ctaLabel}
              </Button>
            </Surface>
          ))}
        </Grid>
      </Container>
    </MuiBox>
  );
}
