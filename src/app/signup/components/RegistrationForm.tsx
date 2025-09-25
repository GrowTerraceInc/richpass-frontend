'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './RegistrationForm.module.css';
import Button from '@/components/ui/Button';
import { register as doRegister, useAuth } from '@/lib/useAuth';
import { scorePassword, passwordPolicyError } from '@/lib/password';

type FieldErrors = Record<string, string[]>;

export default function RegistrationForm() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState(false);

  // 触れたかどうか（初期表示で赤エラーを出さない）
  const [touched, setTouched] = useState({ pw: false, pw2: false });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const { refresh } = useAuth();

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const nicknameOk = useMemo(() => nickname.trim().length > 0, [nickname]);

  // 共通ユーティリティで統一
  const pwStrength = useMemo(() => scorePassword(pw), [pw]);
  const policyErrorRaw = useMemo(() => passwordPolicyError(pw), [pw]);
  const policyError =
    touched.pw && pw.length > 0 ? policyErrorRaw ?? undefined : undefined;

  const confirmErrorRaw =
    pw2.length > 0 && pw !== pw2 ? 'パスワードが一致しません。' : '';
  const confirmError =
    touched.pw2 && pw2.length > 0 ? confirmErrorRaw || undefined : undefined;

  const canSubmit =
    nicknameOk &&
    emailOk &&
    !policyErrorRaw &&
    confirmErrorRaw === '' &&
    agree;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setErrors(null);
    setMsg(null);

    const res = await doRegister({
      name: nickname, // APIは name を想定
      email,
      password: pw,
      password_confirmation: pw2,
      agree,
    });

    setSubmitting(false);

    if (res.ok) {
      await refresh();
      setMsg('登録に成功しました。認証メールを確認してください。');
      // 仕様通り：メール送信画面へ
      window.location.assign('/signup/email-sent');
      return;
    }

    setErrors(res.fieldErrors ?? null);
    setMsg(res.message ?? '登録に失敗しました。しばらくしてから再度お試しください。');
  }

  return (
    <section className={styles.wrap} aria-labelledby="signup-title">
      <div className={styles.inner}>
        <h1 id="signup-title" className={styles.title}>アカウント登録</h1>

        {msg && <div className={styles.alert} role="alert">{msg}</div>}

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {/* Nickname */}
          <div className={styles.field}>
            <label htmlFor="nickname" className={styles.label}>ニックネーム</label>
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
            {errors?.name && <div className={styles.error}>{errors.name.join(' ')}</div>}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>メールアドレス</label>
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
            {errors?.email && <div className={styles.error}>{errors.email.join(' ')}</div>}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>パスワード</label>
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
            {/* 強度メーター（resetと同仕様・共通色） */}
            <div className={`${styles.meter} ${styles[`meter--${Math.max(1, pwStrength)}`]}`}>
              <div
                className={styles.meterFill}
                style={{ width: `${(pwStrength / 4) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            {/* ポリシー未達（3種類以上/8文字以上） */}
            {policyError && <div className={styles.error}>{policyError}</div>}
            {/* API由来のパスワードエラー（422など） */}
            {errors?.password && <div className={styles.error}>{errors.password.join(' ')}</div>}
          </div>

          {/* Password confirm */}
          <div className={styles.field}>
            <label htmlFor="password2" className={styles.label}>パスワード（確認用）</label>
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
              <Link href="/terms" className={styles.link} target="_blank">利用規約</Link>
              と
              <Link href="/privacy" className={styles.link} target="_blank">プライバシーポリシー</Link>
              に同意する
            </span>
          </label>
          {errors?.agree && <div className={styles.error}>{errors.agree.join(' ')}</div>}

          {/* CTA */}
          <div className={styles.cta}>
            <Button variant="primary" size="large" disabled={!canSubmit || submitting}>
              {submitting ? '送信中…' : '同意して登録する'}
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
