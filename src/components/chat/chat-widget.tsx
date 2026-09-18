"use client";

import { Avatar, Box, Button, IconButton, Text, TextField } from "@novacore/frontend-next-mui";
import MuiBox from "@mui/material/Box";
import { MessageCircle, Send, X } from "lucide-react";
import * as React from "react";

import { useTranslation } from "@/i18n";
import { useChat } from "@/features/chat/use-chat";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { Surface } from "@/components/landing/visual/surface";

/**
 * The one client component this whole subsystem needs — everything else (transport, analytics,
 * session storage, store) is plain TS the widget merely calls into via `useChat()`. Rendered once
 * from the root layout (see `[locale]/layout.tsx`), lazy in spirit: no network call happens until
 * the visitor actually opens it (session recovery excepted — see `useChat`'s mount effect).
 */
export function ChatWidget() {
  const { t } = useTranslation();
  const chat = useChat();
  const { status: sessionStatus, session } = useAuthSession();
  const isAuthenticated = sessionStatus === "authenticated";

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [draft, setDraft] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat.messages.length, chat.view]);

  if (chat.isRecovering) return null;

  async function handleStartConversation() {
    // Authenticated visitors are already identified by their session — no need to ask again
    // (the guest form's name/phone requirement doesn't apply, see `SignalRChatTransport`).
    if (!isAuthenticated && (!name.trim() || !phone.trim())) {
      setFormError(t("chat.form.nameAndPhoneRequired"));
      return;
    }
    setFormError(null);
    await chat.startConversation({ displayName: isAuthenticated ? (session?.user.displayName ?? "") : name, phone, email, reason });
  }

  async function handleSendMessage() {
    const content = draft;
    setDraft("");
    await chat.sendMessage(content);
  }

  const panelOpen = chat.view === "intro" || (chat.view === "conversation" && chat.session);

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1400, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5, maxWidth: "calc(100vw - 40px)" }}>
      {panelOpen ? (
        <Surface variant="solid" sx={{ width: 340, maxWidth: "100%", overflow: "hidden", borderRadius: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
            <Avatar size="sm" fallback="N" alt={t("hero.media.chatName")} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Text weight="semibold" size="bodySmall">
                {t("chat.intro.title")}
              </Text>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <MuiBox sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
                <Text size="bodySmall" color="muted">
                  {t("hero.media.chatStatus")}
                </Text>
              </Box>
            </Box>
            <IconButton size="sm" onClick={chat.close} aria-label={t("chat.launcher.close")}>
              <X size={16} />
            </IconButton>
          </Box>

          {chat.view === "intro" ? (
            <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Text size="bodySmall" color="muted">
                {t("chat.intro.description")}
              </Text>
              {isAuthenticated ? null : (
                <>
                  <TextField placeholder={t("chat.form.namePlaceholder")} value={name} onChange={setName} />
                  <TextField placeholder={t("chat.form.phonePlaceholder")} value={phone} onChange={setPhone} type="tel" />
                  <TextField placeholder={t("chat.form.emailPlaceholder")} value={email} onChange={setEmail} type="email" />
                </>
              )}
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
          ) : (
            <>
              <MuiBox ref={listRef} sx={{ height: 260, overflowY: "auto", px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                {chat.messages.map((message) => {
                  const mine = message.author === "visitor";
                  return (
                    <MuiBox
                      key={message.id}
                      sx={{
                        alignSelf: mine ? "flex-end" : "flex-start",
                        maxWidth: "82%",
                        px: 1.5,
                        py: 1,
                        borderRadius: 3,
                        borderBottomRightRadius: mine ? 4 : undefined,
                        borderBottomLeftRadius: mine ? undefined : 4,
                        bgcolor: mine ? "primary.main" : "action.hover",
                        color: mine ? "primary.contrastText" : "text.primary",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <Text size="bodySmall" sx={{ color: "inherit" }}>
                        {message.content}
                      </Text>
                    </MuiBox>
                  );
                })}
              </MuiBox>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
                <TextField placeholder={t("chat.conversation.messagePlaceholder")} value={draft} onChange={setDraft} disabled={chat.isSending} />
                <IconButton size="sm" onClick={handleSendMessage} disabled={chat.isSending || !draft.trim()} aria-label={t("chat.conversation.send")}>
                  <Send size={16} />
                </IconButton>
              </Box>
            </>
          )}
        </Surface>
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
