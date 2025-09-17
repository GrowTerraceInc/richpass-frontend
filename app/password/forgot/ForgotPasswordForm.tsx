"use client";

import { useCallback, useState } from "react";
import styles from "../../auth/Auth.module.css";
import Button from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

const API_BASE = "https://api.richpassapp.com";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "エラーが発生しました。";
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError(null);

      if (!email) {
        setFormError("メールアドレスを入力してください。");
        return;
      }
      if (!isEmail(email)) {
        setFormError("メールアドレスの形式が正しくありません。");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/password/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          let msg = "送信に失敗しました。時間をおいて再度お試しください。";
          try {
            const data = await res.json();
            if (data?.message) msg = data.message;
          } catch {}
          throw new Error(msg);
        }
        setDone(true);
      } catch (err: unknown) {
        setFormError(getErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [email]
  );

  return (
    <div className={`${styles.center} section`}>
      <div className="container container--sm">
        <div className={styles.card}>
          {/* 戻るリンク */}
          <div className={styles.backRow}>
            <a href="/login" className={styles.backLink}>
              ＜ ログイン画面に戻る
            </a>
          </div>

          <header className={styles.header}>
            <h2 className="h2">パスワードの再設定</h2>
            <p className={styles.subTextCenter}>
              ご登録のメールアドレスを入力してください。<br />
              パスワード再設定用のリンクをお送りします。
            </p>
            {formError && <div className={styles.alert} role="alert">{formError}</div>}
            {done && (
              <div className={styles.success}>
                メールアドレスに再設定用のリンクを送信しました。
              </div>
            )}
          </header>

          {!done && (
            <form onSubmit={onSubmit} noValidate className={styles.form}>
              <div className={styles.formRow}>
                <label htmlFor="email" className={styles.label}>メールアドレス</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className={styles.actions}>
                <Button type="submit" variant="primary" size="large" disabled={submitting}>
                  {submitting ? "送信中..." : "再設定リンクを送信する"}
                </Button>
              </div>
            </form>
          )}

          {done && (
            <div className={styles.actions}>
              <a href="/login" className={styles.link}>ログイン画面に戻る</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
