import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import NotificationListItem from "@/app/components/notifications/NotificationListItem";
import styles from "./NotificationsPage.module.css";
import { loadNotifications } from "@/app/lib/notifications";

export default async function NotificationsPage() {
  const items = await loadNotifications();

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "お知らせ", href: "/notifications" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>お知らせ一覧</h1>
      </div>

      <div>
        {items.map((n) => (
          <NotificationListItem
            key={n.id}
            title={n.title}
            createdAt={n.publishedAt}
            icon={n.icon ?? "info"}
            type={n.type}
            pinned={n.isPinned}
            href={`/notifications/${n.id}`}
          />
        ))}
      </div>
    </main>
  );
}
