"use client";

import styles from "./FinalCTASection.module.css";
import Button from "../ui/Button";
import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className={`${styles.finalCtaSection} section bg-brand-100`} aria-labelledby="final-cta-title">
      <div className={`container container--md`}>
        <h2 id="final-cta-title" className={`${styles.heading} h2`}>
          さあ、あなたもリッチパスで
          <br className={styles.br} />
          新しい一歩を踏み出そう
        </h2>

        <div className={styles.ctaWrap}>
          <Link href="/diagnosis" aria-label="無料で診断を始める">
          <Button variant="primary" size="large">まずは無料で診断する</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
