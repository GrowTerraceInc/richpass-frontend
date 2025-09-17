import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import { loadPreferences } from "@/app/lib/preferences";
import NotificationsSettingsForm from "./NotificationsSettingsForm";
import styles from "./NotificationsSettingsPage.module.css";

export default async function NotificationsSettingsPage() {
  const prefs = await loadPreferences();

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "通知設定", href: "/settings/notifications" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>お知らせ設定</h1>
      </div>

      <NotificationsSettingsForm
        initial={{
          notifyEmail: prefs.notifyEmail,
          productEmail: prefs.productEmail,
          marketingOptIn: prefs.marketingOptIn,
          notifyPush: prefs.notifyPush,
          notifyInApp: prefs.notifyInApp,
        }}
      />
    </main>
  );
}
