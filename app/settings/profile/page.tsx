import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import { loadProfile } from "@/app/lib/profile";
import ProfileForm from "./ProfileForm";
import styles from "./ProfilePage.module.css";

export default async function ProfilePage() {
  const profile = await loadProfile();

  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プロフィール編集", href: "/settings/profile" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>プロフィール編集</h1>
      </div>

      <ProfileForm initial={{ displayName: profile.displayName, email: profile.email, photoUrl: profile.photoUrl }} />
    </main>
  );
}
