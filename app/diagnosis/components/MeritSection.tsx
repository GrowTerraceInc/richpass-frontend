import Image from "next/image";
import styles from "./MeritSection.module.css";

const ITEMS = [
  {
    icon: "/diagnosis/icons/shield.png",
    title: "隠れた金銭的強み",
    desc: "自分では気づいていない、お金を貯めたり増やしたりする才能を発見します。",
  },
  {
    icon: "/diagnosis/icons/warn.png",
    title: "陥りがちな失敗パターン",
    desc: "なぜお金が貯まらない…その原因となるあなたの行動パターンを明らかにします。",
  },
  {
    icon: "/diagnosis/icons/userplus.png",
    title: "最適な資産形成スタイル",
    desc: "NISAやiDeCo、投資信託など、あなたに本当に合ったお金の増やし方がわかります。",
  },
  {
    icon: "/diagnosis/icons/check.png",
    title: "自信が持てるお金との関係",
    desc: "診断結果をもとに、漠然とした不安を解消し、自信を持って未来を描けるようになります。",
  },
];

export default function MeritSection() {
  return (
    <section className="section bg-white" aria-labelledby="merit-title">
      <div className="container">
        <h2 id="merit-title" className={styles.heading}>診断でわかるあなたの姿</h2>

        <div className={styles.grid}>
          {ITEMS.map((it) => (
            <article key={it.title} className={styles.card}>
              <div className={styles.iconCircle}>
                <Image
                  src={it.icon}
                  alt=""
                  width={35}
                  height={35}
                  className={styles.icon}
                />
              </div>
              <h3 className={styles.cardTitle}>{it.title}</h3>
              <p className={styles.cardText}>{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
