import { Badge, Box, Button, Card, CardContent, CardFooter, CardHeader, Container, Grid, Heading, Section, Text } from "@novacore/frontend-next-mui";

import type { PricingPlan } from "@/mocks/pricing.mock";

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
 * during research). Fully server-rendered: no pricing decision needs client JS. Kept as a
 * dedicated file since it's a real, independent composition, not a one-off page fragment.
 */
export function PricingSection({ eyebrow, title, subtitle, perMonthLabel, mostPopularLabel, ctaLabel, plans }: PricingSectionProps) {
  return (
    <Section padding="lg">
      <Container>
        <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto" }}>
          <Text size="bodySmall" weight="semibold" color="primary" sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {eyebrow}
          </Text>
          <Heading size="h2" align="center" sx={{ mt: 1 }}>
            {title}
          </Heading>
          <Text color="muted" align="center" sx={{ mt: 1.5 }}>
            {subtitle}
          </Text>
        </Box>

        <Grid columns={{ xs: 1, md: 3 }} sx={{ mt: 6, alignItems: "stretch" }}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              hoverable
              sx={{ display: "flex", flexDirection: "column", border: "2px solid", borderColor: plan.highlighted ? "primary.main" : "divider" }}
            >
              <CardHeader>
                {plan.highlighted ? (
                  <Badge tone="primary" sx={{ mb: 1.5 }}>
                    {mostPopularLabel}
                  </Badge>
                ) : null}
                <Heading size="h4">{plan.name}</Heading>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: 1 }}>
                  <Text as="span" weight="bold" sx={{ fontSize: "2rem" }}>
                    {plan.price}
                  </Text>
                  <Text as="span" color="muted">
                    {perMonthLabel}
                  </Text>
                </Box>
                <Text color="muted" sx={{ mt: 1 }}>
                  {plan.description}
                </Text>
              </CardHeader>
              <CardContent sx={{ flex: 1 }}>
                <Box as="ul" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 1 }}>
                  {plan.features.map((feature) => (
                    <Box key={feature} as="li">
                      <Text size="bodySmall">{feature}</Text>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant={plan.highlighted ? "primary" : "outline"}>
                  {ctaLabel}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
