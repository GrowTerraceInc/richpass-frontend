"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Toggle from "@/app/components/ui/Toggle";
import styles from "./NotificationsSettingsPage.module.css";

type Prefs = {
  notifyEmail: boolean;
  productEmail: boolean;
  marketingOptIn: boolean;
  notifyPush: boolean;
  notifyInApp: boolean;
};

export default function NotificationsSettingsForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const childrenDisabled = useMemo(() => !prefs.notifyEmail, [prefs.notifyEmail]);

  const queueSave = (next: Prefs) => {
    setPrefs(next);
    setSaving("saving");
    if (timer.current !== null) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      try {
        await fetch("/api/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        });
        setSaving("saved");
        const doneTimer = setTimeout(() => setSaving("idle"), 1200);
        timer.current = doneTimer;
      } catch {
        setSaving("idle");
        alert("保存に失敗しました。時間をおいて再度お試しください。");
      }
    }, 350);
  };

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    const next = { ...prefs, [key]: value };
    queueSave(next);
  };

  useEffect(() => {
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className={styles.wrap}>
      {/* メール通知 */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>メール通知</div>

        <div className={styles.row}>
          <div className={styles.rowText}>
            <div className={styles.rowTitle}>メールのお知らせ（全体）</div>
            <div className={styles.rowDesc}>
              メールでのお知らせ全般を受け取ります。オフにすると下の項目に関わらず、メールは届きません。
            </div>
          </div>
          <Toggle
            checked={prefs.notifyEmail}
            onChange={(v) => set("notifyEmail", v)}
          />
        </div>

        <div className={`${styles.row} ${childrenDisabled ? styles.rowDisabled : ""}`}>
          <div className={styles.rowText}>
            <div className={styles.rowTitle}>新機能・メンテナンス情報</div>
            <div className={styles.rowDesc}>
              サービスの更新情報やメンテナンスなど、運用上の連絡をメールで受け取ります。
            </div>
          </div>
          <Toggle
            checked={prefs.productEmail}
            onChange={(v) => set("productEmail", v)}
            disabled={childrenDisabled}
          />
        </div>

        <div className={`${styles.row} ${childrenDisabled ? styles.rowDisabled : ""}`}>
          <div className={styles.rowText}>
            <div className={styles.rowTitle}>お得情報・イベント案内</div>
            <div className={styles.rowDesc}>
              キャンペーンやセミナーなど、マーケティングのお知らせをメールで受け取ります。
            </div>
          </div>
          <Toggle
            checked={prefs.marketingOptIn}
            onChange={(v) => set("marketingOptIn", v)}
            disabled={childrenDisabled}
          />
        </div>
      </section>

      {/* アプリ内/プッシュ */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>アプリ内通知 / プッシュ</div>

        <div className={styles.row}>
          <div className={styles.rowText}>
            <div className={styles.rowTitle}>アプリ内通知</div>
            <div className={styles.rowDesc}>
              画面上のベルや「お知らせ」一覧に表示される通知です。重要なお知らせもここに入ります。
            </div>
          </div>
          <Toggle
            checked={prefs.notifyInApp}
            onChange={(v) => set("notifyInApp", v)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.rowText}>
            <div className={styles.rowTitle}>プッシュ通知</div>
            <div className={styles.rowDesc}>
              スマホ／ブラウザのプッシュ通知です。オフでもアプリ内通知は表示されます。
            </div>
          </div>
          <Toggle
            checked={prefs.notifyPush}
            onChange={(v) => set("notifyPush", v)}
          />
        </div>
      </section>

      <div aria-live="polite">
        {saving === "saving" && <span className={styles.saving}>保存中…</span>}
        {saving === "saved" && <span className={styles.saved}>保存しました</span>}
      </div>
    </div>
  );
}
