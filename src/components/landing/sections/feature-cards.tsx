"use client";

import { Container, Grid, Heading, Text } from "@novacore/frontend-next-mui";
import MuiBox from "@mui/material/Box";
import { Languages, MessageCircle, Rocket, Search, Smartphone, TrendingUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Surface } from "@/components/landing/visual/surface";

/** One icon per feature slot, in the mock's order — icons are presentation, so they live with the cards, not in the content source. */
const FEATURE_ICONS: LucideIcon[] = [Rocket, Smartphone, Search, MessageCircle, Languages, TrendingUp];

export interface FeatureCardsProps {
  items: { title: string; description: string }[];
  intro: ReactNode;
}

export function FeatureCards({ items, intro }: FeatureCardsProps) {
  return (
    <MuiBox component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        {intro}
        <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap={3}>
          {items.map((item, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length]!;
            return (
              <Surface key={item.title} hoverable sx={{ p: 3.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Surface variant="tint" sx={{ width: 48, height: 48, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main", boxShadow: "none" }}>
                  <Icon size={22} />
                </Surface>
                <Heading size="h4">{item.title}</Heading>
                <Text color="muted">{item.description}</Text>
              </Surface>
            );
          })}
        </Grid>
      </Container>
    </MuiBox>
  );
}
