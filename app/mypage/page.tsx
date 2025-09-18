import Image from "next/image";
import styles from "./MyPage.module.css";
import { loadProfile } from "@/app/lib/profile";

export default async function MyPage() {
  const p = await loadProfile();
  const displayName = p.displayName || "ゲスト";
  const email = p.email || "example@example.com";
  const photo = p.photoUrl || "/images/avatar-placeholder.png";

  return (
    <main className="container">
      {/* パンくずは表示しない */}

      {/* タイトル */}
      <div className={styles.header}>
        <h1 className={styles.title}>マイページ</h1>
      </div>

      {/* プロフィールヘッダー */}
      <section className={styles.profile}>
        <Image
          className={styles.avatar}
          src={photo}
          alt="プロフィール画像"
          width={150}
          height={150}
          unoptimized
        />
        <div className={styles.name}>{displayName} さん</div>
        <div className={styles.email}>{email}</div>
        <a className={styles.editBtn} href="/settings/profile">
          プロフィールを編集
        </a>
      </section>

      {/* メニュー */}
      <div className={styles.menuWrap}>
        <nav className={styles.menu} aria-label="マイページメニュー">
          <a className={styles.menuItem} href="/diagnosis">診断結果</a>
          <a className={styles.menuItem} href="/settings/plan">プラン管理</a>
          <a className={styles.menuItem} href="/settings/notifications">お知らせ設定</a>
          <a className={styles.menuItem} href="/help">ヘルプ / FAQ</a>
          <a className={styles.menuItem} href="/terms">利用規約</a>
          <a className={styles.menuItem} href="/privacy">プライバシーポリシー</a>
          <a className={`${styles.menuItem} ${styles.danger}`} href="/logout">ログアウト</a>
        </nav>

        {/* 退会手続き（大きめボックス） */}
        <div className={styles.withdrawBox}>
          <a className={styles.withdrawLink} href="/account/withdraw">
            退会手続き
          </a>
        </div>
      </div>

      {/* 最下部スペーサー（保険） */}
      <div className={styles.tail} />
    </main>
  );
}
