import { Badge, Box, Heading, Text } from "@novacore/frontend-next-mui";

export interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

/** The shared eyebrow / title / subtitle block every content section opens with — one hierarchy instead of each section improvising its own. */
export function SectionIntro({ eyebrow, title, subtitle }: SectionIntroProps) {
  return (
    <Box sx={{ textAlign: "center", maxWidth: 680, mx: "auto", mb: { xs: 5, md: 7 }, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
      {eyebrow ? <Badge tone="primary">{eyebrow}</Badge> : null}
      <Heading size="h2" align="center">
        {title}
      </Heading>
      {subtitle ? (
        <Text color="muted" align="center" size="bodyLarge">
          {subtitle}
        </Text>
      ) : null}
    </Box>
  );
}
