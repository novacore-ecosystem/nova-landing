"use client";

import { Box, Button, IconButton, Text, TextField } from "@novacore/frontend-next-mui";
import { MessageCircle, Send, X } from "lucide-react";
import * as React from "react";

import { useTranslation } from "@/i18n";
import { useChat } from "@/features/chat/use-chat";

/**
 * The one client component this whole subsystem needs — everything else (transport, analytics,
 * session storage, store) is plain TS the widget merely calls into via `useChat()`. Rendered once
 * from the root layout (see `[locale]/layout.tsx`), lazy in spirit: no network call happens until
 * the visitor actually opens it (session recovery excepted — see `useChat`'s mount effect).
 */
export function ChatWidget() {
  const { t } = useTranslation();
  const chat = useChat();

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);

  if (chat.isRecovering) return null;

  async function handleStartConversation() {
    if (!name.trim() || !phone.trim()) {
      setFormError(t("chat.form.nameAndPhoneRequired"));
      return;
    }
    setFormError(null);
    await chat.startConversation({ displayName: name, phone, email, reason });
  }

  async function handleSendMessage() {
    const content = draft;
    setDraft("");
    await chat.sendMessage(content);
  }

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1400, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5 }}>
      {chat.view === "intro" ? (
        <Box sx={{ width: 300, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", boxShadow: 6, p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Text weight="semibold">{t("chat.intro.title")}</Text>
            <IconButton size="sm" onClick={chat.close} aria-label={t("chat.launcher.close")}>
              <X size={16} />
            </IconButton>
          </Box>
          <Text size="bodySmall" color="muted" sx={{ mb: 2 }}>
            {t("chat.intro.description")}
          </Text>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField placeholder={t("chat.form.namePlaceholder")} value={name} onChange={setName} />
            <TextField placeholder={t("chat.form.phonePlaceholder")} value={phone} onChange={setPhone} type="tel" />
            <TextField placeholder={t("chat.form.emailPlaceholder")} value={email} onChange={setEmail} type="email" />
            <TextField placeholder={t("chat.form.reasonPlaceholder")} value={reason} onChange={setReason} />
            {formError ? (
              <Text size="bodySmall" color="error">
                {formError}
              </Text>
            ) : null}
            <Button onClick={handleStartConversation} loading={chat.isSending}>
              {t("chat.form.submit")}
            </Button>
          </Box>
        </Box>
      ) : null}

      {chat.view === "conversation" && chat.session ? (
        <Box sx={{ width: 300, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", boxShadow: 6, p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            placeholder={t("chat.conversation.messagePlaceholder")}
            value={draft}
            onChange={setDraft}
            disabled={chat.isSending}
          />
          <IconButton size="sm" onClick={handleSendMessage} disabled={chat.isSending || !draft.trim()} aria-label={t("chat.conversation.send")}>
            <Send size={16} />
          </IconButton>
        </Box>
      ) : null}

      {chat.error ? (
        <Text size="bodySmall" color="error" align="right" sx={{ maxWidth: 280 }}>
          {chat.error === "startFailed" ? t("chat.errors.startFailed") : t("chat.errors.sendFailed")}
        </Text>
      ) : null}

      <IconButton
        onClick={chat.view === "closed" ? chat.open : chat.close}
        aria-label={chat.view === "closed" ? t("chat.launcher.open") : t("chat.launcher.close")}
        sx={{ width: 56, height: 56, bgcolor: "primary.main", color: "primary.contrastText", boxShadow: 6, "&:hover": { bgcolor: "primary.dark" } }}
      >
        {chat.view === "closed" ? <MessageCircle size={22} /> : <X size={22} />}
      </IconButton>
    </Box>
  );
}
