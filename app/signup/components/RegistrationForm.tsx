// app/signup/components/RegistrationForm.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./RegistrationForm.module.css";
import Button from "@/app/components/ui/Button";

export default function RegistrationForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const passwordOk = useMemo(() => pw.length >= 8, [pw]);
  const matchOk = useMemo(() => pw === pw2 && pw2.length > 0, [pw, pw2]);
  const nicknameOk = useMemo(() => nickname.trim().length > 0, [nickname]);

  const canSubmit = nicknameOk && emailOk && passwordOk && matchOk && agree;

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
              placeholder=""
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
              placeholder="8文字以上"
              className={styles.input}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
              aria-invalid={!passwordOk && pw.length > 0}
            />
            <p className={styles.hint}>英数字8文字以上を推奨</p>
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
              placeholder=""
              className={styles.input}
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
              required
              aria-invalid={!matchOk && pw2.length > 0}
            />
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
