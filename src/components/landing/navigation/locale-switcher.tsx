"use client";

import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { usePathname } from "next/navigation";

import { LANDING_LOCALES, getLocaleMetadata } from "@/i18n/locale";
import { useTranslation } from "@/i18n";

/**
 * Renders real `<a>` links to the same page under each locale prefix (never a client-side content
 * swap) — every locale variant of a page stays its own crawlable URL, per the brief's SEO
 * requirement and cerebrum's locale-routing decision.
 */
export function LocaleSwitcher() {
  const pathname = usePathname();
  const { locale, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  function hrefFor(target: string): string {
    const rest = pathname.replace(/^\/[a-zA-Z-]+/, "");
    return `/${target}${rest || ""}`;
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("common.language.switchLabel")}
        aria-haspopup="menu"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", padding: "6px 8px" }}
      >
        {getLocaleMetadata(locale).nativeName}
      </button>
      <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {LANDING_LOCALES.map((candidate) => (
          <MuiMenuItem
            key={candidate}
            component="a"
            href={hrefFor(candidate)}
            selected={candidate === locale}
            onClick={() => setAnchorEl(null)}
          >
            {getLocaleMetadata(candidate).nativeName}
          </MuiMenuItem>
        ))}
      </MuiMenu>
    </>
  );
}
