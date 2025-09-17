"use client";

import Image from "next/image";
import styles from "./TestimonialsSection.module.css";

type Voice = {
  avatar: string;
  role: string;
  quote: string;
};

const VOICES: Voice[] = [
  {
    avatar: "/landing-page/avatar1.jpg",
    role: "30代・会社員 男性",
    quote:
      "通勤電車の時間を無駄にせず学べるのがありがたいです。NISAやiDeCoなど基礎から学べて、自分の将来設計に自信が持てるようになりました。",
  },
  {
    avatar: "/landing-page/avatar2.jpg",
    role: "40代・主婦 女性",
    quote:
      "家事や育児の合間にスマホで少しずつ学べるのが続けやすいです。知らなかった社会保障や税金の仕組みを理解でき、家計管理に役立っています。",
  },
  {
    avatar: "/landing-page/avatar3.jpg",
    role: "20代・会社員 女性",
    quote:
      "ゲーム感覚でレベルアップしていける仕組みが楽しいです。NFTや暗号通貨など最新のテーマにも触れられるので、友達との会話でも一歩先をいけるようになりました。",
  },
];

export default function TestimonialsSection() {
  return (
    <section className={`section bg-gray-50`} aria-labelledby="testimonials-title">
      <div className={`container container--md`}>
        <h2 id="testimonials-title" className={`${styles.heading} h2`}>
          ご利用者の声
        </h2>

        <div className={styles.grid}>
          {VOICES.map((v, i) => (
            <article key={i} className={`${styles.item} ${i % 2 === 1 ? styles.reverse : ""}`} aria-label="testimonial">
              <div className={styles.photo}>
                <Image
                  src={v.avatar}
                  alt={`${v.role}の写真`}
                  width={600}
                  height={800}
                  className={styles.photoImg}
                  style={{ width: "100%", height: "100%" }}
                  priority={i === 0}
                />
              </div>

              <div className={styles.body}>
                <p className={styles.quote}>{v.quote}</p>
                <div className={styles.role}>- {v.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
