"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../auth/Auth.module.css";
import Button from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

const API_BASE = "https://api.richpassapp.com";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "エラーが発生しました。";
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = useMemo(() => sp?.get("token") ?? "", [sp]);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError(null);

      if (!token) {
        setFormError("トークンが無効です。再度お試しください。");
        return;
      }
      if (!password || !password2) {
        setFormError("新しいパスワードを入力してください。");
        return;
      }
      if (password.length < 8) {
        setFormError("パスワードは8文字以上で設定してください。");
        return;
      }
      if (password !== password2) {
        setFormError("パスワードが一致しません。");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/password/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            password,
            password_confirmation: password2,
          }),
        });

        if (!res.ok) {
          let msg = "パスワードの更新に失敗しました。";
          try {
            const data = await res.json();
            if (data?.message) msg = data.message;
          } catch {}
          throw new Error(msg);
        }

        // 仕様通り：ログイン画面へ遷移（成功メッセージは /login で表示）
        router.replace("/login?success=password-updated");
      } catch (err: unknown) {
        setFormError(getErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [token, password, password2, router]
  );

  return (
    <div className={`${styles.center} section`}>
      <div className="container container--sm">
        <div className={styles.card}>
          {/* 戻るリンク */}
          <div className={styles.backRow}>
            <a href="/login" className={styles.backLink}>＜ ログイン画面に戻る</a>
          </div>

          <header className={styles.header}>
            <h2 className="h2">新しいパスワードの設定</h2>
            <p className={styles.subTextCenter}>
              新しいパスワードを入力してください。
            </p>
            {formError && <div className={styles.alert} role="alert">{formError}</div>}
          </header>

          <form onSubmit={onSubmit} noValidate className={styles.form}>
            <div className={styles.formRow}>
              <label htmlFor="password" className={styles.label}>新しいパスワード</label>
              <Input
                id="password"
                type="password"
                placeholder="8文字以上"
                autoComplete="new-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <div className={styles.formRow}>
              <label htmlFor="password2" className={styles.label}>新しいパスワード（確認用）</label>
              <Input
                id="password2"
                type="password"
                placeholder=""
                autoComplete="new-password"
                value={password2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword2(e.target.value)
                }
                required
              />
            </div>

            <div className={styles.actions}>
              <Button type="submit" variant="primary" size="large" disabled={submitting}>
                {submitting ? "更新中..." : "パスワードを再設定する"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
