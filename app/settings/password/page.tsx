import Breadcrumbs from "@/app/components/breadcrumbs/Breadcrumbs";
import styles from "./PasswordPage.module.css";
import PasswordForm from "./PasswordForm";

export default function PasswordPage() {
  return (
    <main className="container">
      <div className="header">
        <Breadcrumbs
          items={[
            { label: "マイページ", href: "/mypage" },
            { label: "プロフィール編集", href: "/settings/profile" },
            { label: "パスワードの変更", href: "/settings/password" },
          ]}
        />
      </div>

      <div className={styles.header}>
        <h1 className={styles.title}>パスワードの変更</h1>
      </div>

      <PasswordForm />
    </main>
  );
}
