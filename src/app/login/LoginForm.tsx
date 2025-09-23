'use client';

import { useState } from "react";
import styles from "@/components/auth/Auth.module.css";   // 見出し/トグル等
import form from "./LoginForm.module.css";      // 入力UI
import Button from "@/components/ui/Button";

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}
export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  loading?: boolean;
  errorMessage?: string | null;
  successBanner?: string | null;
  defaultEmail?: string;
  variant?: "card" | "plain";
  hideTitle?: boolean;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  errorMessage = null,
  successBanner = null,
  defaultEmail = "",
  variant = "plain",
  hideTitle = true,
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // UI上は出さないが親API互換のため保持
  const remember = false;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    await onSubmit({ email, password, remember });
  };

  const Outer = ({ children }: { children: React.ReactNode }) =>
    variant === "card"
      ? (
        <div className={`${styles.center} section`}>
          <div className="container container--sm">
            <div className={styles.card}>{children}</div>
          </div>
        </div>
      )
      : <>{children}</>;

  return (
    <Outer>
      {!hideTitle || successBanner || errorMessage ? (
        <header className={styles.header} style={{ marginBottom: 12 }}>
          {!hideTitle && <h2 className="h2">ログイン</h2>}
          {successBanner && <div className={styles.success}>{successBanner}</div>}
          {errorMessage && <div className={styles.alert} role="alert">{errorMessage}</div>}
        </header>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={form.field}>
          <label htmlFor="email" className={form.label}>メールアドレス</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={form.input}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
        </div>

        <div className={form.field} style={{ position: "relative" }}>
          <label htmlFor="password" className={form.label}>パスワード</label>
          <input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className={form.input}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "パスワードを隠す" : "パスワードを表示"}
          >
            {showPw ? "非表示" : "表示"}
          </button>
        </div>

        <div className={form.forgotRow}>
          <a className={form.forgotLink} href="/password/forgot">パスワードを忘れた場合</a>
        </div>

        <div className={form.actions}>
          <Button type="submit" variant="primary" size="large" disabled={loading}>
            {loading ? "ログイン中..." : "ログインする"}
          </Button>
        </div>

        <div className={form.separator} />

        <div className={form.oauthStack}>
          <button type="button" className={`${styles.oauthBtn} ${styles.oauthGoogle}`}>G Googleでログイン</button>
          <button type="button" className={`${styles.oauthBtn} ${styles.oauthApple}`}> Appleでログイン</button>
        </div>

        <div className={form.bottomNote}>
          アカウントをお持ちでないですか？{" "}
          <a className={form.link} href="/signup">新規登録はこちら</a>
        </div>
      </form>
    </Outer>
  );
}
