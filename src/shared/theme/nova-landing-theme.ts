import type { ThemeConfig } from "@novacore/frontend-next-mui/theme";

/**
 * nova-landing's own visual identity — deliberately not reusing `nova-console`'s or `nova-wcm`'s
 * admin themes (different product family, different design system package: those are shadcn-based
 * admin chrome, this is the mui-based customer-facing theme). Each future customer clone overrides
 * this file (or its `preset`/`overrides`) for their own branding — see the brief's "Customer Clone
 * Strategy" — while keeping every other provider/section/chat file unchanged.
 *
 * TODO: Once WCM/Bootstrap ships real per-tenant theme tokens (see cerebrum: today only
 * `logoUrl`/`faviconUrl`/`siteName` exist), merge that data into `overrides` here instead of a
 * static preset.
 */
export const NOVA_LANDING_THEME: ThemeConfig = {
  preset: "indigo",
  mode: "system",
  style: "modern",
  radius: "medium",
  density: "comfortable",
};
