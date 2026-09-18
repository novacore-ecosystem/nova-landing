"use client";

import { Dialog, DialogContent, DialogFooter, Form, FormField, PasswordField, TextField, Button, Text } from "@novacore/frontend-next-mui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useTranslation } from "@/i18n";
import { loginSchema, type LoginFormValues } from "@/features/auth/auth.schema";
import { useLoginMutation } from "@/features/auth/api/auth.queries";

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The header's "Log in" entry point (see the plan's decision: modal, not a separate route — this
 * is a single-page marketing site, visitors shouldn't have to navigate away). First real
 * `react-hook-form` + `zod` consumer in nova-landing; `TextField`/`PasswordField`
 * (`@novacore/frontend-next-mui`) are controlled `value`/`onChange(value)` components rather than
 * native-input `register()` targets, so fields are wired via `Controller`.
 */
export function LoginModal({ open, onClose }: LoginModalProps) {
  const { t } = useTranslation();
  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleClose() {
    loginMutation.reset();
    reset();
    onClose();
  }

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, { onSuccess: handleClose });
  });

  return (
    <Dialog open={open} onClose={handleClose} title={t("auth.login.title")} maxWidth="xs">
      <DialogContent>
        <Text size="bodySmall" color="muted" sx={{ mb: 2.5 }}>
          {t("auth.login.description")}
        </Text>
        <Form onSubmit={onSubmit}>
          <FormField label={t("auth.login.email")} htmlFor="login-email" error={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  id="login-email"
                  type="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  value={field.value}
                  onChange={field.onChange}
                  error={Boolean(errors.email)}
                  autoFocus
                />
              )}
            />
          </FormField>
          <FormField label={t("auth.login.password")} htmlFor="login-password" error={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordField id="login-password" value={field.value} onChange={field.onChange} error={Boolean(errors.password)} />
              )}
            />
          </FormField>
          {loginMutation.isError ? (
            <Text size="bodySmall" color="error">
              {t("auth.login.genericError")}
            </Text>
          ) : null}
          <DialogFooter>
            <Button type="submit" loading={loginMutation.isPending}>
              {t("auth.login.submit")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
