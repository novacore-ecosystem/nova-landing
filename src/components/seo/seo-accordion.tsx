import MuiBox from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface SeoAccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface SeoAccordionProps {
  items: SeoAccordionItem[];
  /** First item starts open — good for above-the-fold FAQ where at least one answer should be visible without any interaction. */
  defaultOpenFirst?: boolean;
}

/**
 * Reusable SEO-friendly accordion (see the brief's "SEO-Friendly Interactive Design" requirement:
 * important content must exist in the initial HTML even before JS runs). Built on the native
 * `<details>`/`<summary>` elements instead of a JS-driven MUI Accordion (frontend-next-mui ships
 * none anyway — see cerebrum's confirmed gap): every question AND answer is real, crawlable,
 * always-in-the-DOM HTML — expand/collapse is a zero-JS browser feature, keyboard- and
 * screen-reader-accessible by default, and degrades to nothing (still fully readable) if CSS/JS
 * fails to load. No "use client" needed anywhere in this component.
 */
export function SeoAccordion({ items, defaultOpenFirst = true }: SeoAccordionProps) {
  return (
    <MuiBox component="div" sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {items.map((item, index) => (
        <MuiBox
          key={item.id}
          component="details"
          open={defaultOpenFirst && index === 0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            px: 2.5,
            py: 1.5,
            "&[open] summary .seo-accordion-icon": { transform: "rotate(180deg)" },
          }}
        >
          <MuiBox
            component="summary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              cursor: "pointer",
              fontWeight: 600,
              listStyle: "none",
              "&::-webkit-details-marker": { display: "none" },
            }}
          >
            {item.question}
            <ExpandMoreIcon className="seo-accordion-icon" fontSize="small" sx={{ transition: "transform 0.2s ease", flexShrink: 0 }} />
          </MuiBox>
          <MuiBox sx={{ pt: 1.5, color: "text.secondary", lineHeight: 1.6 }}>{item.answer}</MuiBox>
        </MuiBox>
      ))}
    </MuiBox>
  );
}
