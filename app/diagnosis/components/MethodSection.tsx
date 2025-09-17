import Image from "next/image";
import styles from "./MethodSection.module.css";

const CARDS = [
  {
    img: "/diagnosis/method-1.jpg",
    title: "行動経済学に基づくフレームワーク",
    desc:
      "ノーベル経済学賞受賞者の理論を応用。人々がどのように経済的な意思決定を行うかの研究に基づき、あなたの金融行動を分析します。",
  },
  {
    img: "/diagnosis/method-2.jpg",
    title: "多角的なアプローチで分析",
    desc:
      "あなたの意思決定は直感？それともデータ？リスクには積極的？周りの意見も参考にする？など、様々な角度からあなたの金銭感覚を分析します。",
  },
];

export default function MethodSection() {
  return (
    <section className={styles.dark} aria-labelledby="method-title">
      <div className={`section container ${styles.inner}`}>
        <h2 id="method-title" className={styles.heading}>信頼性の高い診断メソッド</h2>

        <div className={styles.grid}>
          {CARDS.map((c) => (
            <article key={c.title} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image src={c.img} alt="" fill sizes="(max-width: 768px) 92vw, 360px" />
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>{c.title}</h3>  {/* ← h3 */}
                <p className={styles.text}>{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
