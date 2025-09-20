"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/app/components/ui/Toggle";
import Button from "@/app/components/ui/Button";
import LinkButton from "@/app/components/ui/LinkButton";
import styles from "./CancelPage.module.css";
import { csrfCookie } from "@/app/lib/authClient"; // ★追加：Sanctum CSRF
import { getSubscriptionStatusApi } from "@/app/lib/billingClient"; // 成功後の再取得に使用

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

type Props = {
  renewsAt?: string; // 期間末日（ISO）; 期間末解約の説明に使用
};

function formatYmd(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function getXsrfFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((s) => s.startsWith("XSRF-TOKEN="));
  if (!raw) return null;
  try {
    return decodeURIComponent(raw.split("=")[1] ?? "");
  } catch {
    return raw.split("=")[1] ?? null;
  }
}

export default function CancelForm({ renewsAt }: Props) {
  const router = useRouter();
  const [atPeriodEnd, setAtPeriodEnd] = useState(true);

  // 理由は複数選択可・任意
  const [reasons, setReasons] = useState<string[]>([]);
  const [other, setOther] = useState("");

  // 同意は必須のまま
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const reasonOptions = [
    { value: "price", label: "料金が高い" },
    { value: "time", label: "利用する時間がない" },
    { value: "unsatisfied", label: "サービスに満足できなかった" },
    { value: "other", label: "その他（自由記述）" },
  ] as const;

  const toggleReason = (val: string) => {
    setReasons((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const canSubmit = !saving && agreed;

  const proceed = async (payloadReasons: string[], payloadDetails?: string) => {
    setSaving(true);
    setErr(null);
    try {
      // 1) CSRF cookie（Sanctum）
      const c = await csrfCookie();
      if (![200, 204].includes(c)) throw new Error(`CSRF failed: ${c}`);
      const xsrf = getXsrfFromCookie();
      if (!xsrf) throw new Error("CSRF token missing");

      // 2) 解約API（APIドメインへ、Cookie送信＋XSRFヘッダ付き）
      const res = await fetch(`${API_BASE}/api/subscription/cancel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrf,
        },
        body: JSON.stringify({
          atPeriodEnd,            // 期間末解約 or 即時解約（バック側が対応すれば利用）
          reasons: payloadReasons, // 任意
          details: payloadDetails, // 任意
        }),
      });
      if (!res.ok) {
        let msg = `cancel failed: ${res.status}`;
        try {
          const j = await res.json();
          if (typeof j?.error === "string") msg = j.error;
        } catch {}
        throw new Error(msg);
      }

      // 3) 成功後のリダイレクト（/status を再取得して at/end or now を判断）
      let at: "end" | "now" = atPeriodEnd ? "end" : "now";
      let renew = renewsAt ?? "";
      try {
        const s = await getSubscriptionStatusApi();
        // 直ちにキャンセル済みなら now、期間末なら end に寄せる
        const st = String(s.status || "").toLowerCase();
        if (st === "canceled") at = "now";
        if (s.renews_at) renew = s.renews_at;
      } catch {
        // 取得失敗時はフォームの選択値で遷移
      }

      const q = new URLSearchParams({ at, renew }).toString();
      router.push(`/settings/subscription/cancel/success?${q}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "cancel error");
      setSaving(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const details =
      reasons.includes("other") && other.trim().length > 0 ? other.trim() : undefined;
    await proceed(reasons, details);
  };

  return (
    <form className={styles.card} onSubmit={onSubmit}>
      {/* 注意事項 */}
      <section>
        <div className={styles.sectionTitle}>本当に解約しますか？</div>
        <ul className={styles.list}>
          <li>プレミアム特典（全レッスン視聴、テスト無制限、学習履歴同期 など）が利用できなくなります。</li>
          <li>無料プラン（FREE）に切り替わります。再開する場合はいつでもアップグレードできます。</li>
        </ul>
      </section>

      {/* 期間末解約のトグル */}
      <section>
        <div className={styles.sectionTitle}>解約タイミング</div>
        <Toggle
          checked={atPeriodEnd}
          onChange={setAtPeriodEnd}
          label="期間末で解約する（推奨）"
          description={
            atPeriodEnd
              ? `次回の更新日（${formatYmd(renewsAt)}）まではご利用いただけます。`
              : "すぐに解約します（本日から特典の利用が停止されます）。"
          }
        />
      </section>

      {/* 理由（任意・複数選択可） */}
      <section>
        <div className={styles.sectionTitle}>解約理由をお聞かせください（任意・複数選択可）</div>

        {/* 囲みボックス */}
        <div className={styles.reasonCard}>
          <div className={styles.reasons}>
            {reasonOptions.map((r) => (
              <label key={r.value} className={styles.reasonRow}>
                <input
                  type="checkbox"
                  name="reasons"
                  value={r.value}
                  checked={reasons.includes(r.value)}
                  onChange={() => toggleReason(r.value)}
                />
                <span>{r.label}</span>
              </label>
            ))}

            {/* 「その他」を選んだときだけ自由記述を表示（任意） */}
            {reasons.includes("other") && (
              <textarea
                className={styles.textarea}
                placeholder="差し支えなければ、解約の理由をお書きください。"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 同意チェック（必須）—中央寄せ */}
      <section className={styles.confirm}>
        <label className={styles.confirmRow}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>上記を理解した上で、解約手続きに進みます。</span>
        </label>
        <div className={`${styles.note} ${styles.center}`}>
          ※ 解約が完了すると、プレミアム特典は
          {atPeriodEnd ? `次回の更新日（${formatYmd(renewsAt)}）以降` : "ただちに"}
          利用できなくなります。
        </div>
      </section>

      {/* エラー表示（あれば） */}
      {err && (
        <div className={`${styles.note} ${styles.center}`} style={{ color: "#c00" }}>
          {err}
        </div>
      )}

      {/* アクション（中央寄せ） */}
      <div className={styles.actions}>
        <Button size="small" disabled={!canSubmit} aria-busy={saving}>
          {saving ? "処理中…" : "解約を確定する"}
        </Button>
        <LinkButton variant="secondary" href="/settings/plan" size="small">
          プラン管理に戻る
        </LinkButton>
      </div>
    </form>
  );
}
