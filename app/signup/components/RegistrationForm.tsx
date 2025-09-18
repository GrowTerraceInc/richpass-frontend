"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./RegistrationForm.module.css";
import Button from "@/app/components/ui/Button";

/** 0〜4 の強度スコア */
function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.max(0, Math.min(4, score));
}

/** サインアップ用のポリシー（8文字以上／4要素中3種以上） */
function meetsPolicy(pw: string): string | null {
  if (pw.length < 8) return "8文字以上にしてください。";
  const categories =
    (/[a-z]/.test(pw) ? 1 : 0) +  // 小文字
    (/[A-Z]/.test(pw) ? 1 : 0) +  // 大文字
    (/\d/.test(pw) ? 1 : 0) +     // 数字
    (/[^a-zA-Z0-9]/.test(pw) ? 1 : 0); // 記号
  if (categories < 3) return "大文字・小文字・数字・記号のうち3種類以上を含めてください。";
  return null;
}

export default function RegistrationForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  // 触れたかどうか（初期表示で赤エラーを出さない）
  const [touched, setTouched] = useState({ pw: false, pw2: false });

  const [agree, setAgree] = useState(false);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const nicknameOk = useMemo(() => nickname.trim().length > 0, [nickname]);

  const pwStrength = useMemo(() => scorePassword(pw), [pw]);
  const policyErrorRaw = useMemo(() => meetsPolicy(pw), [pw]);
  const policyError =
    touched.pw && pw.length > 0 ? policyErrorRaw ?? undefined : undefined;

  const confirmErrorRaw =
    pw2.length > 0 && pw !== pw2 ? "パスワードが一致しません。" : "";
  const confirmError =
    touched.pw2 && pw2.length > 0 ? confirmErrorRaw || undefined : undefined;

  const canSubmit =
    nicknameOk &&
    emailOk &&
    !policyErrorRaw &&
    confirmErrorRaw === "" &&
    agree;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: サインアップAPI呼び出し
    console.log("signup payload", { nickname, email, password: pw });
  };

  return (
    <section className={styles.wrap} aria-labelledby="signup-title">
      <div className={styles.inner}>
        <h1 id="signup-title" className={styles.title}>
          アカウント登録
        </h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* Nickname */}
          <div className={styles.field}>
            <label htmlFor="nickname" className={styles.label}>
              ニックネーム
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="コミュニティなどで使用します"
              className={styles.input}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              autoComplete="nickname"
              required
              aria-invalid={!nicknameOk && nickname.length > 0}
            />
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              aria-invalid={!emailOk && email.length > 0}
            />
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="8文字以上／大文字・小文字・数字・記号のうち3種類以上を推奨"
              className={styles.input}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
              autoComplete="new-password"
              required
              minLength={8}
              aria-invalid={!!policyError}
            />
            {/* 強度メーター（パスワード変更画面と同仕様） */}
            <div className={`${styles.meter} ${styles[`meter--${Math.max(1, pwStrength)}`]}`}>
              <div
                className={styles.meterFill}
                style={{ width: `${(pwStrength / 4) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            {policyError && <div className={styles.error}>{policyError}</div>}
          </div>

          {/* Password confirm */}
          <div className={styles.field}>
            <label htmlFor="password2" className={styles.label}>
              パスワード（確認用）
            </label>
            <input
              id="password2"
              name="password2"
              type="password"
              className={styles.input}
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, pw2: true }))}
              autoComplete="new-password"
              required
              aria-invalid={!!confirmError}
            />
            {confirmError && <div className={styles.error}>{confirmError}</div>}
          </div>

          {/* Agreements */}
          <label className={styles.agreeRow}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className={styles.checkbox}
              aria-required
            />
            <span>
              <Link href="/terms" className={styles.link} target="_blank">
                利用規約
              </Link>
              と
              <Link href="/privacy" className={styles.link} target="_blank">
                プライバシーポリシー
              </Link>
              に同意する
            </span>
          </label>

          {/* CTA */}
          <div className={styles.cta}>
            <Button variant="primary" size="large" disabled={!canSubmit}>
              同意して登録する
            </Button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>または</span>
          </div>

          {/* Socials */}
          <div className={styles.socials}>
            <button type="button" className={`${styles.socialBtn} ${styles.googleBtn}`}>
              <span className={styles.socialIconG}>G</span>
              Googleで登録
            </button>
            <button type="button" className={`${styles.socialBtn} ${styles.appleBtn}`}>
              <span className={styles.socialIconApple}></span>
              Appleで登録
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
