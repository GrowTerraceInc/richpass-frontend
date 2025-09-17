import LinkButton from "@/app/components/ui/LinkButton";
import { CheckCircle2 } from "lucide-react";
import styles from "./SuccessPage.module.css";

function formatYmd(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function CancelSuccessPage(props: {
  searchParams: Promise<{ at?: string; renew?: string }>;
}) {
  const { at, renew } = await props.searchParams;

  const line =
    at === "end"
      ? `プレミアム特典は、次回の更新日（${formatYmd(renew)}）までご利用いただけます。`
      : "プレミアム特典はただちに利用できなくなりました。";

  return (
    <main className="container">
      <div className="header" />

      <section className={styles.wrapper}>
        <CheckCircle2 className={styles.icon} aria-hidden="true" strokeWidth={2.5} />
        <h1 className="h2" style={{ marginTop: 8 }}>解約手続きが完了しました</h1>
        <p className={styles.subtext}>{line}</p>
        <LinkButton href="/settings/plan" size="large">プラン管理に戻る</LinkButton>
      </section>
    </main>
  );
}
