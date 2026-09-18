"use client";

import MuiBox from "@mui/material/Box";
import { Container, Heading, Text } from "@novacore/frontend-next-mui";

import { Surface } from "@/components/landing/visual/surface";

export interface StatsBandProps {
  items: { value: string; label: string }[];
}

/** Trust numbers as one glass panel (2 columns on phones, one row from `md`) — replaces the library's bare, non-responsive stats row with the same data and order. */
export function StatsBand({ items }: StatsBandProps) {
  return (
    <MuiBox component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container>
        <Surface sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
          <MuiBox sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: `repeat(${items.length}, 1fr)` }, gap: { xs: 3, md: 0 } }}>
            {items.map((item, index) => (
              <MuiBox
                key={item.label}
                sx={{ textAlign: "center", px: 2, borderLeft: { md: index === 0 ? "none" : "1px solid" }, borderColor: "divider" }}
              >
                <Heading size="h1" align="center" sx={{ color: "primary.main" }}>
                  {item.value}
                </Heading>
                <Text color="muted" align="center" size="bodySmall">
                  {item.label}
                </Text>
              </MuiBox>
            ))}
          </MuiBox>
        </Surface>
      </Container>
    </MuiBox>
  );
}
