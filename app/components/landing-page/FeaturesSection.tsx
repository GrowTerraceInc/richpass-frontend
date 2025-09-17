"use client";

import Image from "next/image";
import styles from "./FeaturesSection.module.css";

type Feature = {
  imgSrc: string;
  title: string;
  description: string;
  alt: string;
};

const FEATURES: Feature[] = [
  {
    imgSrc: "/landing-page/feature1.jpg",
    title: "お金から始まる、人生のアップデート",
    description:
      "まずは、日々の生活に直結するお金の知識から。NISAやiDeCo、家計管理まで、あなたの「今」に必要な学びがここにあります。",
    alt: "金融タイプ診断のイメージ",
  },
  {
    imgSrc: "/landing-page/feature2.jpg",
    title: "ゲーム感覚で、学習を無理なく",
    description:
      "続く秘訣は、楽しむこと。ステージクリアやレベルアップで、無理なく学習を毎日の習慣に変えていきます。",
    alt: "学習動画とクイズのイメージ",
  },
  {
    imgSrc: "/landing-page/feature3.jpg",
    title: "お金の先にある、豊かな人生をデザイン",
    description:
      "リッチパスの学びは、お金だけでは終わりません。キャリア、人間関係など、人生のあらゆる側面を向上させるコンテンツを追加していきます。",
    alt: "実践テンプレートのイメージ",
  },
];

export default function FeaturesSection() {
  return (
    <section className={`section bg-gray-50`} aria-labelledby="features-title">
      <div className={`container`}>
        <h2 id="features-title" className={`${styles.heading} h2`}>
          リッチパスが選ばれる理由
        </h2>

        <p className={styles.lead}>
          私たちは、学習に必要な「良い習慣」と「続けられる環境」こそ最も重要だと考えています。
          リッチパスは、その2つを、誰もがもっと気軽に始められるように設計されています。
        </p>

        <div className={styles.featuresContainer}>
          {FEATURES.map((f, idx) => (
            <article key={idx} className={styles.featureCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={f.imgSrc}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 33vw, 400px"
                  priority={idx === 0}
                />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardText}>{f.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
