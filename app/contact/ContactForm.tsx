"use client";

import { useMemo, useState } from "react";
import Button from "@/app/components/ui/Button";
import styles from "./ContactPage.module.css";

type Props = {
  prefillType?: string;   // 外部入力は string 想定（あとで正規化）
  prefailEmail?: string;
};

/* お問い合わせ種別のユニオン型と定数 */
const CONTACT_TYPES = ["general", "billing", "bug", "feature"] as const;
type ContactType = typeof CONTACT_TYPES[number];

const TYPE_LABELS: Record<ContactType, string> = {
  general: "一般",
  billing: "課金 / 請求",
  bug: "不具合",
  feature: "機能要望",
};

function normalizeType(v?: string): ContactType {
  return CONTACT_TYPES.includes(v as ContactType) ? (v as ContactType) : "general";
}

type Step = "edit" | "confirm";

export default function ContactForm({ prefillType, prefailEmail }: Props) {
  const [step, setStep] = useState<Step>("edit");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(prefailEmail ?? "");
  const [type, setType] = useState<ContactType>(normalizeType(prefillType));
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sent, setSent] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);

  const MAX = 2000;
  const remain = MAX - message.length;
  const emailInvalid =
    email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSend = useMemo(() => {
    return (
      !loading &&
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      !emailInvalid &&
      subject.trim().length > 0 &&
      message.trim().length > 0 &&
      message.length <= MAX
    );
  }, [name, email, emailInvalid, subject, message, loading]);

  const goConfirm = () => {
    if (!canSend) return;
    setStep("confirm");
  };

  const backToEdit = () => setStep("edit");

  const submit = async () => {
    if (!canSend) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, subject, message }),
      });
      if (!res.ok) throw new Error("send failed");
      setSent("ok");
      // 再入力できるようクリアして編集ステップに戻す
      setStep("edit");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setSent("err");
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = TYPE_LABELS[type]; // ← 型安全に参照

  return (
    <form className={styles.card} onSubmit={(e) => e.preventDefault()} noValidate>
      {sent === "ok" && (
        <div className={styles.success}>
          送信しました。返信までしばらくお待ちください。
        </div>
      )}
      {sent === "err" && (
        <div
          className={styles.success}
          style={{
            borderColor: "var(--color-error)",
            background: "#fff5f4",
          }}
        >
          送信に失敗しました。時間をおいてお試しください。
        </div>
      )}

      {step === "edit" ? (
        <>
          <div className={styles.row}>
            <label htmlFor="name" className={styles.label}>
              お名前
            </label>
            <input
              id="name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              required
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="email" className={styles.label}>
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="taro@example.com"
              aria-invalid={emailInvalid || undefined}
              required
            />
            {emailInvalid && (
              <div className={styles.errorText}>
                メールアドレスの形式が正しくありません。
              </div>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="type" className={styles.label}>
              お問い合わせ種別
            </label>
            <select
              id="type"
              className={styles.select}
              value={type}
              onChange={(e) => setType(normalizeType(e.target.value))}
            >
              <option value="general">一般</option>
              <option value="billing">課金 / 請求</option>
              <option value="bug">不具合</option>
              <option value="feature">機能要望</option>
            </select>
          </div>

          <div className={styles.row}>
            <label htmlFor="subject" className={styles.label}>
              件名
            </label>
            <input
              id="subject"
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="例）ログインできない / 領収書について など"
              required
            />
          </div>

          <div className={styles.row}>
            <label htmlFor="message" className={styles.label}>
              内容
            </label>
            <textarea
              id="message"
              className={styles.textarea}
              rows={6}
              maxLength={MAX}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="できるだけ具体的にご記載ください。（例：発生手順・日時・スクリーンショットの状況など）"
              required
            />
            <div className={styles.counter}>残り {remain} 文字</div>
          </div>

          <div className={styles.actions}>
            <Button onClick={goConfirm} disabled={!canSend}>
              確認へ進む
            </Button>
          </div>
        </>
      ) : (
        /* ===== 確認ステップ ===== */
        <>
          <div className={styles.confirmTitle}>入力内容の確認</div>
          <div className={styles.kv}>
            <div className={styles.kvRow}>
              <div className={styles.kvLabel}>お名前</div>
              <div className={styles.kvValue}>{name}</div>
            </div>
            <div className={styles.kvRow}>
              <div className={styles.kvLabel}>メールアドレス</div>
              <div className={styles.kvValue}>{email}</div>
            </div>
            <div className={styles.kvRow}>
              <div className={styles.kvLabel}>お問い合わせ種別</div>
              <div className={styles.kvValue}>
                <span className={styles.badgeType}>{typeLabel}</span>
              </div>
            </div>
            <div className={styles.kvRow}>
              <div className={styles.kvLabel}>件名</div>
              <div className={styles.kvValue}>{subject}</div>
            </div>
            <div className={styles.kvRow}>
              <div className={styles.kvLabel}>内容</div>
              <div className={styles.kvValue}>{message}</div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={backToEdit} disabled={loading}>
              戻って修正
            </Button>
            <Button onClick={submit} disabled={loading} aria-busy={loading}>
              {loading ? "送信中…" : "送信する"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
