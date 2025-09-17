"use client";

import Image from "next/image";
import styles from "./CourseShowcaseSection.module.css";
import { useEffect, useRef } from "react";

type Course = { name: string; icon: string };
type Card =
  | { kind: "course"; course: Course }
  | { kind: "more" };

const COURSES: Course[] = [
  { name: "マインドセット", icon: "mindset" },
  { name: "金融基礎", icon: "finance_basics" },
  { name: "NISA", icon: "nisa" },
  { name: "iDeCo", icon: "ideco" },
  { name: "社会保障基礎", icon: "social_security" },
  { name: "経済の仕組み", icon: "economics" },
  { name: "資産形成基礎", icon: "asset_formation" },
  { name: "年金制度", icon: "pension" },
  { name: "金融商品", icon: "financial_products" },
  { name: "保険基礎", icon: "insurance_basics" },
  { name: "保険商品", icon: "insurance_products" },
  { name: "税金", icon: "tax" },
  { name: "確定申告", icon: "tax_return" },
  { name: "ライフプランニング", icon: "life_planning" },
  { name: "不動産基礎", icon: "real_estate" },
  { name: "相続", icon: "inheritance" },
  { name: "ふるさと納税", icon: "hometown_tax" },
  { name: "マイル旅", icon: "mileage_trip" },
  { name: "ポイント活用", icon: "point_hacking" },
  { name: "子供へのお金の教育", icon: "kids_money_education" },
  { name: "世界の金融", icon: "global_finance" },
  { name: "AI", icon: "ai" },
  { name: "FX", icon: "fx" },
  { name: "暗号通貨", icon: "crypto" },
  { name: "NFT", icon: "nft" },
  { name: "メタバース", icon: "metaverse" },
];

const ALL_CARDS: Card[] = [
  ...COURSES.map((c) => ({ kind: "course", course: c } as Card)),
  { kind: "more" },
];

function CourseIcon({ icon, name }: { icon: string; name: string }) {
  const src = `/courses/${icon}.png`;
  return (
    <Image
      src={src}
      alt={`${name}のアイコン`}
      width={64}
      height={64}
      className={styles.icon}
      sizes="(max-width: 767px) 48px, (max-width: 1200px) 56px, 64px"
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (!img.src.endsWith("/courses/_fallback.png")) {
          img.src = "/courses/_fallback.png";
        }
      }}
    />
  );
}

export default function CourseShowcaseSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLDivElement>(null);
  const spanW = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (spanRef.current) spanW.current = (spanRef.current as HTMLDivElement).offsetWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (spanRef.current) ro.observe(spanRef.current);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const SPEED_PX_PER_SEC = 40;
    let raf = 0;
    let last = performance.now();

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      const w = spanW.current;
      if (w > 0) {
        scroller.scrollLeft += SPEED_PX_PER_SEC * dt;
        if (scroller.scrollLeft >= w) scroller.scrollLeft -= w;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className={`section bg-white`} aria-label="コース一覧">
      <div className={`${styles.inner} container`}>
        <h2 className={`${styles.heading} h2`}>
          NISAからNFTまで。<br />
          幅広い金融知識が身につく
        </h2>

        <div className={styles.scrollerWrap}>
          <div className={styles.scroller} ref={scrollerRef}>
            <div className={styles.belt}>
              <div className={styles.span} ref={spanRef}>
                <div className={styles.cycle}>
                  {ALL_CARDS.map((card, i) =>
                    card.kind === "course" ? (
                      <div key={`${card.course.name}-${i}`} className={styles.courseCard} role="group" aria-label={card.course.name}>
                        <div className={styles.iconWrap}>
                          <CourseIcon icon={card.course.icon} name={card.course.name} />
                        </div>
                        <span className={styles.courseName}>{card.course.name}</span>
                      </div>
                    ) : (
                      <div key={`more-${i}`} className={`${styles.courseCard} ${styles.moreCard}`} role="group" aria-label="その他のコース">
                        <span className={styles.moreText}>…and more!</span>
                      </div>
                    )
                  )}
                </div>
                <div className={styles.cycleSpacer} aria-hidden="true" />
              </div>

              <div className={styles.cycle} aria-hidden="true">
                {ALL_CARDS.map((card, i) =>
                  card.kind === "course" ? (
                    <div key={`dup-${card.course.name}-${i}`} className={styles.courseCard}>
                      <div className={styles.iconWrap}>
                        <CourseIcon icon={card.course.icon} name={card.course.name} />
                      </div>
                      <span className={styles.courseName}>{card.course.name}</span>
                    </div>
                  ) : (
                    <div key={`dup-more-${i}`} className={`${styles.courseCard} ${styles.moreCard}`}>
                      <span className={styles.moreText}>…and more!</span>
                    </div>
                  )
                )}
              </div>
              <div className={styles.cycleSpacer} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.fadeLeft} aria-hidden="true" />
          <div className={styles.fadeRight} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
