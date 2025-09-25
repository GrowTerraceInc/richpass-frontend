'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/auth/Auth.module.css";   // 見出し/トグル等
import form from "./LoginForm.module.css";                // 入力UI
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/useAuth";

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}
export interface LoginFormProps {
  /** 親で独自処理したい場合だけ渡す。未指定なら内部で doLogin→refresh→nextPath へ遷移 */
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  loading?: boolean;
  errorMessage?: string | null;
  successBanner?: string | null;
  defaultEmail?: string;
  variant?: "card" | "plain";
  hideTitle?: boolean;
  /** /login?next=... に相当。親（LoginContent）から渡す */
  nextPath?: string;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  errorMessage = null,
  successBanner = null,
  defaultEmail = "",
  variant = "plain",
  hideTitle = true,
  nextPath = "/home",
}: LoginFormProps) {
  const router = useRouter();
  const { doLogin, refresh } = useAuth(); // doLogin(email, password)

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // UI上は出さないが親API互換のため保持
  const remember = false;

  const isBusy = loading || localLoading;
  const mergedError = errorMessage ?? localError;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    setLocalError(null);
    setLocalLoading(true);
    try {
      if (onSubmit) {
        // 親側に委譲（外で doLogin 済みでもOK）
        await onSubmit({ email, password, remember });
      } else {
        // ← 修正ポイント：オブジェクトでなく 2 引数で渡す
        await doLogin(email, password);
        // セッション確定（/api/me を取り直して user を更新）
        await refresh();
        // nextPath を尊重して遷移
        router.replace(nextPath);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "ログインに失敗しました。メールアドレスとパスワードをご確認ください。";
      setLocalError(msg);
    } finally {
      setLocalLoading(false);
    }
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
      {!hideTitle || successBanner || mergedError ? (
        <header className={styles.header} style={{ marginBottom: 12 }}>
          {!hideTitle && <h2 className="h2">ログイン</h2>}
          {successBanner && <div className={styles.success}>{successBanner}</div>}
          {mergedError && <div className={styles.alert} role="alert">{mergedError}</div>}
        </header>
      ) : null}

      <form onSubmit={handleSubmit} noValidate className={styles.form} aria-busy={isBusy}>
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
            disabled={isBusy}
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
            disabled={isBusy}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "パスワードを隠す" : "パスワードを表示"}
            disabled={isBusy}
          >
            {showPw ? "非表示" : "表示"}
          </button>
        </div>

        <div className={form.forgotRow}>
          <a className={form.forgotLink} href="/password/forgot">パスワードを忘れた場合</a>
        </div>

        <div className={form.actions}>
          <Button type="submit" variant="primary" size="large" disabled={isBusy}>
            {isBusy ? "ログイン中..." : "ログインする"}
          </Button>
        </div>

        <div className={form.separator} />

        <div className={form.oauthStack}>
          <button type="button" className={`${styles.oauthBtn} ${styles.oauthGoogle}`} disabled={isBusy}>
            G Googleでログイン
          </button>
          <button type="button" className={`${styles.oauthBtn} ${styles.oauthApple}`} disabled={isBusy}>
             Appleでログイン
          </button>
        </div>

        <div className={form.bottomNote}>
          アカウントをお持ちでないですか？{" "}
          <a className={form.link} href="/signup">新規登録はこちら</a>
        </div>
      </form>
    </Outer>
  );
}
