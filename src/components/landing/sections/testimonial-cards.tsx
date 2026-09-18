"use client";

import { Avatar, Box, Container, Grid, Text } from "@novacore/frontend-next-mui";
import MuiBox from "@mui/material/Box";
import { Quote } from "lucide-react";
import type { ReactNode } from "react";

import { Surface } from "@/components/landing/visual/surface";

export interface TestimonialCardsProps {
  items: { quote: string; name: string; role: string }[];
  intro: ReactNode;
}

export function TestimonialCards({ items, intro }: TestimonialCardsProps) {
  return (
    <MuiBox component="section" sx={{ py: { xs: 6, md: 10 } }}>
      <Container>
        {intro}
        <Grid columns={{ xs: 1, md: 3 }} gap={3}>
          {items.map((item) => (
            <Surface key={item.name} hoverable sx={{ p: 3.5, display: "flex", flexDirection: "column", gap: 2.5, height: "100%" }}>
              <MuiBox sx={{ color: "primary.main", display: "flex" }}>
                <Quote size={28} />
              </MuiBox>
              <Text sx={{ flex: 1 }}>{item.quote}</Text>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar fallback={item.name.charAt(0).toUpperCase()} alt={item.name} />
                <Box>
                  <Text weight="semibold" size="bodySmall">
                    {item.name}
                  </Text>
                  <Text size="bodySmall" color="muted">
                    {item.role}
                  </Text>
                </Box>
              </Box>
            </Surface>
          ))}
        </Grid>
      </Container>
    </MuiBox>
  );
}
