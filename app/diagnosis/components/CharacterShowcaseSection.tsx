import Image from "next/image";
import styles from "./CharacterShowcaseSection.module.css";

const TYPES = [
  {
    img: "/diagnosis/types/type-01.png",
    name: "攻めの情報通",
    desc: "情報収集と分析を武器に、積極的にリターンを狙います。",
  },
  {
    img: "/diagnosis/types/type-02.png",
    name: "計画ドリーマー",
    desc: "壮大な目標を掲げ、実現のための計画を練るのが得意です。",
  },
  {
    img: "/diagnosis/types/type-03.png",
    name: "マイペース亀さん",
    desc: "安全第一。焦らず、自分のペースで着実に資産を築きます。",
  },
  {
    img: "/diagnosis/types/type-04.png",
    name: "ひらめきトレーダー",
    desc: "直感とひらめきを信じ、チャンスを逃さず大胆に行動します。",
  },
];

export default function CharacterShowcaseSection() {
  return (
    <section className="section bg-brand-100" aria-labelledby="char-title">
      <div className="container">
        <h2 id="char-title" className={styles.heading}>あなたはどのタイプ？</h2>

        <div className={styles.list}>
          {TYPES.map((t, i) => (
            <article
              key={t.name}
              className={`${styles.card} ${i % 2 === 1 ? styles.reverse : ""}`}
              aria-label={t.name}
            >
              {/* イラスト（SP最小150px〜最大200pxで可変） */}
              <div className={styles.illu}>
                <Image
                  src={t.img}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 150px, 200px"
                  className={styles.illuImg}
                />
              </div>

              {/* テキスト（h2 + 本文） */}
              <div className={styles.textArea}>
                <h2 className={styles.title}>{t.name}</h2>
                <p className={styles.desc}>{t.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.note}>など、全8タイプの金融性格がわかります。</p>
      </div>
    </section>
  );
}
