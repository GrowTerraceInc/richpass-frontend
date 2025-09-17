import Button from "@/app/components/ui/Button";
import styles from "./FinalCTASection.module.css";
import Link from "next/link";

export default function FinalCTASection() {
  return (
    <section className={styles.wrap} aria-labelledby="diag-final-cta">
      <div className="container container--md">
        <h2 id="diag-final-cta" className={styles.title}>
          さあ、<br className={styles.brSmOnly} />
          あなたの未来を変える
          <br />
          第一歩を踏み出そう。
        </h2>

        <div className={styles.btnArea}>
          <Link href="/diagnosis/quiz" aria-label="無料で診断を始める">
          <Button
            variant="secondary"
            size="large"
            className={styles.ctaButton}
            aria-label="無料で診断を始める"
          >
            無料で診断を始める
          </Button>
          </Link>
        </div>

        <p className={styles.note}>アカウント登録は不要です</p>
      </div>
    </section>
  );
}
