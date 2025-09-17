import styles from "./FAQSection.module.css";

const QA = [
  {
    q: "診断にはどのくらい時間がかかりますか？",
    a: "質問は約8分で完了します。いくつかの簡単な質問にお答えいただくだけで、あなたの金銭傾向が明らかになります。",
  },
  {
    q: "診断はどのくらい正確ですか？",
    a: "行動経済学に基づくロジックと、専門家のヒアリング結果を反映して設計しています。個人差はありますが、タイプ把握の精度向上に寄与します。",
  },
  {
    q: "本当に無料ですか？ しつこい勧誘はありませんか？",
    a: "はい、無料です。メールの購読や決済は不要です。診断の結果を活用した学習案内をお送りしますが、強制購入は一切ありません。",
  },
  {
    q: "診断結果はどのように役立ちますか？",
    a: "ご自身の強み/弱みや向いた運用スタイルが分かるため、学習範囲の優先順位づけや家計の意思決定に活用できます。",
  },
];

export default function FAQSection() {
  return (
    <section className={`section bg-white ${styles.section}`} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <h2 id="faq-title" className={styles.heading}>よくある質問</h2>

        <div className={styles.list}>
          {QA.map((item) => (
            <details key={item.q} className={styles.qa}>
              <summary className={styles.q}>
                <span className={styles.qText}>{item.q}</span>
                <span className={styles.hint}>タップで開く</span>
              </summary>
              <p className={styles.a}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
