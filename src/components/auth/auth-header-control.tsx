"use client";

import { Avatar, Box, Button, IconButton, Text } from "@novacore/frontend-next-mui";
import { LogOut } from "lucide-react";
import * as React from "react";

import { useTranslation } from "@/i18n";
import { authSession, useAuthSession } from "@/features/auth/use-auth-session";
import { LoginModal } from "@/components/auth/login-modal";

/**
 * The header's session-reactive slice — guest sees "Log in" (opens `LoginModal`), authenticated
 * sees their name + a logout control. State comes from `frontend-foundation`'s shared auth session.
 */
export function AuthHeaderControl() {
  const { t } = useTranslation();
  const { status, session, loading } = useAuthSession();
  const [loginOpen, setLoginOpen] = React.useState(false);

  if (status === "authenticated" && session) {
    const name = session.user.displayName;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar size="sm" fallback={name.charAt(0).toUpperCase()} alt={name} />
        <Text size="bodySmall" sx={{ display: { xs: "none", sm: "block" } }}>
          {name}
        </Text>
        <IconButton size="sm" onClick={() => void authSession.logout()} disabled={loading} aria-label={t("auth.nav.logout")}>
          <LogOut size={16} />
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)}>
        {t("auth.nav.login")}
      </Button>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
