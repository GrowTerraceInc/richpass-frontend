// app/home/components/HomeScreen.tsx
"use client";

import Image from "next/image";
import Button from "@/app/components/ui/Button";
import styles from "./HomeScreen.module.css";

// ==== ダミーデータ（画像パスは提供ベース） ====
const user = {
  name: "大地さん",
  level: 5,
  avatar: "/avatar.png",
  streakDays: 15,
  totalHours: 8,
  cleared: 12,
  xp: 62, // 0-100
};

const studyingLesson = {
  category: "マインドセット",
  title: "「お金持ちな自分になる思考」",
  progress: 40, // 0-100
  icon: "/courses/mindset.png",
};

const activities = [
  { id: 1, name: "田中 誠", text: "「NISA」をクリアしました！", avatar: "/smple_avatars/user1.png" },
  { id: 2, name: "鈴木 一郎", text: "「社会保障基礎」の学習を始めました！", avatar: "/smple_avatars/user2.png" },
];

const reviewLessons = [
  { id: 1, badge: "金融基礎", title: "必見！投資信託徹底解説！", icon: "/courses/finance_basics.png" },
];

const bookmarks = [
  { id: 1, badge: "NISA", title: "死亡・離婚したときのNISAってどうなる？", icon: "/courses/nisa.png" },
  { id: 2, badge: "経済の仕組み", title: "金融基礎と金利の徹底解説", icon: "/courses/financial_products.png" },
];

// 当月を1ヶ月表示（PC）用
const now = new Date();
const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

const calendar = {
  weekLabels: ["日", "月", "火", "水", "木", "金", "土"],
  days: monthDays,
  highlight: [2, 7, 9],
};

export default function HomeScreen() {
  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {/* ===== Left / Main ===== */}
        <main className={styles.main}>
          {/* ユーザー情報カード */}
          <section className={`${styles.userCard} ${styles.softCard}`} aria-label="ユーザー情報">
            <div className={styles.userHeader}>
              <div className={styles.userMeta}>
                <div className={styles.avatarWrap}>
                  <Image
                    src={user.avatar}
                    alt={`${user.name} のアバター`}
                    width={48}
                    height={48}
                    className={styles.avatar}
                  />
                </div>
                <div>
                  <div className={styles.userName}>
                    {user.name} <span className={styles.level}>Lv.{user.level}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.xpBarOuter} aria-hidden>
              <div className={styles.xpBarInner} style={{ width: `${user.xp}%` }} />
            </div>

            <ul className={styles.kpis} role="list">
              <li className={styles.kpiItem}>
                <div className={styles.kpiNum}>{user.streakDays}</div>
                <div className={styles.kpiLabel}>連続学習</div>
              </li>
              <li className={styles.kpiItem}>
                <div className={styles.kpiNum}>{user.totalHours}</div>
                <div className={styles.kpiLabel}>累計時間</div>
              </li>
              <li className={styles.kpiItem}>
                <div className={styles.kpiNum}>{user.cleared}</div>
                <div className={styles.kpiLabel}>クリア数</div>
              </li>
            </ul>
          </section>

          {/* 学習中のレッスン */}
          <h2 className={styles.sectionTitle}>学習を続けましょう！</h2>
          <section className={`${styles.lessonCard} ${styles.softCard}`} aria-label="学習中のレッスン">
            <div className={styles.lessonIcon}>
              <Image src={studyingLesson.icon} alt="" width={35} height={35} className={styles.iconImg} />
            </div>
            <div className={styles.lessonBody}>
              <div className={styles.lessonBadge}>{studyingLesson.category}</div>
              <div className={styles.lessonTitle}>
                {studyingLesson.title} <span className={styles.lessonInfo}>①</span>
              </div>
              <div className={styles.progressOuter} aria-hidden>
                <div className={styles.progressInner} style={{ width: `${studyingLesson.progress}%` }} />
              </div>
            </div>
            <div className={styles.lessonCta}>
              {/* モバイルでコンパクト化 */}
              <Button variant="primary" size="large" className={styles.compactBtn}>
                続ける
              </Button>
            </div>
          </section>

          {/* 復習 */}
          <h2 className={styles.sectionTitle}>復習しましょう</h2>
          <div className={`${styles.listStack} ${styles.softCardList}`}>
            {reviewLessons.map((l, idx) => (
              <article key={l.id} className={`${styles.itemRow} ${idx > 0 ? styles.rowDivider : ""}`}>
                <div className={styles.itemIcon}>
                  <Image src={l.icon} alt="" width={35} height={35} />
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemBadge}>{l.badge}</div>
                  <div className={styles.itemTitle}>{l.title}</div>
                </div>
                <div className={styles.itemCta}>
                  <Button variant="primary" size="medium" className={styles.compactBtn}>
                    復習する
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* ブックマーク */}
          <h2 className={styles.sectionTitle}>ブックマークしたレッスン</h2>
          <div className={`${styles.listStack} ${styles.softCardList}`}>
            {bookmarks.map((l, idx) => (
              <article key={l.id} className={`${styles.itemRow} ${idx > 0 ? styles.rowDivider : ""}`}>
                <div className={styles.itemIcon}>
                  <Image src={l.icon} alt="" width={35} height={35} />
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemBadge}>{l.badge}</div>
                  <div className={styles.itemTitle}>{l.title}</div>
                </div>
                <div className={styles.itemCta}>
                  <Button variant="primary" size="medium" className={styles.compactBtn}>
                    学習する
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* ===== Right / Sidebar ===== */}
        <aside className={styles.sidebar}>
          {/* 学習カレンダー（PCは1ヶ月表示、SPは14日だけ） */}
          <section className={`${styles.card} ${styles.softCard}`} aria-label="学習カレンダー">
            <h3 className={styles.cardTitle}>学習カレンダー</h3>
            <div className={styles.calendar}>
              <div className={styles.weekRow}>
                {calendar.weekLabels.map((w) => (
                  <span key={w} className={styles.weekCell}>{w}</span>
                ))}
              </div>
              <div className={styles.dayGrid}>
                {calendar.days.map((d, i) => {
                  const hit = calendar.highlight.includes(d);
                  const hideOnMobile = i >= 14 ? styles.dayHideMobile : "";
                  return (
                    <span
                      key={d}
                      className={`${styles.dayCell} ${hit ? styles.dayHit : ""} ${hideOnMobile}`}
                    >
                      {d}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 仲間のアクティビティ */}
          <section className={`${styles.card} ${styles.softCard}`} aria-label="仲間のアクティビティ">
            <h3 className={styles.cardTitle}>仲間のアクティビティ</h3>
            <ul className={styles.activityList} role="list">
              {activities.map((a, idx) => (
                <li key={a.id} className={`${styles.activityItem} ${idx > 0 ? styles.rowDivider : ""}`}>
                  <Image
                    src={a.avatar}
                    alt={`${a.name} のアイコン`}
                    width={32}
                    height={32}
                    className={styles.activityAvatar}
                  />
                  <p className={styles.activityText}>
                    <strong className={styles.activityName}>{a.name}</strong> さんが {a.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
