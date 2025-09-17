"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import styles from "./PasswordPage.module.css";

/** パスワードの強度判定：0〜4 */
function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.max(0, Math.min(4, score));
}

/** 最低限のポリシー充足チェック（満たしていなければエラーメッセージ文字列を返す） */
function meetsPolicy(current: string, next: string): string | null {
  if (next.length < 8) return "8文字以上にしてください。";
  if (next === current) return "現在のパスワードと異なるものを設定してください。";
  const categories =
    (/[a-z]/.test(next) ? 1 : 0) +
    (/[A-Z]/.test(next) ? 1 : 0) +
    (/\d/.test(next) ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(next) ? 1 : 0);
  if (categories < 3) return "大文字・小文字・数字・記号のうち3種類以上を含めてください。";
  return null;
}

export default function PasswordForm() {
  const router = useRouter();

  // 入力値
  const [current, setCurrent] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirm, setConfirm] = useState("");

  // 触れたかどうか（初期表示で赤エラーを出さないためのフラグ）
  const [touched, setTouched] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const strength = useMemo(() => scorePassword(nextPw), [nextPw]);

  // 生の判定結果（画面表示に使うかどうかは touched で制御）
  const policyErrorRaw = useMemo(() => meetsPolicy(current, nextPw), [current, nextPw]);
  const confirmErrorRaw = useMemo(
    () => (confirm && nextPw !== confirm ? "新しいパスワードが一致しません。" : ""),
    [nextPw, confirm]
  );

  // 画面に表示するエラー（「触れた後」かつ入力がある時のみ）
  const policyError = touched.next && nextPw.length > 0 ? policyErrorRaw ?? undefined : undefined;
  const confirmError =
    touched.confirm && confirm.length > 0 ? (confirmErrorRaw || undefined) : undefined;

  // 送信可否（UI表示に依存せず、実際のエラーで判定）
  const canSubmit =
    current.length > 0 &&
    nextPw.length > 0 &&
    confirm.length > 0 &&
    !policyErrorRaw &&
    confirmErrorRaw === "";

  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      const res = await fetch("/api/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: nextPw }),
      });
      if (!res.ok) throw new Error("failed");
      router.push("/settings/password/success");
    } catch {
      alert("変更に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={`${styles.formWrap} ${styles.form}`} onSubmit={onSubmit}>
      <FormField
        label="現在のパスワード"
        inputProps={{
          type: "password",
          autoComplete: "current-password",
          value: current,
          onChange: (e) => setCurrent(e.target.value),
          onBlur: () => setTouched((t) => ({ ...t, current: true })),
        }}
      />

      <div>
        <FormField
          label="新しいパスワード"
          description="8文字以上／大文字・小文字・数字・記号のうち3種類以上を推奨"
          error={policyError}
          inputProps={{
            type: "password",
            autoComplete: "new-password",
            value: nextPw,
            onChange: (e) => setNextPw(e.target.value),
            onBlur: () => setTouched((t) => ({ ...t, next: true })),
          }}
        />
        {/* 強度メーター（入力が始まってから表示したい場合は nextPw.length > 0 で条件表示に） */}
        <div className={`${styles.meter} ${styles[`meter--${Math.max(1, strength)}`]}`}>
          <div
            className={styles.meterFill}
            style={{ width: `${(strength / 4) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      <FormField
        label="新しいパスワード（確認用）"
        error={confirmError}
        inputProps={{
          type: "password",
          autoComplete: "new-password",
          value: confirm,
          onChange: (e) => setConfirm(e.target.value),
          onBlur: () => setTouched((t) => ({ ...t, confirm: true })),
        }}
      />

      <div className={styles.actions}>
        <Button size="large" disabled={!canSubmit || saving} aria-busy={saving}>
          {saving ? "変更中…" : "パスワードを変更する"}
        </Button>
      </div>
    </form>
  );
}
