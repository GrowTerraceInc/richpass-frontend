"use client";

import Image from "next/image";
import styles from "./LearningSystemSection.module.css";

type Feature = {
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    imgSrc: "/landing-page/feature-illustration-1.png",
    imgAlt: "短時間で学べる動画学習のイラスト",
    title: "1レッスン5分からの動画学習",
    description:
      "忙しいあなたのためのマイクロラーニング。通勤中や寝る前の隙間時間で、サクッと知識をインプット。",
  },
  {
    imgSrc: "/landing-page/feature-illustration-2.png",
    imgAlt: "ゲーム要素で学習が続くことを表すイラスト",
    title: "ゲーム感覚で楽しく続く",
    description:
      "ステージクリア、レベルアップ、マップ攻略。RPGのような体験で、飽きずに学習を続けられます。",
  },
  {
    imgSrc: "/landing-page/feature-illustration-3.png",
    imgAlt: "タイプ診断のイラスト",
    title: "まずは5分のタイプ診断から",
    description:
      "いくつかの質問に答えるだけで、あなたのお金に対する強みやクセを診断。自分だけのスタート地点がわかります。",
  },
];

export default function LearningSystemSection() {
  return (
    <section className={`section bg-brand-100`} aria-labelledby="learning-system-title">
      <div className={`container container--sm`}>
        <h2 id="learning-system-title" className={`${styles.heading} h2`}>
          「続く」を科学した学習システム
        </h2>

        <div className={styles.featuresList}>
          {FEATURES.map((f, idx) => (
            <div key={f.title} className={`${styles.featureItem} ${idx % 2 === 1 ? styles.reverse : ""}`}>
              <div className={styles.illustration}>
                <div className={styles.imageCard}>
                  <Image
                    src={f.imgSrc}
                    alt={f.imgAlt}
                    width={800}
                    height={800}
                    sizes="(max-width: 767px) 82vw, (min-width: 768px) 360px"
                    priority={idx === 0}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>

              <div className={styles.textArea}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
