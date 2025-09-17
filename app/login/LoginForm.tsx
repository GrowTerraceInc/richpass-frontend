"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../auth/Auth.module.css";
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

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // /login?success=password-updated → 成功バナー表示
  const successBanner = useMemo(() => {
    const s = sp?.get("success");
    if (s === "password-updated") {
      return "パスワードが更新されました。新しいパスワードでログインしてください。";
    }
    return null;
  }, [sp]);

  useEffect(() => {
    // 必要ならフォーカス制御など
  }, [successBanner]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormError(null);

      // クライアントサイドバリデーション
      if (!email || !password) {
        setFormError("メールアドレスとパスワードを入力してください。");
        return;
      }
      if (!isEmail(email)) {
        setFormError("メールアドレスの形式が正しくありません。");
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Cookieベース想定
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          let msg = "メールアドレスまたはパスワードが違います。";
          try {
            const data = await res.json();
            if (data?.message) msg = data.message;
          } catch {}
          throw new Error(msg);
        }

        router.replace("/");
      } catch (err: unknown) {
        setFormError(getErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, router]
  );

  return (
    <div className={`${styles.center} section`}>
      <div className="container container--sm">
        <div className={styles.card} role="region" aria-labelledby="login-heading">
          <header className={styles.header}>
            <h2 id="login-heading" className="h2">ログイン</h2>
            {successBanner && <div className={styles.success}>{successBanner}</div>}
            {formError && <div className={styles.alert} role="alert">{formError}</div>}
          </header>

          <form onSubmit={onSubmit} noValidate className={styles.form}>
            {/* メール */}
            <div className={styles.formRow}>
              <label htmlFor="email" className={styles.label}>メールアドレス</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* パスワード */}
            <div className={styles.formRow} style={{ position: "relative" }}>
              <label htmlFor="password" className={styles.label}>パスワード</label>
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

            {/* パスワード忘れ（右寄せ・詰めすぎ防止はCSSで） */}
            <div className={styles.forgotRow}>
              <a className={styles.forgotLink} href="/password/forgot">パスワードを忘れた場合</a>
            </div>

            {/* CTA */}
            <div className={styles.actions}>
              <Button type="submit" variant="primary" size="large" disabled={submitting}>
                {submitting ? "ログイン中..." : "ログインする"}
              </Button>
            </div>

            {/* 仕切り：「または」 */}
            <div className={styles.separator}>または</div>

            {/* OAuth（ダミー導線。本番導線に差し替えてください） */}
            <div className={styles.oauthStack}>
              <button type="button" className={`${styles.oauthBtn} ${styles.oauthGoogle}`}>
                G Googleでログイン
              </button>
              <button type="button" className={`${styles.oauthBtn} ${styles.oauthApple}`}>
                 Appleでログイン
              </button>
            </div>

            {/* 新規登録 */}
            <div className={styles.bottomNote}>
              アカウントをお持ちでないですか？{" "}
              <a className={styles.link} href="/register">新規登録はこちら</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
