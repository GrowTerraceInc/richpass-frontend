import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import MarkdownView from "@/app/components/markdown/MarkdownView";
import { getNotificationById } from "@/app/lib/notifications";
import { formatYmd } from "@/app/lib/formatRelativeTime";
import styles from "../NotificationDetailPage.module.css";
import { Calendar, AlertCircle } from "lucide-react";

export default async function NotificationDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const data = await getNotificationById(id);

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "お知らせ", href: "/notifications" },
            { label: data?.title ?? "詳細", href: `/notifications/${id}` },
          ]}
        />
      </div>

      {!data ? (
        <>
          <section className={styles.article}>
            <h1 className={styles.title}>お知らせが見つかりません</h1>
            <p style={{ color: "var(--color-gray-600)" }}>
              指定されたお知らせ（ID: {id}）は存在しないか、公開が終了しました。
            </p>
          </section>
        </>
      ) : (
        <>
          <section className={styles.article}>
            {/* タイトル */}
            <h1 className={styles.title}>{data.title}</h1>

            {/* メタ行（バッジ・日付） */}
            <div className={styles.meta}>
              {data.type === "important" && (
                <span className={`${styles.badge} ${styles["badge--important"]}`}>
                  <AlertCircle width={16} height={16} />
                  重要
                </span>
              )}
              {/* 区切りドット（typeがある時だけ表示） */}
              {data.type && <span className={styles.dot} />}

              <Calendar className={styles.metaIcon} aria-hidden="true" />
              <span>{formatYmd(data.publishedAt)}</span>
            </div>

            {/* 本文 */}
            <div className={styles.content}>
              <MarkdownView markdown={data.bodyMd ?? ""} />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
