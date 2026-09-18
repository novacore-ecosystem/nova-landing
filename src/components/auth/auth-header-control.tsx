"use client";

import { Avatar, Box, Button, IconButton, Text } from "@novacore/frontend-next-mui";
import { LogOut } from "lucide-react";
import * as React from "react";

import { useTranslation } from "@/i18n";
import { useSessionStore } from "@/features/auth/store/session-store";
import { useLogoutMutation } from "@/features/auth/api/auth.queries";
import { LoginModal } from "@/components/auth/login-modal";

/**
 * The header's session-reactive slice — guest sees "Log in" (opens `LoginModal`), authenticated
 * sees their name + a logout control. Reads `useSessionStore` directly (no context), matching
 * nova-wcm/nova-console's convention (`usePermissionCheck` etc. do the same).
 */
export function AuthHeaderControl() {
  const { t } = useTranslation();
  const status = useSessionStore((state) => state.status);
  const user = useSessionStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const [loginOpen, setLoginOpen] = React.useState(false);

  if (status === "authenticated" && user) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar size="sm" fallback={user.name.charAt(0).toUpperCase()} alt={user.name} />
        <Text size="bodySmall" sx={{ display: { xs: "none", sm: "block" } }}>
          {user.name}
        </Text>
        <IconButton
          size="sm"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label={t("auth.nav.logout")}
        >
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
