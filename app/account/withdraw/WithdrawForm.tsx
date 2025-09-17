"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import LinkButton from "@/app/components/ui/LinkButton";
import styles from "./WithdrawPage.module.css";

const REASONS = [
  { value: "usage", label: "使い方が分かりづらい" },
  { value: "contents", label: "コンテンツが少ない / 合わない" },
  { value: "price", label: "料金が高い" },
  { value: "time", label: "学習の時間が取れない" },
  { value: "other", label: "その他（自由記述）" },
] as const;
type ReasonValue = typeof REASONS[number]["value"];

export default function WithdrawForm() {
  const [reasons, setReasons] = useState<ReasonValue[]>([]);
  const [other, setOther] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"idle" | "ok" | "err">("idle");

  const toggle = (v: ReasonValue) => {
    setReasons((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );
  };

  const canSubmit = !loading && agreed;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch("/api/account/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reasons,
          other: reasons.includes("other") && other.trim() ? other.trim() : undefined,
          agreed: true,
        }),
      });
      if (!res.ok) throw new Error("withdraw failed");
      setDone("ok");
      // 成功 → 完了ページへ
      window.location.href = "/account/withdraw/success";
    } catch {
      setDone("err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={(e) => e.preventDefault()}>
      {/* 注意事項 */}
      <section>
        <div className={styles.sectionTitle}>退会前の注意事項</div>
        <ul className={styles.list}>
          <li>退会後はログインできなくなります。</li>
          <li>プレミアム特典・学習履歴・ブックマーク等のデータは、ポリシーに従い削除される場合があります。</li>
          <li>サブスクリプションをご利用中の場合は、先に<strong>サブスクの解約</strong>をお済ませください。</li>
        </ul>
      </section>

      {/* 理由（任意・複数選択可） */}
      <section>
        <div className={styles.sectionTitle}>退会理由（任意・複数選択可）</div>
        <div className={styles.reasonCard}>
          <div className={styles.reasons}>
            {REASONS.map((r) => (
              <label key={r.value} className={styles.reasonRow}>
                <input
                  type="checkbox"
                  checked={reasons.includes(r.value)}
                  onChange={() => toggle(r.value)}
                />
                <span>{r.label}</span>
              </label>
            ))}
            {reasons.includes("other") && (
              <textarea
                className={styles.textarea}
                placeholder="差し支えなければ、退会の理由をご記載ください。"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 同意チェック（必須） */}
      <section className={styles.confirm}>
        <label className={styles.confirmRow}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>上記の注意事項を理解し、退会に同意します。</span>
        </label>
        <div className={styles.note}>
          ※ 退会手続きは取り消せない場合があります。必要であればデータのバックアップをお取りください。
        </div>
      </section>

      <div className={styles.actions}>
        <Button onClick={submit} disabled={!canSubmit} aria-busy={loading}>
          {loading ? "処理中…" : "退会を確定する"}
        </Button>
        <LinkButton variant="secondary" href="/mypage">
          マイページに戻る
        </LinkButton>
      </div>

      {done === "err" && (
        <div
          className={styles.note}
          style={{ color: "var(--color-error)", fontWeight: 700 }}
        >
          手続きに失敗しました。時間をおいて再度お試しください。
        </div>
      )}
    </form>
  );
}
